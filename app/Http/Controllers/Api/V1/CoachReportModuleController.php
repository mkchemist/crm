<?php

namespace App\Http\Controllers\Api\V1;

use App\CoachReport;
use App\Helpers\CycleHelper;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CoachReportModuleController extends Controller
{


    protected $user;


    public function __construct()
    {
      $this->middleware(function($request, $next) {
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
      $reps = $this->coachReps();

      $reports = DB::table('coach_reports as report')
      ->select(
        'report.visit_date as date',
        'coach.name as coach_name',
        'rep.name as rep_name',
        'rep.line as line',
        DB::raw('COUNT(report.customer_id) as visits')
      )->join('users as coach','coach.id' ,'=','report.coach_id')
      ->join('users as rep', 'rep.id', '=', 'report.rep_id')
      ->join('customers as customer','customer.id', '=','report.customer_id')
      ->whereIn('rep_id', $reps);

      if(request()->coach) {
        $reports = $reports->where('report.coach_id', request()->coach);
      }

      $reports = CycleHelper::getCycleData($reports,'report.visit_date');

      $reports = $reports->groupBy('report.visit_date','coach.name','rep.name', 'rep.line')->get();

      return response([
        'code'  =>  200,

        'reps'  =>  $reps,
        "coach" =>  request()->coach ?? null,
        "data"     =>  $reports
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    /**
     * get all reps related to current user
     *
     * @return array
     */
    private function coachReps() {
      $relations = json_decode($this->user->user_relations);
      return  $relations->reps;
    }
}
