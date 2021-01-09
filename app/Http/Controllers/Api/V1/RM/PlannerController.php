<?php

namespace App\Http\Controllers\Api\V1\RM;

use App\CoachPlanner;
use App\Helpers\CycleHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\RM\CoachPlannerResource;
use App\Http\Resources\RM\CustomerPlannerResource;
use App\Http\Resources\RM\RepWorkplacePlanResource;
use App\Planner;
use App\User;
use App\WorkplacePlanner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PlannerController extends Controller
{
    /**
     * get all district managers plans
     *
     *
     * @return \Illuminate\Http\Response
     */
    public function coachPlans()
    {

      $plans = CoachPlanner::with(['coach', 'rep']);
      $plans = CycleHelper::getCycleData($plans, 'plan_date');

      $plans = $this->queryRequestUsers($plans, 'rep_id','userId');
      $plans = $plans->orderBy('plan_date')->get();
      return response([
        'code'  =>  200,
        'data'  =>  CoachPlannerResource::collection($plans),
      ]);
    }

    /**
     * get all rep am plans
     *
     * @return \Illuminate\Http\Response
     */
    public function repAmPlans()
    {

      $plans= WorkplacePlanner::with(['user', 'workplace']);

      $plans = CycleHelper::getCycleData($plans, 'plan_date');

      $plans = $this->queryRequestUsers($plans);

      $plans = $plans->orderBy('plan_date')->get();

      return response([
        'code'  =>200,
        'data'  =>  RepWorkplacePlanResource::collection($plans)
      ]);


    }

    /**
     * get all reps pm plans
     *
     *
     * @return \Illuminate\Http\Response
     */
    public function repPmPlans()
    {



      $plans = Planner::with([
        'user','customer', 'customer.params',
        'customer.frequency', 'customer.planner'
        ]);

      $plans = CycleHelper::getCycleData($plans, 'plan_date');

      $plans = $this->queryRequestUsers($plans,'user_id');

      $plans = $plans->orderBy('plan_date')->get();

      return response([
        'code'  =>200,
        'data'  =>  CustomerPlannerResource::collection($plans),
      ]);
    }

    /**
     * get request users
     *
     * @param string $param [user param name]
     * @return array
     */
    private function getRequestUsers(string $param = 'userID')
    {
      $users = [];
      $userID = request()->$param;
      if($userID && $userID !== 'null'  && $userID !== 'undefined') {
        $user = User::find($userID);
        if($user) {
          $users = json_decode($user->user_relations)->reps;
        }
      } else {
        $user = Auth::user();
        $users = json_decode($user->user_relations)->reps;
      }
      return $users;
    }

    /**
     * build query with the given request users
     *
     * @param  $model
     * @param string $filed ['user field name']
     * @param string $param ['user param name']
     * @return $model
     */
    private function queryRequestUsers($model, string $field = "user_id",string $param = 'userID')
    {
      $users = $this->getRequestUsers($param);
      return $model->whereIn($field, $users);
    }

}
