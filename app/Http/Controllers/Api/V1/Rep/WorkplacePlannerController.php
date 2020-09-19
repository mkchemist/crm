<?php

namespace App\Http\Controllers\Api\V1\Rep;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\RepWorkplacePlannerResource;
use App\WorkplacePlanner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class WorkplacePlannerController extends Controller
{
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index()
  {
    $user = Auth::user();
    $plans = WorkplacePlanner::where([
      'user_id'  => $user->id
    ])->orderBy('plan_date', 'asc')->get();

    return response()->json([
      'code'  =>  201,
      'data'  =>  RepWorkplacePlannerResource::collection($plans)
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
    /** Validate incoming request */
    $validator = Validator::make($request->all(), [
      'date'  =>  'required',
      'workplaces'  =>  'required'
    ]);
      /** If validation fails */
    if ($validator->fails()) {
      return response()->json(ResponseHelper::validationErrorResponse($validator));
    }
    /** convert workplaces IDs json to normal array */
    $ids = json_decode($request->workplaces);
    /** rejected plans */
    $rejected = [];
    /** accepted plans */
    $accepted = [];
    /** looping through ids */
    foreach ($ids as $id) {
      /**
       * check if plan already exists
       *
       * if exists it will add the given id
       * to rejected plans
       * if no exists it will create new plan
       * for the given workplace id
       *
       */
      $check = WorkplacePlanner::where([
        'plan_date'     =>  $request->date,
        'user_id'       =>  Auth::user()->id,
        'workplace_id'  =>  $id
      ])->first();
      if ($check) {
        $rejected[] = "Workplace {$check->workplace->name} is already planned";
      } else {
        $plan = WorkplacePlanner::create([
          'workplace_id'  =>  $id,
          'user_id'       =>  Auth::user()->id,
          'plan_date'     =>  $request->date
        ]);
        $accepted[] = "Workplace {$plan->workplace->name} is planned successfully";
      }
    }
    return response()->json([
      'code'      =>  201,
      'accepted'  =>  $accepted,
      'rejected'  =>  $rejected
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
    $plan = WorkplacePlanner::where([
      'id'  =>  $id,
      'user_id' =>  Auth::user()->id
    ])->first();
    $plan->plan_date = $request->date;
    $plan->save();
    return response()->json([
      'code'  =>  201,
      'data'  =>  "hospital {$plan->workplace->name} plan updated successfully"
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
   * group delete workplace plans
   *
   * @param Illuminate\Http\Request $request
   * @return Illuminate\Http\Response
   */
  public function groupDelete(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'date'  =>  'required',
      'workplaces' => 'required'
    ]);
    if($validator->fails()) {
      return response()->json(ResponseHelper::validationErrorResponse($validator));
    }

    $ids = json_decode($request->workplaces);

    foreach($ids as $id) {
      $plan = WorkplacePlanner::where([
        'user_id' =>  Auth::user()->id,
        'workplace_id'  =>  $id,
        'plan_date' =>  $request->date
      ])->first();
      $plan->delete();
    }
    return response()->json([
      'code'  =>  201,
      'data'  =>  sprintf("%d workplace plans removed successfully", count($ids))
    ]);
  }
}
