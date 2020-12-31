<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Helpers\Setting\ActiveCycleSetting;
use App\Http\Controllers\Controller;
use App\Planner;
use Illuminate\Http\Request;

class PlannerController extends Controller
{

  public function index()
  {
    $plans = $this->buildPlansQuery(request());
    return response([
      'code'  =>  200,
      'data'  =>  $plans
    ]);
  }

  /**
   * build planner query
   *
   *
   * @param \Illuminate\Http\Request $request
   */
  private function buildPlansQuery(Request $request)
  {
    $plans = Planner::query();
    if($request->user) {
      $plans = $plans->where('user_id', $request->user);
    }

    $activeCycle = new ActiveCycleSetting;
    $data = $activeCycle->all();
    if($data) {
      $plans = $plans->whereBetween('plan_date', [$data->start, $data->end]);
    }
    $plans = $plans->ge();
    return $plans;
  }
}
