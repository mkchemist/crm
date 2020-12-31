<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Helpers\Setting\ActiveCycleSetting;
use App\Http\Controllers\Controller;
use App\Planner;
use App\WorkplacePlanner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PlannerController extends Controller
{

  public function index()
  {
    $pm_plans = $this->buildPlansQuery(request(), Planner::class, 'plan_date')
    ->with(['user', 'customer'])->orderBy('plan_date')->get();
    $am_plans = $this->buildPlansQuery(request(), WorkplacePlanner::class, 'plan_date')
    ->with(['user', 'workplace'])->orderBy('plan_date')->get();
    return response([
      'code'  =>  200,
      'data'  =>  [
        'am'  =>  $am_plans,
        'pm'  =>  $pm_plans
      ]
    ]);
  }

  /**
   * build planner query
   *
   *
   * @param \Illuminate\Http\Request $request
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
}
