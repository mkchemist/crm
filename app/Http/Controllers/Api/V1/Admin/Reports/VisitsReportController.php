<?php

namespace App\Http\Controllers\Api\V1\Admin\Reports;

use App\Helpers\Setting\ActiveCycleSetting;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\RepCustomerVisitResource;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VisitsReportController extends Controller
{
    public function index()
    {
      $userId = request()->user;
      $active = new ActiveCycleSetting;
      $cycle = $active->all();
      $reports = DB::table('customer_reports as report')
      ->select(
        'customer.*',
        'user.name as rep',
        'user.id as user_id',
        'report.visit_date as date',
        'report.products as products',
        'report.comment as comment',
        'report.general_feedback as general_feedback',
        'cp.current as parameter',
        'cf.current as frequency',
        'coach1.name as coach1_name',
        'coach2.name as coach2_name',
        'plan.plan_date as plan_date'
      )->join('customers as customer', 'customer.id', '=', 'report.customer_id')
      ->join('users as user', 'user.id', '=', 'report.user_id')
      ->leftJoin('users as coach1', 'coach1.id', '=', 'report.dual_with')
      ->leftJoin('users as coach2', 'coach2.id', '=', 'report.coach2_id')
      ->leftJoin('customer_parameters as cp', function($join) {
        $join->on('cp.user_id','=', 'report.user_id');
        $join->on('cp.customer_id','=', 'report.customer_id');
      })->leftJoin('customer_frequencies as cf', function($join) {
        $join->on('cf.user_id','=', 'report.user_id');
        $join->on('cf.customer_id','=', 'report.customer_id');
      })->leftJoin('planners as plan', function($join) {
        $join->on('plan.user_id','=', 'report.user_id');
        $join->on('plan.customer_id','=', 'report.customer_id');
        $join->on('plan.plan_date','=', 'report.visit_date');
      });

      if($userId) {
        $user = User::find($userId);
        if($user) {
          $relations = json_decode($user->user_relations);
          $reports = $reports->whereIn('report.user_id', $relations->reps);
        }
      }
      $reports = $reports->whereBetween('report.visit_date', [$cycle->start, $cycle->end]);
      $reports = $reports->get();

      return response([
        'code'  =>  200,
        'data'  =>  RepCustomerVisitResource::collection($reports)
      ]);
    }
}
