<?php

namespace App\Http\Controllers\Api\V1\DM;

use App\Helpers\Setting\ActiveCycleSetting;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MissedCustomerController extends Controller
{
    /**
     * get missed customers for the authored manager
     *
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $user = Auth::user();
      $reps = json_decode($user->user_relations)->reps;
      $active = new ActiveCycleSetting;
      $cycle = $active->all();
      $from = $cycle->start;
      $to = date('20y-m-d');
      if(request()->from_date !== "null") {
        $from = request()->from_date;
      }
      if(request()->to_date !== "null") {
        $to = request()->to_date;
      }
      $reports = DB::table('planners as plan')
      ->select(
        'user.name as rep',
        'plan.user_id as user_id',
        'customer.name as customerName',
        'customer.specialty as specialty',
        'customer.brick as brick',
        'customer.area as area',
        'param.current as parameter',
        'freq.current as frequency',
        DB::raw('count(DISTINCT plan.plan_date) as countOfPlans'),
        DB::raw('count(DISTINCT report.visit_date) as countOfVisits'),
        DB::raw('count(DISTINCT plan.plan_date) - count(DISTINCT report.visit_date) as difference')
      )->join('users as user','user.id', '=', 'plan.user_id')
      ->join('customers as customer', 'customer.id', '=', 'plan.customer_id')
      ->leftJoin('customer_reports as report', function($join) {
        $join->on('report.customer_id', '=', 'plan.customer_id');
        $join->on('report.user_id', '=', 'plan.user_id');
      })->leftJoin('customer_parameters as param', function($join) {
        $join->on('param.customer_id', '=', 'plan.customer_id');
        $join->on('param.user_id', '=', 'plan.user_id');
      })->leftJoin('customer_frequencies as freq', function($join) {
        $join->on('freq.customer_id', '=', 'plan.customer_id');
        $join->on('freq.user_id', '=', 'plan.user_id');
      })
      ->whereBetween('plan.plan_date', [$from, $to])
      ->whereIn('plan.user_id',$reps)
      ->groupBy('rep','customerName','specialty','brick', 'area','parameter', 'frequency','user_id')
      ->having('difference', '!=', 0)
      ->get();



      return response([
        'code'  =>  200,
        'data'  =>  $reports,
        'from_date'  =>  request()->from_date,
        'to_date'    =>  request()->to_date,
        'from'  =>  $from,
        'to'    =>  $to
      ]);
    }
}
