<?php

namespace App\Services\CustomerRequest;

use App\CustomerRequest;
use App\Helpers\ResponseHelper;
use App\Helpers\Setting\ProductFactoryPriceSetting;
use App\Http\Resources\Shared\CustomerRequestResource;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class CustomerRequestService
{

    protected $user;

    protected $products;

    public function __construct(User $user)
    {
        $this->user = $user;
        $products = new ProductFactoryPriceSetting;
        $this->products = $products->all();
    }

    protected function canAccessAll()
    {
        return in_array($this->user->role, ['admin', 'accountant']);
    }

    protected function getUserId(array $user)
    {
        if ($this->canAccessAll()) {
            return $user;
        }
        return $this->user->id;
    }

    protected function generateRequestSerial(string $type)
    {
        $date = Date('ymd');
        $prefix = substr($type, 0, 2);
        return $prefix . $date . uniqid();
    }

    /**
     * validate incoming customer request
     *
     * @param Request $request
     * @return mixed
     */
    protected function validate(Request $request)
    {
        $data = [
            'user_id' => 'required|json',
            'customers' => 'required|json',
            'pharmacies' => 'required|json',
            'products' => 'required|json',
            'comment' => 'required|json',
            'apply_date' => 'required|date',
            'type' => 'required|string',
            'quantity' => 'required|numeric',
            'cost' => 'required|numeric',

        ];
        $validator = Validator::make($request->all(), $data);
        if ($validator->fails()) {
            return ResponseHelper::validationErrorResponse($validator);
        }
        return false;
    }

    /**
     * create collection from incoming request
     *
     * @param Request $request
     * @return array
     */
    protected function createStoredRequestCollection(Request $request)
    {
        $users = json_decode($request->user_id);
        $products = json_decode($request->products);
        $customers = json_decode($request->customers);
        $data = [];
        $pharmacies = $this->collectRequestPharmaciesFromJson($request->pharmacies);
        /** shared request parts */
        $shared = $this->collectSharedRequestData($request);
        /** get cost share */
        $costShare = $this->calculateProductCost($products, $request->cost * $request->quantity);
        // looping through customer then
        // looping through products
        foreach($users as $user) {
          foreach ($customers as $customer) {
              foreach ($products as $product) {
                  $item = [
                      'user_id' => $user,
                      'customer_id' => $customer,
                      'product' => $product->name,
                      'cost' => $costShare[$product->name] / count($customers),
                      'rx' => $product->rx,
                      'rx_months' => $product->rx_months,
                  ];
                  $item = array_merge($shared, $item, $pharmacies);
                  $data[] = $item;
              }
          }
        }
        return $data;
    }

    /**
     * collect shared data between requests
     *
     * @param Request $request
     * @return array
     */
    protected function collectSharedRequestData(Request $request)
    {
        $shared = [
            'serial' => $this->generateRequestSerial($request->type),
            'comment' => $request->comment,
            'apply_date' => $request->apply_date,
            'quantity' => $request->quantity,
            'type' => $request->type,
            'query_date' => Date('20y-m-d'),
            'others' => $request->others,
            'state' => 'created',
        ];
        return $shared;
    }

    /**
     * collect incoming request pharmacies
     *
     *
     * @param string $pharmacies [pharmacies as a json value]
     * @return array
     */
    protected function collectRequestPharmaciesFromJson(string $pharmacies)
    {
        $pharmacies = json_decode($pharmacies);
        $data = [];
        foreach ($pharmacies as $key => $value) {
            $index = $key + 1;
            $data["pharmacy$index"] = $value;
        };

        return $data;
    }

    /**
     * calculate products cost
     *
     * @param array $products [request products]
     * @param int $cost [total request cost]
     * @return array
     */
    protected function calculateProductCost(array $products, int $cost)
    {
        $totalRx = 0;
        foreach ($products as $product) {
          $name = $product->name;
            $totalRx += $product->rx * $product->rx_months * $this->products->$name;
        }
        $share = [];
        foreach ($products as $product) {
            $share[$product->name] = $this->calculateProductCostShare(
              $cost, $totalRx, $product->rx * $product->rx_months, $product->name
            );
        }
        return $share;
    }

    /**
     * calculate product cost share
     *
     * @param int $cost
     * @param int $total
     * @param int $rx
     * @return int
     */
    protected function calculateProductCostShare(int $cost, int $total, int $rx, $name)
    {
        return (($rx * $this->products->$name )/ $total) * $cost;
    }

    /**
     * is request already exists
     *
     * @param Request $request
     * @param int $id
     * @return mixed
     */
    protected function isExist(Request $request, int $id = null)
    {
        $customerRequest = CustomerRequest::where([
            'type' => $request->type,
        ])
        ->whereIn('customer_id', json_decode($request->customers))
            ->whereIn('state', ['pending', 'created']);
        if ($id) {
            $customerRequest = $customerRequest->where('id', $id);
        }
        $customerRequest = $customerRequest->with(['customer'])->first();
        return $customerRequest;
    }

    /**
     * check if the incoming request already
     * created by user
     *
     * @param Request $request
     * @return mixed
     */
    protected function isCreatedByOwner($request)
    {
        $customerRequest = $this->isExist($request);
        if ($customerRequest) {
            return $customerRequest;
        }
        return false;
    }

    /**
     * store incoming request
     *
     *
     * @param Request $request
     */
    public function storeRequest(Request $request)
    {
        if ($this->validate($request)) {
            return response($this->validate($request));
        }
        $isCreated = $this->isCreatedByOwner($request);
        if($isCreated) {
          return response([
            'code'  =>  409,
            'message' => sprintf(
              "Request for customer %s is already created",
              $isCreated->customer->name
            )
          ]);
        }

        $data = $this->createStoredRequestCollection($request);
        DB::table('customer_requests')->insert($data);
        return response([
            'code' => 200,
            'message' => 'Request Created Successfully',
            'request' =>  $this->isExist($request)
        ]);

    }

    private function userSubOrdinate() {
      $users = [$this->user->id];
      $relations = json_decode($this->user->user_relations);
      switch ($this->user->role) {
        case 'rm':
          $users = array_merge(
            $users,
            $relations->reps,
            $relations->dm,
            $relations->am
          );
          break;
        case 'am':
          $users = array_merge(
            $users,
            $relations->reps,
            $relations->dm
          );
          break;
        case 'dm' :
          $users = array_merge($users, $relations->reps);
          break;
        default:
          break;
      }
      return $users;
    }

    /**
     * get all requests
     *
     *
     */
    public function readAll($request, $user)
    {
      $users = $this->userSubOrdinate();
      $requests = CustomerRequest::with([
        'customer','pharmacy_1','pharmacy_2','pharmacy_3'
        ,'pharmacy_4','user','customer.params'
      ]);
      if(!$this->canAccessAll()) {
        $requests = $requests->whereIn('user_id', $users);
      }
      $requests = $requests->get();
      return response([
        'code'  =>  200,
        'data'  =>  CustomerRequestResource::collection($requests),
      ]);
    }


    public function analysisCost($search)
    {
      $data = DB::table('customer_requests as req')
      ->select(
        "$search AS Item",
        DB::raw('SUM(cost) AS total_cost')
      )->groupBy($search)->get();

      return response([
        'data' => $data,
        'code'  =>  200
      ]);
    }

    private function handleStateWhenSubmit() {}
    private function handleStateWhenApprove() {}
    private function handleStateWhenCancel(){}

    public function updateState(Request $request)
    {
      $validator = Validator($request->all(), [
        'state' => [
          'required',
          Rule::in(['submit', 'approve', 'cancel'])
        ],
        "serial"  =>  'required|string'
      ]);

      if($validator->fails()) {
        return response(ResponseHelper::validationErrorResponse($validator));
      }


    }

}
