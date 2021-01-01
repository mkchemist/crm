<?php

namespace App\Http\Controllers\Api\V1\DM;

use App\Customer;
use App\CustomerFrequency;
use App\CustomerParameter;
use App\CustomerValidation;
use App\Helpers\ResponseHelper;
use App\Helpers\Traits\UserWithAssignment;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ApprovalController extends Controller
{

  use UserWithAssignment;
  /**
   * get reps customers frequency requests
   *
   * @return \Illuminate\Http\Response
   */
  public function RequestCustomerFrequency()
  {
    $user = Auth::user();
    $relations = json_decode($user->user_relations);
    $reps = $relations->reps;
    $customers = CustomerFrequency::with(['customer.params','user'])
    ->whereIn('user_id', $reps)
   ->where(['state' => 'requested', 'submitted' => true])->get();
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
    $user = Auth::user();
    $relations = json_decode($user->user_relations);
    $reps = $relations->reps;
    $customers = CustomerParameter::with(['customer', 'user'])
    ->whereIn('user_id', $reps)->where(['state' => 'requested'])->get();

    return response([
      'code'  =>  201,
      'data'  =>  $customers
    ],201);
  }

  /**
   * //FIXME fix this update query
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
    $user = Auth::user();
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
      $customer->approved_by = $user->id;
      $customer->save();
    }
    return response([
      'code'  =>  201,
      'data'  =>  "requests Approved"
    ], 201);
  }

  /**
   * //FIXME fix this update query
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
    $user = Auth::user();
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
      $customer->approved_by = $user->id;
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

  /**
   * get all new customer added
   *
   * @return Illuminate\Http\Response
   */
  public function newCustomerApprovals()
  {
    $user = Auth::user();

    $customers = Customer::without([
      'planner', 'report','params', 'frequency', 'workplace'
      ]);
      $customers = $this->getQueryWithAssignment($user, $customers);
      $customers = $customers->where('state', 'new')
      ->orderBy('name')->get();
    return response([
      'code'  =>  200,
      'data'  =>  $customers
    ], 200);
  }
  /**
   * approve new customers list
   *
   * @param Illuminate\Http\Request $request
   * @return Illuminate\Http\Response
   */
  public function approveNewCustomers(Request $request)
  {
    $user = Auth::user();
    $ids = json_decode($request->ids);
    $model = Customer::whereIn('id', $ids);
    $customers = $this->getQueryWithAssignment($user, $model);
    if($request->state === 'approved') {
      $customers->update([
        'state' => "approved by $user->name",
        'approved'  =>  true,
        'approved_by' =>  $user->id
      ]);
    } else {
      $customers->update([
        'state' => 'rejected',
        'approved'  =>  false,
        'approved_by' =>  $user->id
      ]);
    }
    return response([
      'code'  =>  200,
      'data'  =>  'Customer requests approved'
    ], 200);
  }

  /**
   * get all customer details requests
   *
   * @return Illuminate\Http\Response;
   */
  public function customerDetailsApproval()
  {
    $user = Auth::user();
    $relations = json_decode($user->user_relations);
    $reps = $relations->reps;
    $customers = CustomerValidation::with(['customer', 'user', 'workplace'])
    ->whereIn('user_id', $reps)->where('approved', false)->get();

    return response([
      'code'  =>  200,
      'data'  =>  $customers
    ], 200);
  }

  /**
   * approve customers details
   *
   * @param Illuminate\Http\Request $request
   * @return Illuminate\Http\Response
   */
  public function approveCustomerDetails(Request $request)
  {
    $ids = json_decode($request->ids);
    $validatedCustomers = CustomerValidation::whereIn('id', $ids);
    foreach($validatedCustomers->get() as $item) {
      $item->customer()->update([
        'phone' =>    $item->phone,
        'address' =>  $item->address,
        'title'   =>  $item->title,
        'workplace_id'  =>  $item->workplace_id,
      ]);
    }
    $validatedCustomers->update([
      'approved' => true,
      'approved_by' => Auth::id()
    ]);
    return response([
      'code'  =>  200,
      'data'  =>  'Request approved'
    ], 200);
  }
}
