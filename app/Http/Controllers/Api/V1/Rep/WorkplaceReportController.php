<?php

namespace App\Http\Controllers\Api\V1\Rep;

use App\Helpers\ResponseHelper;
use App\Helpers\Setting\ActiveCycleSetting;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\WorkplaceReport;
use App\Http\Resources\RepWorkplaceReport;

class WorkplaceReportController extends Controller
{
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index()
  {
    $cycle = new ActiveCycleSetting;
    $date = $cycle->all();
    if($date) {
      $visits = WorkplaceReport::with(['customer', 'workplace'])
      ->where([
        'user_id' =>  Auth::user()->id
      ])->whereBetween('visit_date', [$date->start, $date->end])
      ->orderBy('visit_date', 'asc')->get();

    } else {
      $visits = WorkplaceReport::with(['customer', 'workplace'])
      ->where([
        'user_id' =>  Auth::user()->id
      ])->orderBy('visit_date', 'asc')->get();

    }

    return response()->json([
      'code'  =>  201,
      'data'  =>  RepWorkplaceReport::collection($visits)
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
      'date'  =>  'required|date',
      'customers' =>  'required|string',
      'products'  =>  'required|string',
      'workplace_id'  =>  'required|numeric'
    ]);
    if ($validator->fails()) {
      return response()->json(ResponseHelper::validationErrorResponse($validator));
    }
    $user = Auth::user();
    $ids = json_decode($request->customers);
    foreach ($ids as $id) {
      WorkplaceReport::updateOrCreate([
          'customer_id' =>  $id,
          'user_id' =>  $user->id,
          'visit_date'  =>  $request->date,
          'workplace_id'  =>  $request->workplace_id,
          'products'  => $request->products,
          'comment'   =>  $request->comment,
          'general_feedback'  =>  $request->general_feedback
      ]);
    };
    return response()->json([
      'code'  =>  201,
      'data'  =>  'Report submitted',
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
    if (!is_numeric($id)) {
      return response()->json(ResponseHelper::BAD_REQUEST_INPUT);
    }

    $visit = $this->getVisitById($id);
    if (!$visit) {
      return response()->json(ResponseHelper::INVALID_ID);
    }

    return response()->json([
      'code'  =>  201,
      'data'  =>  new RepWorkplaceReport($visit)
    ]);
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
    if (!is_numeric($id)) {
      return response()->json(ResponseHelper::BAD_REQUEST_INPUT);
    }
    $visit = $this->getVisitById($id);
    if (!$visit) {
      return response()->json(ResponseHelper::INVALID_ID);
    }
    $check = $this->getVisitByCustomerId($visit->customer_id, $request->date, $visit->workplace_id);
    if ($check && $visit->visit_date !== $request->date) {
      return response()->json(ResponseHelper::ITEM_ALREADY_EXIST);
    }
    $visit->products = $request->products;
    $visit->comment = $request->comment;
    $visit->general_feedback = $request->general_feedback;
    $visit->save();
    return response()->json([
      'code'  => 201,
      'data'  =>  sprintf("Visit of customer %s updated successfully", $visit->customer->name)
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
    $report = WorkplaceReport::where([
      'id'    =>  $id,
      'user_id'  =>  $user->id
    ])->first();
    $report->delete();
    return response([
      "code"  =>  200,
      "message" =>  "Workplace report deleted"
    ]);
  }

  /**
   * get visit by customer id and date and workplace
   *
   * @param integer $id
   * @param string $date
   * @param integer $workplace
   * @return WorkplaceReport|Null
   */
  private function getVisitByCustomerId(int $id, string $date, int $workplace)
  {
    $visit = WorkplaceReport::where([
      'user_id' =>  Auth::user()->id,
      'customer_id' =>  $id,
      'workplace_id'  => $workplace,
      'visit_date'  =>  $date
    ])->first();
    return $visit;
  }

  /**
   * get visit by id
   *
   * @param integer $id
   * @return WorkplaceReport|Null
   */
  private function getVisitById(int $id)
  {
    $visit = WorkplaceReport::where([
      'id'  =>  $id,
      'user_id' =>  Auth::user()->id
    ])->first();
    return $visit;
  }
}
