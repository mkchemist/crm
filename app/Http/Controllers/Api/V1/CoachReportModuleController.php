<?php

namespace App\Http\Controllers\Api\V1;

use App\CoachReport;
use App\Helpers\CycleHelper;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\Shared\CoachReportTableViewResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CoachReportModuleController extends Controller
{

    protected $user;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = Auth::user();
            return $next($request);
        });
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        $reports = DB::table('coach_reports as report')
            ->select(
                'report.visit_date as date',
                'coach.name as coach_name',
                'rep.name as rep_name',
                'rep.line as line',
                'report.rep_id as rep_id',
                'report.coach_id as coach_id',
                'report.day_submitted as submitted',
                'report.day_summery as summery',
                'am.name as Area_Manager',
                'rm.name as Business_Unit',
                DB::raw('COUNT(report.customer_id) as visits')
            )->join('users as coach', 'coach.id', '=', 'report.coach_id')
            ->join('users as rep', 'rep.id', '=', 'report.rep_id')
            ->leftJoin('users as am', 'am.id', '=', DB::raw('JSON_EXTRACT(rep.user_relations,"$.am[0]")'))
            ->leftJoin('users as rm', 'rm.id', '=', DB::raw('JSON_EXTRACT(rep.user_relations,"$.rm[0]")'))
            ->join('customers as customer', 'customer.id', '=', 'report.customer_id');

        if ($this->user->role !== "admin") {
            $reports = $reports->whereIn('rep_id', $this->coachReps());
        }

        if (request()->coach) {
            $reports = $reports->where('report.coach_id', request()->coach);
        }

        $cycle = null;
        if (request()->start && request()->end) {
            $cycle = [request()->start, request()->end];
        }

        $reports = CycleHelper::getCycleData($reports, 'report.visit_date', $cycle);

        $reports = $reports->groupBy(
            'report.visit_date', 'coach.name', 'rep.name',
            'rep.line', 'report.rep_id', 'report.coach_id',
            'report.day_submitted', 'report.day_summery',
            'am.name','rm.name'
        )->get();

        return response([
            'code' => 200,
            "coach" => request()->coach ?? null,
            "data" => $reports,
            "cycle" => $cycle,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'coach_id' => 'required|int',
            'coach' => 'required|json',
            'rep_id' => 'required|int',
            'customer_id' => 'required|int',
            'visit_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }

        CoachReport::create([
            'coach_id' => $request->coach_id,
            'rep_id' => $request->rep_id,
            'visit_date' => $request->visit_date,
            'data' => $request->coach,
            'customer_id' => $request->customer_id,
        ]);

        return response([
            'data' => 200,
            'message' => 'Coach Report submitted',
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        if (!is_numeric($id)) {
            return response(ResponseHelper::BAD_REQUEST_INPUT);
        }

        $report = CoachReport::with(['customer', 'rep', 'coach', 'customer.params', 'customer.frequency'])
            ->where(['id' => $id]);
        if ($this->user->role !== "admin") {
            $report = $report->whereIn('rep_id', $this->coachReps());
        }
        $report = CycleHelper::getCycleData($report, 'visit_date')->first();

        if (!$report) {
            return response(ResponseHelper::INVALID_ID);
        }

        return response([
            'code' => 200,
            'data' => $report,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        if (!is_numeric($id)) {
            return response(ResponseHelper::BAD_REQUEST_INPUT);
        }
        $validator = Validator::make($request->all(), [
            'data' => 'required|json',
            'date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }

        $report = CoachReport::where([
            'id' => $id,
            'coach_id' => $this->user->id,
        ])->whereIn('rep_id', $this->coachReps())
            ->first();

        if (!$report) {
            return response(ResponseHelper::INVALID_ID);
        }

        $report->update([
            'data' => $request->data,
            'visit_date' => $request->date,
        ]);

        return response([
            'code' => 200,
            'message' => 'Visit updated',
        ]);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $report = CoachReport::where([
            'id' => $id,
        ]);
        if ($this->user->role !== "admin") {
            $report = $report->where('coach_id', $this->user->id);
        }
        $report->delete();

        return response([
            'code' => 200,
            'message' => 'Visit Deleted',
        ]);
    }

    /**
     * clear coaching day
     *
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function clearDay(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rep' => 'required|int',
            'coach' => 'required|int',
            'date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }

        $reports = CoachReport::where([
            'visit_date' => $request->date,
            'rep_id' => $request->rep,
        ]);
        if ($this->user->role !== "admin") {
            $reports = $reports->where('coach_id', $this->user->id);
        }
        $reports->delete();
        return response([
            'code' => 200,
            'message' => 'Coaching Report Deleted',
        ]);
    }

    /**
     * get all reps related to current user
     *
     * @return array
     */
    private function coachReps()
    {
        if($this->user->role === "rep") {
          return [$this->user->id];
        }
        $relations = json_decode($this->user->user_relations);
        return $relations->reps;
    }

    /**
     * get coaching day reports
     *
     *
     * @return \Illuminate\Http\Response
     */
    public function coachDay()
    {
        $validator = Validator::make(request()->all(), [
            'coach' => 'required|numeric',
            'rep' => 'required|numeric',
            'date' => 'required|date',
        ]);
        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }
        $reports = CoachReport::where([
            'rep_id' => request()->rep,
            'coach_id' => request()->coach,
            'visit_date' => request()->date,
        ])->with(['customer', 'rep', 'coach', 'customer.params']);

        $reports = CycleHelper::getCycleData($reports, 'visit_date')->get();
        if (!count($reports)) {
            return response(ResponseHelper::INVALID_ID);
        }

        return response([
            'code' => 200,
            'data' => $reports,
        ]);
    }

    /**
     * Submit coaching day
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function submitDay(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'coach' => 'required|int',
            'rep' => 'required|int',
            'date' => 'required|date',
            'summery' => 'required|json',
        ]);

        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }

        $reports = CoachReport::where([
            'coach_id' => $request->coach,
            'rep_id' => $request->rep,
            'visit_date' => $request->date,
        ]);
        $reports = CycleHelper::getCycleData($reports, 'visit_date');
        $reports->update([
            'coach_submit' => true,
            'day_submitted' => true,
            'day_summery' => $request->summery,
        ]);

        return response([
            'code' => 200,
            'message' => sprintf("Date %s submitted", $request->date),
        ]);
    }

    /**
     * get raw reports
     * that will be used in report analysis
     *
     * @return \Illuminate\Http\Response
     */
    public function rawReports()
    {
        $reports = CoachReport::with('rep')
            ->whereIn('rep_id', $this->coachReps());

        $reports = CycleHelper::getCycleData($reports, 'visit_date');

        $reports = $reports->get();

        return response([
            'code' => 200,
            'data' => $reports,
        ]);
    }

    public function tableView()
    {
        $reports = CoachReport::with(['customer','rep','coach', 'customer.params']);

        if ($this->user->role !== "admin") {
            $reports = $reports->whereIn('rep_id', $this->coachReps());
        }

        if (request()->coach) {
            $reports = $reports->where('report.coach_id', request()->coach);
        }

        $cycle = null;
        if (request()->start && request()->end) {
            $cycle = [request()->start, request()->end];
        }

        $reports = CycleHelper::getCycleData($reports, 'visit_date', $cycle);

        $reports = $reports->orderBy('visit_date')->get();

        return response([
            'code' => 200,
            "coach" => request()->coach ?? null,
            "data" =>  CoachReportTableViewResource::collection($reports),
            "cycle" => $cycle,
        ]);
    }

}
