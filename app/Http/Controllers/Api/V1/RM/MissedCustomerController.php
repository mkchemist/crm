<?php

namespace App\Http\Controllers\Api\V1\RM;

use App\Helpers\Setting\ActiveCycleSetting;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MissedCustomerController extends Controller
{
    /**
     * get all missed customers
     * in all given regional manager territory
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $users = $this->getQueryUser();
      $dateRange = $this->getQueryDateRange();

      $reports = DB::table('planners as plan')
      ->select(
        'rep.name as rep_name',
        'plan.user_id as user_id',
        'customer.name as customer_name',
        'customer.specialty as specialty',
        'customer.brick as brick',
        'customer.area as area',
        'customer.district as district',
        'param.current as parameter',
        'freq.current as frequency',
        DB::raw('count(DISTINCT plan.plan_date) as count_of_plans'),
        DB::raw('count(DISTINCT report.visit_date) as count_of_visits'),
        DB::raw('count(DISTINCT plan.plan_date) - count(DISTINCT report.visit_date) as difference')
      )->join('customers as customer', 'customer.id' , '=' , 'plan.customer_id')
      ->join('users as rep', 'rep.id', '=', 'plan.user_id')
      ->leftJoin('customer_reports as report', function($join) {
        $join->on('report.customer_id', '=', 'plan.customer_id');
        $join->on('report.user_id', '=', 'plan.user_id');
      })->leftJoin('customer_parameters as param', function($join) {
        $join->on('param.customer_id', '=', 'plan.customer_id');
        $join->on('param.user_id', '=', 'plan.user_id');
      })->leftJoin('customer_frequencies as freq', function($join) {
        $join->on('freq.customer_id', '=', 'plan.customer_id');
        $join->on('freq.user_id', '=', 'plan.user_id');
      })->whereBetween('plan.plan_date', $dateRange)
      ->whereIn('plan.user_id', $users)
      ->having('difference', '!=', 0)
      ->groupBy(
        'rep_name', 'customer_name','specialty',
        'brick', 'area', 'district','user_id',
        'parameter', 'frequency'
        )->get();

      return response([
        'code'  =>  200,
        'data'  =>  $reports
      ]);
    }

    /**
     * get query users
     * check if the users sent over http
     * it will return the users
     * otherwise it will return all related user to
     * the given regional manager
     *
     * @return array
     */
    private function getQueryUser()
    {
      if(request()->users && request()->users !== "null") {
        return json_decode(request()->users);
      }
      $user = Auth::user();
      $reps = json_decode($user->user_relations)->reps;
      return $reps;
    }


    /**
     * get date query range
     * check if the range sent over http
     * otherwise it will get current active cycle as a start
     * and today as end
     *
     * @return array
     */
    private function getQueryDateRange()
    {

      /** default start and end */

      $activeCycle = new ActiveCycleSetting;
      $cycle = $activeCycle->all();
      $start = $cycle->start;
      $end = date('20y-m-d');

      if(request()->start &&request()->start !== "null") {
        $start = request()->start;
      }

      if(request()->end &&request()->end !== "null") {
        $end = request()->end;
      }

      return [
        $start,
        $end
      ];
    }
}
