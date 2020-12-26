<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Helpers\ResponseHelper;
use App\Http\Resources\ActivityPlansResource;
use App\NonFieldActivityPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ActivityPlansController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $user = Auth::user();
      $plans = $this->getUserPlans($user);
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
      NonFieldActivityPlan::where([
        'id'  =>  $id,
        'user_id' =>  $user->id
      ])->delete();
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
      $plans = NonFieldActivityPlan::whereIn('user_id', $relations->reps)->orWhere('user_id', $user->id);
      return $plans;
    }
}
