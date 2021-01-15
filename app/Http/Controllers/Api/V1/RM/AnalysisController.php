<?php

namespace App\Http\Controllers\Api\V1\RM;

use App\Customer;
use App\Helpers\Setting\ActiveCycleSetting;
use App\Http\Controllers\Controller;
use App\Http\Resources\RM\CustomerResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AnalysisController extends Controller
{
    /**
     * current auth user
     *
     */
    private $user;

    /**
     * current active cycle
     *
     */
    private $cycle;

    /**
     * user related reps
     *
     * @var array
     */
    private $reps;

    public function __construct()
    {
      $this->middleware(function($request, $next) {
        $this->user = Auth::user();
        $this->reps = json_decode($this->user->user_relations)->reps;
        $cycle = new ActiveCycleSetting;
        $this->cycle = $cycle->all();
        return $next($request);
      });
    }

    /**
     * generate PM reports analysis
     *
     *
     * @return \Illuminate\Http\Response
     */
    public function pmAnalysis()
    {
        $range =[
          $this->cycle->start,
          date('20y-m-d')
        ];
        $plans = $this->getPlanDetails($this->reps, $range);

        $reports = $this->getReportDetails($this->reps, $range);
        return response([
            'code' => 200,
            'plans' => $plans,
            'reports' => $reports,
        ]);
    }

    /**
     * collect plan details
     *
     *
     * @param array $reps
     * @param array $range
     */
    private function getPlanDetails($reps, $range)
    {
        $plans = DB::table('planners as plan')
            ->select(
                'user.name as rep',
                'plan.user_id as user_id',
                DB::raw('count(distinct plan.plan_date) as days'),
                DB::raw('count(plan.customer_id) as total'),
                DB::raw('count(distinct plan.customer_id) as distinct_customer'),
                DB::raw('count(plan.customer_id) / count(distinct plan.plan_date) as avg')
            )->join('users as user', 'user.id', '=', 'plan.user_id')
            ->whereIn('plan.user_id', $reps)
            ->whereBetween('plan.plan_date', $range)
            ->groupBy('rep', 'user_id')
            ->get();
        return $plans;
    }

    /**
     * collect report details
     *
     * @param array $reps
     * @param array $range
     */
    private function getReportDetails($reps, $range)
    {
        $reports = DB::table('customer_reports as report')
            ->select(
                'user.name as rep',
                'report.user_id as user_id',
                DB::raw('count(distinct report.visit_date) as days'),
                DB::raw('count(report.customer_id) as total'),
                DB::raw('count(distinct report.customer_id) as distinct_customer'),
                DB::raw('count(report.customer_id) / count(distinct report.visit_date) as avg'),
                DB::raw('count(report.dual_with) as coach_visits')
            )->join('users as user', 'user.id', '=', 'report.user_id')
            ->whereIn('report.user_id', $reps)
            ->whereBetween('report.visit_date', $range)
            ->groupBy('rep', 'user_id')
            ->get();
        return $reports;
    }

    /**
     * AM report analysis
     *
     * @return \Illuminate\Http\Response
     */
    public function amAnalysis()
    {
      $end = date('20y-m-d');
      $reports = DB::table('workplace_planners as plan')
      ->select(
        'user.name as rep',
        'user.id as user_id',
        DB::raw('count(DISTINCT plan.id) as total_planned'),
        DB::raw('count(DISTINCT report.id) as visits'),
        DB::raw('count(DISTINCT plan.workplace_id) as planned_workplaces'),
        DB::raw('count(DISTINCT report.workplace_id) as covered_workplaces'),
        DB::raw('count(DISTINCT report.visit_date) as working_days'),
        DB::raw('(count(DISTINCT report.id)/count(DISTINCT report.visit_date)) as avg')
      )->join('users as user', 'user.id', '=', 'plan.user_id')
      ->leftJoin('workplace_reports as report', function($join) {
          $join->on('report.user_id', '=', 'plan.user_id');
          $join->on('report.workplace_id', '=', 'plan.workplace_id');
      })
      ->groupBy('rep', 'user_id')
      ->whereIn('plan.user_id', $this->reps)
      ->whereBetween('plan.plan_date', [$this->cycle->start, $end])
      ->get();


      return response([
        'code'  =>  200,
        'data'  =>  $reports
      ]);
    }

    /**
     * Plan analysis report
     *
     * @return \Illuminate\Http\Response
     */
    public function planAnalysis()
    {
      $customers = Customer::with(['params', 'frequency', 'planner','frequency.user'])
      ->whereIn('id', function($query) {
        $query->from('customer_frequencies')
        ->select('customer_id')
        ->whereIn('user_id', $this->reps)
        ->get();
      })
      ->orderBy('name')
      ->get();

      return response([
        'code'  =>  200,
        'data'  =>  CustomerResource::collection($customers)
      ]);
    }
}
