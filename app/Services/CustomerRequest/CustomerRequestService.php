<?php

namespace App\Services\CustomerRequest;

use App\CustomerRequest;
use App\Helpers\ResponseHelper;
use App\Helpers\Setting\ProductFactoryPriceSetting;
use App\Helpers\Traits\UserWithAssignment;
use App\Http\Resources\Shared\CustomerRequestResource;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class CustomerRequestService
{
    use UserWithAssignment;

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
    protected function createStoredRequestCollection(Request $request, string $serial = null)
    {
        $user = $request->user_id;
        $products = json_decode($request->products);
        $customers = json_decode($request->customers);
        $data = [];
        $pharmacies = $this->collectRequestPharmaciesFromJson($request->pharmacies);
        /** shared request parts */
        $shared = $this->collectSharedRequestData($request, $serial);
        /** get cost share */
        $costShare = $this->calculateProductCost($products, $request->cost * $request->quantity);
        // looping through customer then
        // looping through products
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
        return $data;
    }

    /**
     * collect shared data between requests
     *
     * @param Request $request
     * @return array
     */
    protected function collectSharedRequestData(Request $request, string $serial = null)
    {
        if (!$serial) {
            $serial = $this->generateRequestSerial($request->type);
        }
        $shared = [
            'serial' => $serial,
            'comment' => $request->comment,
            'apply_date' => $request->apply_date,
            'quantity' => $request->quantity,
            'type' => $request->type,
            'query_date' => Date('20y-m-d'),
            'others' => $request->others,
            'state' => 'created',
            'origin_type' => 'owner',
        ];
        if($this->user->role === "am") {
          $shared["am_approval"] = true;
          $shared["am_approval_date"] = date("20y-m-d");
        }
        if(in_array($this->user->role, ['accountant', 'admin', 'rm'])) {
          $shared['query_date'] = $request->query_date;
          $shared["am_approval"] = true;
          $shared["am_approval_date"] = date("20y-m-d");
          $shared["rm_approval"] = true;
          $shared["rm_approval_date"] = date("20y-m-d");
        }

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
        return floatval((($rx * $this->products->$name) / $total) * $cost);
    }

    /**
     * is request already exists
     *
     * @param Request $request
     * @param int $id
     * @return mixed
     */
    protected function isExist(Request $request)
    {
        $customerRequest = CustomerRequest::where([
            'type' => $request->type,
        ])
            ->whereIn('customer_id', json_decode($request->customers))
            ->whereIn('state', ['pending', 'created']);
        $customerRequest = $customerRequest->with(['customer', 'user'])->first();
        return $customerRequest;
    }

    /**
     * check if the incoming request already
     * created by user
     *
     * @param Request $request
     * @return mixed
     */
    protected function isCreatedByOwner($request, int $user)
    {
        if ($request && $request->user_id === $user) {
            return true;
        }
        return false;
    }

    /**
     * store incoming request
     *
     *
     * @param Request $request
     */
    public function storeRequest(Request $request, string $serial = null, $new = false)
    {
        if ($this->validate($request)) {
            return response($this->validate($request));
        }
        $isExist = $this->isExist($request);
        $isCreated = $this->isCreatedByOwner($isExist, $request->user_id);
        if ($isCreated && $new) {
            return response([
                'code' => 409,
                'message' => sprintf(
                    "Request for customer %s is already created",
                    $isExist->customer->name
                ),
            ]);
        }
        if ($this->isExist($request) && $new) {
            return response([
                "code" => 409,
                "can_be_shared" => true,
                'data' => [
                    'serial' => $isExist->serial,
                    'creator' => $isExist->user->name,
                ],
            ]);
        }

        $data = $this->createStoredRequestCollection($request, $serial);
        DB::table('customer_requests')->insert($data);
        return response([
            'code' => 200,
            'message' => 'Request Created Successfully',
            'request' => $this->isExist($request),
        ]);

    }

    private function userSubOrdinate()
    {
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
            case 'dm':
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
    public function readAll()
    {
        $users = $this->userSubOrdinate();
        $requests = CustomerRequest::with([
            'customer', 'pharmacy_1', 'pharmacy_2', 'pharmacy_3'
            , 'pharmacy_4', 'user', 'customer.params',
        ])
            ->whereNotIn('state', ['canceled', 'changed']);
        if (!$this->canAccessAll()) {
            $requests = $requests->whereIn('user_id', $users);
        }
        $requests = $requests->get();
        return response([
            'code' => 200,
            'data' => CustomerRequestResource::collection($requests),
        ]);
    }

    /**
     * read shared requests between two users
     *
     *
     *
     */
    public function readShared()
    {
        $requests = CustomerRequest::with([
            'customer', 'user', 'pharmacy_1', 'customer.params',
            'pharmacy_2', 'pharmacy_3', 'pharmacy_4',
        ])->where([
            'origin_type' => 'sharer',
        ])->whereIn('user_id', $this->userSubOrdinate())
            ->whereNotIn('state', ['canceled', 'changed'])
            ->get();

        return response([
            'code' => 200,
            'data' => $requests,
        ]);
    }

    public function analysisCost($search)
    {
        $users = $this->userSubOrdinate();
        if (request()->join) {
            if (request()->join === "user") {
                $data = $this->getAnalysisCostByUser($search)
                    ->groupBy("Item")->get();

                return response([
                    'data' => $data,
                    'code' => 200,
                ]);
            }
            $search = request()->join . "." . $search;
        }
        $data = DB::table('customer_requests as req')
            ->select(
                "$search AS Item",
                DB::raw('SUM(cost) AS total_cost')
            )->join("customers as customer", "customer.id", "=", "req.customer_id")
            ->join("users as user", "user.id", "=", "req.user_id")
            ->whereNotIn('req.state', ['canceled', 'changed']);
        if (!$this->canAccessAll()) {
            $data = $this->getQueryWithAssignment($this->user, $data, false, 'customer');
            $data = $data->whereIn('user_id', $users);
        }

        $data = $data->groupBy($search)->get();

        return response([
            'data' => $data,
            'code' => 200,
        ]);
    }

    private function getAnalysisCostByUser($role)
    {
        $data = DB::table('customer_requests as req')
            ->select(
                DB::raw('IF(m.name != "", m.name, user.name)  AS Item'),
                DB::raw('SUM(cost) AS total_cost')
            )->join("customers as customer", "customer.id", "=", "req.customer_id")
            ->join("users as user", "user.id", "=", "req.user_id")
            ->leftJoin('users as m', function ($join) use ($role) {
                $join->on('m.id', '=', DB::raw("JSON_EXTRACT(user.user_relations, '$." . $role . "[0]')"));
            })
            ->leftJoin('users as am', function ($join) use ($role) {
                $join->on('am.id', '=', DB::raw("JSON_EXTRACT(user.user_relations, '$.am[0]')"));
            })->leftJoin('users as rm', function ($join) use ($role) {
            $join->on('rm.id', '=', DB::raw("JSON_EXTRACT(user.user_relations, '$.rm[0]')"));
        })->whereNotIn('req.state', ['canceled', 'changed']);
        return $data;
    }

    /**
     * handle Request Cancel
     *
     * @param string $serial [request serial]
     * @return \Illuminate\Http\Response
     */
    public function handleRequestSubmit(string $serial)
    {
        $request = CustomerRequest::where('serial', $serial);
        if (!in_array($this->user->role, ['admin', 'accountant'])) {
            $request = $request->where('user_id', $this->user->id);
        }
        $request->update(['state' => 'pending']);
        return response([
            'code' => 200,
            'message' => 'Request Submitted',
        ]);
    }

    /**
     * handle request submit
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function handleRequestApproval(Request $request)
    {

      $validator = Validator::make($request->all(), [
        'state' => [
          'required',
          Rule::in(['approved', 'rejected'])
        ],
        'serial'  =>  'required|string'
      ]);
      if($validator->fails()) {
        return response(ResponseHelper::validationErrorResponse($validator));
      }

     $serial = $request->serial;
     $state = $request->state;
     $requests = CustomerRequest::where(['serial' => $serial]);
     if(!$this->canAccessAll()) {
       $requests = $requests->whereIn('user_id', $this->userSubOrdinate());
     }
     $data = [
      'am_approval' => true,
      'am_approval_date' => date("20y-m-d"),
      "state" => ucfirst($state)." by Area Manager"
     ];

     if(in_array($this->user->role, ['accountant', 'admin'])) {
       $stateText = "Final Approval by CEO";
       if($state === "rejected") {
         $stateText = "Final Rejection by CEO";
       }
      $data['rm_approval'] = true;
       $data['rm_approval_date'] =date("20y-m-d");
       $data['state'] = $stateText;
     } else if($this->user->role === 'rm') {
      $data['rm_approval'] = true;
      $data['rm_approval_date'] =date("20y-m-d");
      $data['state'] = ucfirst($state)." by Business Unit Manager";
     }
     $requests->update($data);
     return response([
       'code' =>  200,
       'message'  => 'Request approved'
     ]);
    }

    /**
     * handle Request Cancel
     *
     * @param string $serial [request serial]
     * @return \Illuminate\Http\Response
     */
    public function handleRequestCancel(string $serial)
    {
        $request = CustomerRequest::where('serial', $serial);
        if (!in_array($this->user->role, ['admin', 'accountant'])) {
            $request = $request->where('user_id', $this->user->id);
        }
        $request->update(['state' => 'canceled']);
        return response([
            'code' => 200,
            'message' => 'Request canceled',
        ]);
    }

    /**
     * update the given request
     *
     *
     * @param \Illuminate\Http\Request $request
     * @param string $serial [request serial]
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, string $serial)
    {
        $req = CustomerRequest::where([
            'serial' => $serial,
        ]);
        if(!$this->canAccessAll()) {
          $req = $req->where('user_id', $this->user->id);
        }
        $req = $req->update(['state' => 'changed']);
        return $this->storeRequest($request, $serial, false);
    }

    /**
     * share in the given request
     *
     *
     * @param \Illuminate\Http\Request $request
     * @param string $serial [request serial]
     * @return \Illuminate\Http\Response
     */
    public function shareIn(Request $request, string $serial)
    {
        $total_cost = $request->added_cost;
        $total_rx = 0;
        $products = json_decode($request->products);
        $customers = json_decode($request->customers);
        $isExists = CustomerRequest::with('customer')->where([
            'serial' => $serial,
            'user_id' => $request->sharer_user_id,
        ])->whereIn('customer_id', $customers)->first();
        if ($isExists) {
            return response([
                'code' => 409,
                'message' => sprintf("Customer %s request is already shared with you", $isExists->customer->name),
            ]);
        }
        $original = CustomerRequest::where([
            'serial' => $serial,
            'user_id' => $request->owner_user_id,
        ])
            ->whereIn('customer_id', $customers)
            ->get();

        foreach ($original as $item) {
            $name = $item->product;
            $total_rx += $item->rx * $item->rx_months * $this->products->$name;
            $total_cost += $item->cost;
        }
        foreach ($products as $product) {
            $name = $product->name;
            $total_rx += $product->rx * $item->rx_months * $this->products->$name;
        }

        foreach ($original as $item) {
            $item->cost = $this->calculateProductCostShare($total_cost, $total_rx, $item->rx * $item->rx_months, $item->product);
        }
        $newRequests = [];
        foreach ($customers as $customer) {
            foreach ($products as $product) {
                $req = $original[0]->replicate();
                $req->product = $product->name;
                $req->rx = $product->rx;
                $req->rx_months = $product->rx_months;
                $req->user_id = (integer) $request->sharer_user_id;
                $req->customer_id = $customer;
                $req->cost = $this->calculateProductCostShare($total_cost, $total_rx, $product->rx * $product->rx_months, $product->name);
                $req->origin_type = "sharer";
                $req->save();
                $newRequests[] = $req;
            }
        }

        return response([
            'code' => 200,
            'data' => [
                'original' => $original,
                'added' => $newRequests,
            ],
        ]);

    }


    public function setRequestCost(Request $request)
    {
      $validator = Validator::make($request->all(), [
        'cost'  =>  'required|numeric',
        'serial'  =>  'required|string'
      ]);
      if($validator->fails()) {
        return response(ResponseHelper::validationErrorResponse($validator));
      }

      CustomerRequest::where([
        'serial' => $request->serial
      ])->update([
        'cost'  => $request->cost
      ]);

      return response([
        'code'  =>  200,
        'message' =>  'Request cost updated'
      ]);
    }

}
