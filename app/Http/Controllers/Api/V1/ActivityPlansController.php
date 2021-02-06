<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\CycleHelper;
use App\Http\Controllers\Controller;
use App\Helpers\ResponseHelper;
use App\Helpers\Setting\ActiveCycleSetting;
use App\Http\Resources\ActivityPlansResource;
use App\NonFieldActivityPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Helpers\Traits\CycleDateValidation;

class ActivityPlansController extends Controller
{
    use CycleDateValidation;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $start = request()->start;
      $end = request()->end;
      $user = Auth::user();
      $activeCycle = new ActiveCycleSetting;
      $data  = $activeCycle->all();
      $plans = $this->getUserPlans($user);

      $plans = CycleHelper::getCycleData($plans, 'start');
      $plans = $plans->with('user')->get();
      return response([
        'code'  =>  200,
        'data'  =>  ActivityPlansResource::collection($plans),
      ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
          'from'  =>  'required|date',
          'to'    =>  'required|date',
          'type'  =>  'required|string',
          'content' =>  'required|string'
        ],[
          'from.required' =>  'Plan starting date required',
          'from.date'     =>  'Plan starting date must be a valid date',
          'to.required'   =>  'Plan ending date required',
          'to.date'       =>  'Plan ending date must be a valid date'
        ]);

        if($validator->fails()) {
          return response(ResponseHelper::validationErrorResponse($validator));
        }
        $user = Auth::user();
        NonFieldActivityPlan::create([
          'user_id' =>  $user->id,
          'start'   =>  $request->from,
          'end'     =>  $request->to,
          'type'    =>  $request->type,
          'content' =>  $request->content
        ]);
        return response([
          'code'  =>  200,
          'message'  => 'Plan created'
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
          'start' =>  'required|date',
          'end'   =>  'required|date'
        ]);

        if($validator->fails()) {
          return response(ResponseHelper::validationErrorResponse($validator));
        }
        $user = Auth::user();
        $plan = NonFieldActivityPlan::where([
          'id'  =>  $id,
          'user_id' =>  $user->id
        ])->update([
          'start' =>  $request->start,
          'end'   =>  $request->end
        ]);

        return response([
          'code'  =>  200,
          'message' =>  'Plan updated'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
      $user = Auth::user();
      $plan = NonFieldActivityPlan::where([
        'id'  =>  $id,
        'user_id' =>  $user->id
      ])->first();

      if(CycleDateValidation::isOldDate($plan->start)) {
        return ResponseHelper::UnableToDeleteOldDate();
      }

      $plan->delete();
      return response([
        'code'  =>  200,
        'message' =>  'Plan deleted'
      ]);
    }

    private function getUserPlans($user)
    {
      switch($user->role) {
        case 'dm' :
          return $this->getDMPlans($user);
        default :
          return $this->getRepPlans($user);
      }
    }

    private function getRepPlans($user)
    {
      $plans = NonFieldActivityPlan::where('user_id', $user->id);
      return $plans;
    }

    private function getDMPlans($user)
    {
      $relations = $user->user_relations;
      if($relations) {
        $relations = json_decode($relations);
      };
      $reps = $relations->reps ?? [];
      $reps[] = $user->id;
      $plans = NonFieldActivityPlan::whereIn('user_id', $reps);
      return $plans;
    }

    public function submitPlans()
    {
      $user = Auth::user();
      $activeCycle = new ActiveCycleSetting;
      $data= $activeCycle->all();
      if(!$data) {
        return response([
          'code'  =>  400,
          'data' => [
            'errors' => [
              'No active cycle selected'
            ]
          ]
        ]);
      }
      NonFieldActivityPlan::where([
        'user_id' =>  $user->id,
        'submitted' =>  false
      ])->update([
        'submitted' => true
      ]);
      return response([
        'code'  =>  200,
        'message' =>  'Plan submitted'
      ]);
    }
}
