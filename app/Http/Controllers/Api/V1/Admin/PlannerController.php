<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Helpers\ResponseHelper;
use App\Helpers\Setting\ActiveCycleSetting;
use App\Http\Controllers\Controller;
use App\Planner;
use App\WorkplacePlanner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class PlannerController extends Controller
{

  public function index()
  {
    $activeCycle= new ActiveCycleSetting;
    $data = $activeCycle->all();
    /**
     * pm plans
     */
    $pm = DB::table('planners as plan')
    ->select(
      'plan.plan_date as Date',
      'user.name as Rep',
      'plan.user_id as user_id',
      'customer.name as Customer',
      'customer.specialty as Specialty',
      'parameter.current as Parameter',
      'frequency.current as Frequency',
      'plan.submitted as submitted',
      'customer.brick as Brick',
      'customer.area as Area',
      'customer.district as District',
      'customer.territory as Territory',
      'plan.approved as approved'
    )->leftJoin('customers as customer', 'customer.id', '=', 'plan.customer_id')
    ->leftJoin('users as user', 'user.id', '=', 'plan.user_id')
    ->leftJoin('customer_parameters as parameter', function($join) {
      $join->on('parameter.customer_id', '=', 'plan.customer_id');
      $join->on('parameter.user_id', '=', 'plan.user_id');
    })->leftJoin('customer_frequencies as frequency', function($join) {
      $join->on('frequency.customer_id', '=', 'plan.customer_id');
      $join->on('frequency.user_id', '=', 'plan.user_id');
    });
    if(request()->user) {
      $pm = $pm->where('plan.user_id', request()->user);
    }
    if($data) {
      $pm = $pm->whereBetween('plan.plan_date', [$data->start, $data->end]);
    }
    $pm = $pm->get();
    /**
     * am plans
     */
    $am = $this->buildPlansQuery(request(), WorkplacePlanner::class, 'plan_date')
    ->with(['user', 'workplace'])->orderBy('plan_date')->get();
    /** response */
    return response([
      'code'  =>  200,
      'data'  =>  [
        'am'  =>  $am,
        'pm'  =>  $pm
      ]
    ]);
  }

  /**
   * build planner query
   *
   *
   * @param \Illuminate\Http\Request $request
   * @param string $model [model class name]
   * @param string $date [date column name]
   * @return Model
   */
  private function buildPlansQuery(Request $request, string $model, string $date)
  {
    $plans = $model::query();
    if($request->user) {
      $plans = $plans->where('user_id', $request->user);
    }

    $activeCycle = new ActiveCycleSetting;
    $data = $activeCycle->all();
    if($data) {
      $plans = $plans->whereBetween($date, [$data->start, $data->end]);
    }
    return $plans;
  }

  /**
   * approve or reset plans
   *
   *
   * @param \Illuminate\Http\Request $request
   * @return \Illuminate\Http\Response
   */
  public function approvalAction(Request $request)
  {
    $validator = Validator::make($request->all(),[
      'action'  =>  [
        'required',
        Rule::in(['approved','approved-all','reset', 'reset-all'])
      ]
    ]);
    if($validator->fails()) {
      return response(ResponseHelper::validationErrorResponse($validator));
    }
    $admin = Auth::user();

    $active = new ActiveCycleSetting;
    $cycle = $active->all();

    $plans = Planner::whereBetween('plan_date', [$cycle->start, $cycle->end]);
    $workplacePlans = WorkplacePlanner::whereBetween('plan_date', [$cycle->start, $cycle->end]);
    // detect if action for single user or for all
    if(in_array($request->action,['approved', 'reset'])) {
      $plans = $plans->where(['user_id' => $request->user]);
      $workplacePlans = $workplacePlans->where(['user_id' => $request->user]);
    }
    // detect action type
    $action = in_array($request->action,['approved', 'approved-all']) ? true : false;

    if($action) {
      $plans = $plans->where(['submitted' => false]);
    } else {
      $plans = $plans->where(['submitted' => true]);
    }

    $plans->update([
      'submitted' => $action,
      'approved' => $action,
      'approved_by' =>  $admin->id
    ]);
    $workplacePlans->update([
      'submitted' => $action,
      'approved' => $action,
      'approved_by' =>  $admin->id
    ]);
    return response([
      'code'  =>  200,
      'message' =>  sprintf("%s", $action === true ? 'Plans approved': 'Plans rejected' ),
      'action'  =>  $action,
      'status'  =>  $request->action
    ]);
  }

}
