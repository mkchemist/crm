<?php

namespace App\Http\Controllers\Api\V1\Rep;

use App\Customer;
use App\CustomerFrequency;
use App\CustomerParameter;
use App\CustomerValidation;
use App\Helpers\ResponseHelper;
use App\Helpers\Setting\ActiveCycleSetting;
use App\Helpers\Traits\UserWithAssignment;
use App\Http\Controllers\Controller;
use App\Http\Resources\RepCustomersResource as CustomerResource;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    use UserWithAssignment;

    /**
     * current auth user
     *
     * @var User
     */
    public $user;

    /**
     * CustomerController constructor
     *
     *
     */
    public function __construct()
    {
      $this->middleware(function($request, $next) {
        $this->user= Auth::user();
        return $next($request);
      });
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $customers = Customer::with([
          'params', 'frequency', 'workplace', 'report', 'planner'
        ])->where('state', 'approved')
        ->whereIn('area', json_decode($this->user->area));

        $customers = $this->getQueryWithAssignment($this->user, $customers, true);
        $customers = $customers->orderBy('name', 'asc')->get();
        $customers = CustomerResource::collection($customers);
        return response()->json([
            'code' => 201,
            'data' => $customers,
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
            'name' => 'required|string',
            'specialty' => 'required|string',
            'brick' => 'required|string',
            'address' => 'required|string'
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

        $customer = Customer::create($request->all());
        return response()->json([
            "code" => 201,
            "data" => $customer,
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
        $activeCycle = new ActiveCycleSetting;
        $date = $activeCycle->all();
        $planner = $date ?
        $customer->planner()->whereBetween('plan_date', [$date->start, $date->end])->get()
        : $customer->planner;
        $reports = $date ?
        $customer->report()->whereBetween('visit_date', [$date->start, $date->end])->get()
        : $customer->report;
        return response()->json([
            "code" => 201,
            "data" => [
                "customer" => new CustomerResource($customer),
                "plans" => $planner,
                "reports" => $reports,
            ],
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
            'parameter' => 'required',
            'next_freq' => 'required|numeric',
            'address'   =>  'required|string',
            'phone'     =>  'required|string'
        ]);
        if ($validator->fails()) {
            return response()->json(ResponseHelper::validationErrorResponse($validator));
        }
        // check if the customer with the given id
        // is already exists

        $customer = Customer::where('id', $id);
        $customer = $this->getQueryWithAssignment($this->user, $customer,true);
        $customer = $customer->first();
        if (!$customer) {
            return response()->json(ResponseHelper::INVALID_ID);
        }
        $workplace = $request->workplace_id !== "null" ? $request->workplace_id : null;

        CustomerValidation::updateOrCreate(
            [
                'user_id' => $this->user->id,
                'customer_id' => $customer->id,
            ],
            [
                'workplace_id' => $workplace,
                'title' => $request->title,
                'phone' => $request->phone,
                'address' => $request->address,
                'approved' => false,
                'approved_by' => null,
            ]
        );

        CustomerParameter::updateOrCreate(
            ['user_id' => $this->user->id, 'customer_id' => $customer->id],
            [
                'next' => $request->parameter,
                'state' => 'requested',
                'approved' => false,
                'approved_by' => null,
            ]
        );

        CustomerFrequency::updateOrCreate(
            ['user_id' => $this->user->id, 'locked' => false, 'customer_id' => $customer->id],
            ['next' => $request->next_freq, 'locked' => false, 'state' => 'updated']
        );
        return response()->json([
            "code" => 201,
            "data" => 'customer updated successfully',
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
        return [
            "area" => $this->user->area,
            "district" => $this->user->district,
            "territory" => $this->user->territory,
            "region" => $this->user->region,
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
            'name' => $name,
            'brick' => $brick,
            'specialty' => $specialty,
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
            'params', 'frequency', 'report', 'planner', 'workplace',
        ])
            ->where([
                'id' => $id,
            ]);
        $customer = $this->getQueryWithAssignment($this->user, $customer,true);
        $customer = $customer->first();
        return $customer;
    }
}
