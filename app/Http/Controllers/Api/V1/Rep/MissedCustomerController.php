<?php

namespace App\Http\Controllers\Api\V1\Rep;

use App\Helpers\Setting\ActiveCycleSetting;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MissedCustomerController extends Controller
{
    public function index()
    {
      $user = Auth::user();
      $active = new ActiveCycleSetting;
      $cycle = $active->all();
      $today = date('20y-m-d');
      $reports =DB::table('planners as plan')
      ->select(
        'customer.name as Customer',
        'customer.specialty as Specialty',
        'rep.name as Rep',
        'param.current as Parameter',
        'customer.brick as Brick',
        'customer.address as Address',
        'customer.area as Area',
        DB::raw('count(DISTINCT plan.plan_date) as CountOfPlans'),
        DB::raw('count(DISTINCT report.visit_date) as CountOfVisits'),
        DB::raw('count(DISTINCT plan.plan_date) - count(DISTINCT report.visit_date) as difference')
      )->join('customers as customer', 'customer.id', '=', 'plan.customer_id')
      ->join('users as rep', 'rep.id', '=', 'plan.user_id')
      ->leftJoin('customer_parameters as param' , function($join) {
        $join->on('param.user_id', '=', 'plan.user_id');
        $join->on('param.customer_id', '=', 'plan.customer_id');
      })->leftJoin('customer_reports as report', function($join) {
        $join->on('report.user_id', '=', 'plan.user_id');
        $join->on('report.customer_id', '=', 'plan.customer_id');
      })
      ->where('plan.user_id',$user->id)
      ->whereBetween('plan.plan_date', [$cycle->start, $today])
      ->whereBetween('report.visit_date', [$cycle->start, $today])
      ->groupBy('Customer','Specialty','Rep','Parameter','brick','address','area')
      ->having('Difference', '!=', 0)
      ->get();

      return response([
        'code'  =>  200,
        'data'  =>  $reports,
      ]);
    }
}
