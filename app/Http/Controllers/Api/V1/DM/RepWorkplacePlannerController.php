<?php

namespace App\Http\Controllers\Api\V1\DM;

use App\Helpers\ResponseHelper;
use App\Helpers\Setting\ActiveCycleSetting;
use App\Http\Controllers\Controller;
use App\Http\Resources\RepWorkplacePlannerResource;
use App\WorkplacePlanner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class RepWorkplacePlannerController extends Controller
{
    public function index()
    {
      $user = Auth::user();
      $relations = json_decode($user->user_relations);
      $reps = $relations->reps;
      $activeCycle = new ActiveCycleSetting;
      $data =  $activeCycle->all();
      $plans = WorkplacePlanner::with(['workplace', 'user'])
      ->whereIn('user_id', $reps)
      ->whereBetween('plan_date', [$data->start, $data->end])
      ->orderBy('plan_date','asc')->get();

      return response([
        'code'  =>  200,
        'data'  =>  RepWorkplacePlannerResource::collection($plans)
      ]);
    }

    /**
     * control rep workplace plans
     * approve or reject
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function submit(Request $request)
    {
      $validator = Validator::make($request->all(), [
        'user'  =>  'required|int',
        'type' => [
          'required',
          Rule::in(['approved', 'rejected'])
        ]
      ]);
      if($validator->fails()) {
        return response(ResponseHelper::validationErrorResponse($validator));
      }

      $activeCycle = new ActiveCycleSetting;
      $activeCycleData = $activeCycle->all();
      $state = $request->type === 'approved' ? true : false;
      WorkplacePlanner::where([
        'user_id' =>  $request->user,
        'submitted' =>  true
      ])->whereBetween('plan_date', [$activeCycleData->start, $activeCycleData->end])
      ->update([
        'submitted' => $state,
        'approved'  =>  $state
      ]);

      return response([
        'code'  =>  200,
        'message' => sprintf('Plan %s', $request->type)
      ]);
    }
}
