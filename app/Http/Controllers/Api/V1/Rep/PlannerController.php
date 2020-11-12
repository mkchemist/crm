<?php

namespace App\Http\Controllers\Api\V1\Rep;

use App\Customer;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\RepPlannerResource;
use App\Planner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PlannerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $plans = Planner::with(['customer', 'customer.frequency', 'customer.planner', 'customer.params', 'user'])->where([
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

        Planner::updateOrCreate([
          'customer_id' =>  $id,
          'user_id' =>  $user->id,
          'plan_date' =>  $request->date
        ]);
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
      $plan = $this->getPlanById($id);
      $check = $this->checkIfExists($plan->customer_id, $request->date);
      if($check) {
        return response()->json(ResponseHelper::ITEM_ALREADY_EXIST);
      }
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
      $plan = $this->getPlanById($id);
      if(!$plan) {
        return response()->json(ResponseHelper::BAD_REQUEST_INPUT);
      }
      if($plan->delete()) {
        return response()->json([
          'code'  =>  201,
          'data'  =>  sprintf("Plan of %s is deleted successfully", $plan->customer->name)
        ]);
      }
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

      Planner::where([
        'user_id' => Auth::user()->id,
        'plan_date' =>  $request->date
        ])->whereIn('id', $ids)->delete();
      return response()->json([
        'code'  =>  201,
        'data'  =>  sprintf('%d customer deleted', count($ids))
      ]);
    }

    /**
     * duplicate plan day
     *
     * @param Illuminate\Http\Request $request
     * @return Illuminate\Http\Response
     */
    public function DuplicateDate(Request $request)
    {
      $validator = Validator::make($request->all(), [
        'date'        =>  'required|date',
        'replan_date' =>  'required|date'
      ]);
      if($validator->fails()) {
        return response()->json(ResponseHelper::validationErrorResponse($validator));
      }
      $rejected = [];
      $accepted = [];
      $plans = Planner::where([
        'plan_date' =>  $request->date,
        'user_id'   =>  Auth::user()->id
      ])->get();
      foreach($plans as $plan) {
        $check = $this->checkIfExists($plan->customer_id, $request->replan_date);
        if($check) {
          $rejected[] = sprintf("Customer %s is already planned on %s", $plan->customer->name, $request->date);
        } else {
          $newPlan = Planner::create([
            'customer_id' =>  $plan->customer_id,
            'plan_date'   =>  $request->replan_date,
            'user_id'     =>  Auth::user()->id
          ]);
          $accepted[] = $newPlan;
        }
      };
      return response()->json([
        'code'  =>  201,
        'data'  =>  sprintf("date %s replanned successfully", $request->date),
        'rejected'  =>  $rejected,
        'accepted'  =>  $accepted,
      ]);
    }

    /**
     * clear total plan date
     *
     * @param Illuminate\Http\Request $request
     * @return Illuminate\Http\Response
     */
    public function clearDate(Request $request)
    {
      $validator = Validator::make($request->all(), [
        'date'  =>  'required|date'
      ]);
      if($validator->fails()) {
        return response()->json(ResponseHelper::validationErrorResponse($validator));
      }
      Planner::where([
        'plan_date'=> $request->date,
        'user_id' =>  Auth::user()->id
      ])->delete();
      return response()->json([
        'code'  =>  201,
        'data'  =>  sprintf("Date %s cleared successfully", $request->date)
      ]);
    }

    /**
     * check if plan already exists
     *
     * @param integer $id
     * @param string $date
     * @return Planner|Null
     */
    private function checkIfExists(int $id, string $date)
    {
      $check = Planner::where([
        'customer_id'  =>  $id,
        'user_id' =>  Auth::user()->id,
        'plan_date' =>  $date
      ])->first();
      return $check;
    }

    /**
     * get Plan by Id
     *
     * @param integer $id
     * @return Planner|Null
     */
    private function getPlanById(int $id)
    {
      $plan = Planner::where([
        'id'  =>  $id,
        'user_id' =>  Auth::user()->id
      ])->first();
      return $plan;
    }
}
