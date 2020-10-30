<?php

namespace App\Http\Controllers\Api\V1\Rep;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\CustomerReport;
use App\Helpers\ResponseHelper;
use App\Http\Resources\RepReportResource as ReportResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CustomerReportController extends Controller
{
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index()
  {
    $visits = CustomerReport::with(['customer', 'customer.params', 'customer.frequency', 'customer.planner','user'])
      ->where(['user_id' => Auth::user()->id])->get();
    return response()->json([
      'code'  =>  201,
      'data'  =>  ReportResource::collection($visits)
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
      'customer'  =>  'required',
      'date'      =>  'required|date',
      'products'  =>  'string'
    ]);

    if ($validator->fails()) {
      return response()->json(ResponseHelper::validationErrorResponse($validator));
    }

    $check = $this->getVisitByCustomerIdAndDate($request->customer, $request->date);
    if ($check) {
      return response()->json(ResponseHelper::ITEM_ALREADY_EXIST);
    }
    $visit = CustomerReport::create([
      'customer_id' =>  $request->customer,
      'user_id'     =>  Auth::user()->id,
      'visit_date'  =>  $request->date,
      'dual_with'   =>  $request->dual_with,
      'comment'     =>  $request->comment,
      'products'    =>  $request->products,
      'general_feedback'  =>  $request->general_feedback
    ]);

    return response()->json([
      'code'  =>  201,
      'data'  =>  'New visit added successfully'
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
      'data'  =>  new ReportResource($visit)
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

    if(!is_numeric($id)) {
      return response()->json(ResponseHelper::BAD_REQUEST_INPUT);
    }

    $validator = Validator::make($request->all(), [
      'date'      =>  'required|date',
      'products'  =>  'string'
    ]);

    if ($validator->fails()) {
      return response()->json(ResponseHelper::validationErrorResponse($validator));
    }

    $visit = $this->getVisitById($id);

    if(!$visit) {
      return response()->json(ResponseHelper::INVALID_ID);
    }
    $visit->dual_with = $request->dual_with;
    $visit->comment = $request->comment;
    $visit->products = $request->products;
    $visit->general_feedback = $request->general_feedback;
    $visit->save();
    return response()->json([
      'code'  =>  201,
      'data'  =>  'visit updated successfully'
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
   * get visit by customer Id and date
   *
   * @param integer $id
   * @param string $date
   * @return CustomerReport|Null
   */
  private function getVisitByCustomerIdAndDate(int $id, string $date)
  {
    $visit = CustomerReport::where([
      'customer_id' =>  $id,
      'visit_date'  =>  $date,
      'user_id'     =>  Auth::user()->id
    ])->first();
    return $visit;
  }

  /**
   * get visit by id
   *
   * @param integer $id
   * @return CustomerReport|Null
   */
  private function getVisitById(int $id)
  {
    $visit = CustomerReport::where([
      'id'  =>  $id,
      'user_id' =>  Auth::user()->id
    ])->first();
    return $visit;
  }
}
