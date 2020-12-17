<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\CustomerFavoriteList;
use App\Customer;
use App\Helpers\ResponseHelper;
use App\Http\Resources\RepCustomersResource as CustomerResource;

class CustomerFavoriteListController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $customers = Customer::with(['params', 'frequency', 'report', 'planner', 'workplace'])
      ->whereIn('id', function ($query) {
        $query->from('customer_favorite_lists')
        ->select('customer_id')
        ->where('user_id', Auth::user()->id)
        ->get();
      })->get();

      return response()->json([
        'code'  =>  201,
        'data'  =>  CustomerResource::collection($customers),
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
      $id = $request->id;
      if(!is_numeric($id)) {
        return response()->json(ResponseHelper::BAD_REQUEST_INPUT);
      }
      $item = $this->isAlreadyInList($id);
      if($item) {
        return response()->json(ResponseHelper::ITEM_ALREADY_EXIST);
      }
      $list = CustomerFavoriteList::create([
        'customer_id' =>  $id,
        'user_id'   =>  Auth::user()->id
      ]);
      return response()->json([
        'code'  =>  201,
        'data'  =>  'Customer added successfully',
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
      $item = $this->isAlreadyInList($id);
      if(!$item) {
        return response()->json(ResponseHelper::BAD_REQUEST_INPUT);
      }
      $item->delete();
      return response()->json([
        "code"  =>  201,
        "data"  =>  sprintf('customer %s remove from favorite list', $item->customer->name)
      ]);
    }

    /**
     * check if customer already added to favorite list
     * if customer add return CustomerFavoriteList instance
     * else return false
     *
     * @param integer $id
     * @return CustomerFavoriteList|boolean
     */
    public function isAlreadyInList(int $id)
    {
      $customer = CustomerFavoriteList::where([
        'user_id' =>  Auth::user()->id,
        'customer_id' =>  $id
      ])->first();
      if($customer) {
        return $customer;
      }
      return false;
    }

    public function clearAllList(Request $request)
    {
      $user = Auth::user();
      CustomerFavoriteList::where([
        'user_id' =>  $user->id
      ])->delete();
      return response([
        'code'  =>  200,
        'message' =>  'Favorite list cleared'
      ]);
    }
}
