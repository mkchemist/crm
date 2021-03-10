<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ResponseHelper;
use App\Helpers\Setting\ReportIntervalSetting;
use App\Http\Controllers\Controller;
use App\PharmacyReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PharmacySingleVisitController extends Controller
{
    /**
     * Auth user
     *
     * @var User
     */
    protected $user;

    /**
     * report interval
     *
     * @var ReportIntervalSetting
     */
    protected $interval;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = Auth::user();
            $this->interval = new ReportIntervalSetting;

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
        $reports = PharmacyReport::with([
            'pharmacy' => function ($query) {
                $query->select(
                    'name', 'id', 'area', 'address', 'brick',
                    'district', 'territory', 'type', 'key_person',
                );
            },
            'user' => function ($query) {
                $query->select('id', 'name', 'role', 'user_relations');
            },
        ])->whereIn('user_id', $this->subOrdinate())
        ->get([
            'id', 'pharmacy_id', 'products', 'general_feedback',
            'visit_date', 'user_id',
        ]);

        return response([
            'code' => 200,
            'data' => $reports,
        ], 200);
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
            'pharmacy_id' => 'required|numeric',
            'date' => 'required|date',
            'products' => 'required|json',
            'feedback' => 'required|string',
        ]);
        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }

        if (!$this->interval->isValidDateInterval($request->date)) {
            return response(ResponseHelper::InvalidDateRange(
                $request->date, $this->interval->all()
            ));
        }

        $isExists = $this->isExists($request->date, $request->pharmacy_id);

        if ($isExists) {
            return response(ResponseHelper::ITEM_ALREADY_EXIST);
        }

        PharmacyReport::create([
            'pharmacy_id' => $request->pharmacy_id,
            'visit_date' => $request->date,
            'user_id' => $this->user->id,
            'products' => $request->products,
            'general_feedback' => $request->feedback,
        ]);
        return response([
            'code' => 200,
            'message' => 'Report Added Successfully',
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $report = PharmacyReport::with(['pharmacy', 'user'])
        ->where([
          'user_id' => $this->user->id,
          'id'      =>$id
        ])->first();

        if (!$report) {
            return response(ResponseHelper::INVALID_ID);
        }

        return response([
            'code' => 200,
            'data' => $report,
        ], 200);
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
        $validator = Validator::make($request->all(), [
            'date' => 'required|date',
            'products' => 'required|json',
            'feedback' => 'required|string',
        ]);
        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }

        if (!$this->interval->isValidDateInterval($request->date)) {
            return response(ResponseHelper::InvalidDateRange(
                $request->date, $this->interval->all()
            ));
        }

        /* $report = $this->isExists($request->date, $request->pharmacy_id);

        if (!$report && ($report->visit_date !== $request->date)) {
            return response(ResponseHelper::INVALID_ID);
        } */
        $report = $this->isExists(null, null, $id);
        if(!$report) {
          return response(ResponseHelper::INVALID_ID);
        }
        $isExists = $this->isExists($request->date);
        if($isExists && $report->visit_date !== $isExists->visit_date) {
          return response([
            $isExists,
            $report
          ]);
          return response(ResponseHelper::ITEM_ALREADY_EXIST);
        }

        $report->products = $request->products;
        $report->general_feedback = $request->feedback;

        if ($this->interval->canEditReportDate()) {
            $report->visit_date = $request->date;
        }

        $report->save();

        return response([
            'code' => 200,
            'message' => 'Report Added Successfully',
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $report = $this->isExists(null, null, $id);

        if (!$report) {
            return response(ResponseHelper::INVALID_ID);
        }
        $report->delete();
        return response([
            'code' => 200,
            'message' => 'Report Deleted',
        ], 200);
    }

    /**
     * check if the report exists
     *
     * @param string $date [report date]
     * @param int $pharmacy [pharmacy_id]
     * @param int $id [report id]
     * @return PharmacyReport
     */
    private function isExists($date = null, $pharmacy = null, $id = null)
    {
        $report = PharmacyReport::where('user_id', $this->user->id);

        if ($date) {
            $report = $report->where('visit_date', $date);
        }

        if ($pharmacy) {
            $report = $report->where('pharmacy_id', $pharmacy);
        }

        if ($id) {
            $report = $report->where('id', $id);
        }

        $report = $report->first();

        return $report;
    }

    /**
     * get current user sub-ordinate
     *
     * @return array
     */
    private function subOrdinate(): array
    {
        $users = [$this->user->id];
        $relations = json_decode($this->user->user_relations);
        switch ($this->user->role) {
            case 'rm':
                $users = array_merge($users, $relations->am, $relations->dm);
                break;
            case 'am':
                $users = array_merge($users, $relations->dm);
                break;
            default:
                break;
        }
        return $users;
    }

}
