<?php

namespace App\Http\Controllers\Api\V1\Rep;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\RepCustomersResource as CustomerResource;
use App\Customer;
use App\CustomerFrequency;
use App\CustomerParameter;
use App\CustomerValidation;
use App\Helpers\ResponseHelper;
use App\Http\Resources\RepReportResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index()
  {
    $customers = Customer::with([
      'params', 'frequency', 'workplace', 'report', 'planner'
    ])->where([
      'area' => Auth::user()->area,
      'state' =>  'approved'
    ])
      ->orderBy('name', 'asc')->get();
    $customers = CustomerResource::collection($customers);
    return response()->json([
      'code'  =>  201,
      'data'  =>  $customers
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
      'name'  =>  'required',
      'specialty' =>  'required',
      'brick'     =>  'required',
    ]);

    if ($validator->fails()) {
      return response()->json(ResponseHelper::validationErrorResponse($validator));
    }

    if ($this->checkIfCustomerExist(
      $request->name,
      $request->brick,
      $request->specialty
    )) {
      return response()->json(ResponseHelper::ITEM_ALREADY_EXIST);
    }

    $data = array_merge($request->all(), $this->getUserAreaDetails());
    $customer = Customer::create($data);
    return response()->json([
      "code"  =>  201,
      "data"  =>  $customer
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
    $customer = $this->getCustomerById($id);
    if (!$customer) {
      return response()->json(ResponseHelper::INVALID_ID);
    }
    return response()->json([
      "code"  =>  201,
      "data"  => [
        "customer" => new CustomerResource($customer),
        "plans" =>  $customer->planner,
        "reports" =>  $customer->report
      ]
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
    // request validation
    $validator = Validator::make($request->all(), [
      'parameter'  =>  'required',
      'next_freq' =>  'required|numeric'
    ]);
    if ($validator->fails()) {
      return response()->json(ResponseHelper::validationErrorResponse($validator));
    }
    // check if the customer with the given id
    // is already exists
    /* $customer = $this->getCustomerById($id); */
    $user = Auth::user();
    $customer = Customer::where([
      'area'  =>  $user->area,
      'id'  =>  $id
    ])->first();
    if (!$customer) {
      return response()->json(ResponseHelper::INVALID_ID);
    }
    $workplace = $request->workplace_id !== "null" ? $request->workplace_id : null;

    CustomerValidation::updateOrCreate(
      [
        'user_id' =>  $user->id,
        'customer_id' =>  $customer->id,
      ],
      [
        'workplace_id'  =>  $workplace,
        'title' =>  $request->title,
        'phone' =>  $request->phone,
        'address' =>  $request->address,
        'approved'  => false,
        'approved_by' =>  null
      ]
    );

    CustomerParameter::updateOrCreate(
      ['user_id'  =>  $user->id, 'customer_id' => $customer->id],
      [
        'next' => $request->parameter,
        'state' =>  'requested',
        'approved'  =>  false,
        'approved_by' =>  null
      ]
    );

    $x = CustomerFrequency::updateOrCreate(
      ['user_id' => $user->id, 'locked' => false, 'customer_id'  =>  $customer->id],
      ['next' => $request->next_freq, 'locked' => false, 'state' => 'updated']
    );
    return response()->json([
      "code"  =>  201,
      "data"  =>  'customer updated successfully',
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
   * get user area details
   *
   * @return array
   */
  private function getUserAreaDetails()
  {
    $user = Auth::user();
    return [
      "area"  =>  $user->area,
      "district"  =>  $user->district,
      "territory" =>  $user->territory,
      "region"    =>  $user->region
    ];
  }

  /**
   * check if customer already found
   *
   * @param string $name
   * @param string $brick
   * @param string $specialty
   * @return Customer|null
   */
  private function checkIfCustomerExist(string $name, string $brick, string $specialty)
  {
    $customer = Customer::where([
      'name'  =>  $name,
      'brick' =>  $brick,
      'specialty' =>  $specialty
    ])->first();
    return $customer;
  }

  /**
   * get customer by Id
   *
   * @param integer $id
   * @return Customer|null
   */
  private function getCustomerById(int $id)
  {
    $customer = Customer::with([
      'params', 'frequency', 'report', 'planner', 'workplace'
    ])
    ->where([
      'id'  =>  $id,
      'area'  =>  Auth::user()->area
    ])->first();
    return $customer;
  }
}
