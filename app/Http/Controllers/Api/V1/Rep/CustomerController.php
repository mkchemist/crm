<?php

namespace App\Http\Controllers\Api\V1\Rep;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\RepCustomersResource as CustomerResource;
use App\Customer;
use App\CustomerFrequency;
use App\CustomerParameter;
use App\Helpers\ResponseHelper;
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
      $customers = Customer::with(['params', 'frequency'])
      ->where(['area' => Auth::user()->area])
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
      $validator = Validator::make($request->all(),[
        'name'  =>  'required',
        'specialty' =>  'required',
        'brick'     =>  'required',
        'params'     =>  'required',
        'frequency'   =>  'required|numeric'
      ]);

      if($validator->fails()) {
        return response()->json(ResponseHelper::validationErrorResponse($validator));
      }

      if($this->checkIfCustomerExist(
        $request->name,
        $request->brick,
        $request->specialty
      )) {
        return response()->json(ResponseHelper::ITEM_ALREADY_EXIST);
      }

      $data = array_merge($request->all(), $this->getUserAreaDetails());
      $customer = Customer::create($data);
      $params = $this->customerParameterUpdateOrCreate($customer->id,$request->params);
      $freq = $this->customerFrequencyUpdateOrCreate($customer->id, $request->frequency, false);
      $customer->params = $params;
      $customer->freq = $freq;

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
        if(!is_numeric($id)) {
          return response()->json(ResponseHelper::BAD_REQUEST_INPUT);
        }
        $customer = $this->getCustomerById($id);
        if(!$customer) {
          return response()->json(ResponseHelper::INVALID_ID);
        }
        return response()->json([
          "code"  =>  201,
          "data"  =>  new CustomerResource($customer)
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
      if($validator->fails()) {
        return response()->json(ResponseHelper::validationErrorResponse($validator));
      }
      // check if the customer with the given id
      // is already exists
      $customer = $this->getCustomerById($id);
      if(!$customer) {
        return response()->json(ResponseHelper::INVALID_ID);
      }

      $customer->address = $request->address;
      $customer->phone = $request->phone;
      $customer->workplace_id = $request->workplace === "null" ? null :$request->workplace;
      $customer->title = $request->title;
      $this->customerParameterUpdateOrCreate($customer->id, $request->parameter);
      $this->customerFrequencyUpdateOrCreate($customer->id, $request->next_freq, false);
      $customer->save();

      return response()->json([
        "code"  =>  201,
        "data"  =>  new CustomerResource($this->getCustomerById($id))
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
      $customer = Customer::with(['params'])->where([
        'id'  =>  $id,
        'area'  =>  Auth::user()->area
      ])->first();
      return $customer;
    }

    /**
     * create or update customer parameter
     *
     * @param integer $id
     * @param string $param
     * @return CustomerParameter
     */
    private function customerParameterUpdateOrCreate(int $id, string $param)
    {
      $params = CustomerParameter::updateOrCreate([
        'user_id' =>  Auth::user()->id,
        'customer_id' =>  $id
      ]);
      $params->param = $param;
      $params->save();
    }

    /**
     * create or update customer frequency
     *
     * @param integer $id
     * @param integer $freq
     * @param boolean $locked
     * @return void
     */
    private function customerFrequencyUpdateOrCreate(int $id, int $freq,bool $locked)
    {
      $frequency = CustomerFrequency::updateOrCreate([
        'user_id' =>  Auth::user()->id,
        'customer_id' =>  $id,
        ]);
      $frequency->next = $freq;
      $frequency->locked = $locked;
      $frequency->save();
      return $frequency;
    }
}
