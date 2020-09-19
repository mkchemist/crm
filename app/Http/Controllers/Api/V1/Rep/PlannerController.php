<?php

namespace App\Http\Controllers\Api\V1\Rep;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\RepPlannerResource;
use App\Planner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PlannerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $plans = Planner::where([
        'user_id' =>  Auth::user()->id
      ])->orderBy('plan_date', 'asc')->get();
      if(count($plans) === 0) {
        return response()->json(ResponseHelper::EMPTY_RESPONSE);
      }
      return response()->json([
        'code'  =>  201,
        'data'  =>  RepPlannerResource::collection($plans)
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
      $ids = json_decode($request->customers);
      $exists = [];
      $user = Auth::user();
      $accepted = [];
      foreach($ids as $id) {
        $check = Planner::where([
          'customer_id' =>  $id,
          'user_id'   =>  $user->id,
          'plan_date' =>  $request->date
        ])->first();

        if($check) {
          $exists[] = $check->customer->name;
        } else {
          $plan = Planner::create([
            'customer_id' =>  $id,
            'user_id'     =>  $user->id,
            'plan_date'   =>  $request->date
          ]);
          $accepted[] = $plan->customer->name;
        }
      }
      return response()->json([
        'code'  =>  201,
        'accepted'  =>  $accepted,
        'rejected'  =>  $exists
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
      $plan = Planner::where([
        'id'  =>  $id,
        'user_id' =>  Auth::user()->id
      ])->first();
      $plan->plan_date = $request->date;
      $plan->save();
      return response()->json([
        'code'  =>  201,
        'data'  =>  "Plan of {$plan->customer->name} updated successfully"
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
        //
    }

    /**
     * Delete group of plans
     *
     * @param Illuminate\Http\Request $request
     * @return Illuminate\Http\Response
     */
    public function groupDelete(Request $request)
    {
      $ids = json_decode($request->customers);
      foreach($ids as $id) {
        $customer = Planner::where([
          'customer_id'  =>  $id,
          'user_id' =>  Auth::user()->id,
          'plan_date' =>  $request->date
        ]);
        $customer->delete();
      }
      return response()->json([
        'code'  =>  201,
        'data'  =>  sprintf('%d customer deleted', count($ids))
      ]);
    }
}
