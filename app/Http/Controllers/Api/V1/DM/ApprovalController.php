<?php

namespace App\Http\Controllers\Api\V1\DM;

use App\CustomerFrequency;
use App\CustomerParameter;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ApprovalController extends Controller
{

  /**
   * get reps customers frequency requests
   *
   * @return \Illuminate\Http\Response
   */
  public function RequestCustomerFrequency()
  {
    $customers = CustomerFrequency::with(['customer','user','customer.getUserParams'])
    ->whereIn('user_id', function ($query) {
      $query->from('users')
        ->select('id')
        ->where([
          'line'      =>  Auth::user()->line,
          'district'  =>  Auth::user()->district
        ])->get();
    })
    ->whereIn('customer_id', function($query) {
      $query->from('customer_parameters')
      ->select('customer_id')
      ->whereNotIn('current', ['NN', 'XX'])
      ->get();
    })->where(['state' => 'requested', 'submitted' => true])->get();
    return response([
      'code'  =>  201,
      'data'  =>  $customers
    ], 201);
  }

  /**
   * get reps customers parameters requests
   *
   * @return \Illuminate\Http\Response
   */
  public function CustomerParameterRequests()
  {
    $customers = CustomerParameter::with(['customer', 'user'])
    ->whereIn('user_id', function($query) {
      $query->from('users')
      ->select('id')
      ->where([
        'line'  =>  Auth::user()->line,
        'district'  =>  Auth::user()->district
      ])->get();
    })->where(['state' => 'requested'])->get();

    return response([
      'code'  =>  201,
      'data'  =>  $customers
    ],201);
  }

  /**
   * Approve customers frequency requests
   *
   * @param \Illuminate\Http\Request $request
   * @return \Illuminate\Http\Response
   */
  public function approveCustomersFrequency(Request $request)
  {
    $validator = $this->validateApprovalRequest($request);
    if($validator->fails()) {
      return ResponseHelper::validationErrorResponse($validator);
    }
    $ids = json_decode($request->ids);
    $customers = CustomerFrequency::whereIn('id', $ids)->get();
    foreach($customers as $customer) {
      if($request->state === "approved") {
        $customer->current = $customer->next;
        $customer->next = 0;
        $customer->state = "approved";
      } else {
        $customer->state = "rejected";
        $customer->next = 0;
      }
      $customer->submitted = false;
      $customer->approved_by = Auth::user()->id;
      $customer->save();
    }
    return response([
      'code'  =>  201,
      'data'  =>  "requests Approved"
    ], 201);
  }

  /**
   * Approve customers parameters requests
   *
   * @param \Illuminate\Http\Request $request
   * @return \Illuminate\Http\Response
   */
  public function approveCustomersParameters(Request $request)
  {
    $validator = $this->validateApprovalRequest($request);
    if($validator->fails()) {
      return ResponseHelper::validationErrorResponse($validator);
    }
    $ids = json_decode($request->ids);
    $customers  =CustomerParameter::whereIn('id', $ids)->get();
    foreach($customers as $customer) {
      if($request->state === "approved") {
        $customer->current = $customer->next ;
        $customer->next = "";
        $customer->state = "approved";
      } else {
        $customer->next = "";
        $customer->state = "rejected";
      }
      $customer->approved = true;
      $customer->approved_by = Auth::user()->id;
      $customer->save();
    }
    return response([
      'code'  =>  201,
      'data'  =>  'Requested Parameters approved'
    ], 201);
  }

  /**
   * validate approval request
   *
   * @param \Illuminate\Http\Request $request
   * @return \Illuminate\Support\Facades\Validator;
   */
  private function validateApprovalRequest(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'state' => [
        'required',
        Rule::in(['approved', 'rejected'])
      ],
      'ids' =>  'required|json',
    ], [
      'state.required' => 'Internal Error Occurred with code 400',
      'state.in' => 'State must be Approved or rejected'
    ]);
    return $validator;
  }
}
