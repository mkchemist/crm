<?php

namespace App\Http\Controllers\Api\V1\Admin\Reports;

use App\Helpers\Setting\ActiveCycleSetting;
use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MissedVisitsReportController extends Controller
{
    public function index()
    {
      $user = request()->user;
      $activeCycle = new ActiveCycleSetting;
      $active =$activeCycle->all();
      $today = date('20y-m-d');
      $reports = DB::table('planners as plan')
      ->select(
        'plan.plan_date as Date',
        'customer.name as Customer',
        'customer.specialty as Specialty',
        'customer.area as Area',
        'customer.brick as Brick',
        'customer.district as District',
        'customer.territory as Territory',
        'user.name as Rep',
        'user.id as user_id',
        'param.current as Parameter',
        'freq.current as Freq',
        'report.visit_date as VisitDate'
      )->join('customers as customer', 'customer.id', '=', 'plan.customer_id')
      ->join('users as user', 'user.id', '=', 'plan.user_id')
      ->leftJoin('customer_parameters as param', function($join) {
        $join->on('param.customer_id', '=', 'plan.customer_id');
        $join->on('param.user_id', '=', 'plan.user_id');
      })->leftJoin('customer_frequencies as freq', function($join) {
        $join->on('freq.customer_id', '=', 'plan.customer_id');
        $join->on('freq.user_id', '=', 'plan.user_id');
      })->leftJoin('customer_reports as report', function($join) {
        $join->on('report.customer_id', '=', 'plan.customer_id');
        $join->on('report.user_id', '=', 'plan.user_id');
      })->where('report.visit_date',NULL);
      $userData = null;
      if($user !== null) {
        $userData = User::find($user);
        if($userData) {
          $relations = json_decode($userData->user_relations);
          $reports->whereIn('plan.user_id', $relations->reps);
        }
      }

      $reports = $reports->whereBetween('plan.plan_date', [$active->start, $today])->get();
      return response([
        'code'  =>  200,
        'data'  =>  $reports,

      ]);
    }
}
