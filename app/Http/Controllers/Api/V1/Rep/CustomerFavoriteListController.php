<?php

namespace App\Http\Controllers\Api\V1\Rep;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\CustomerFavoriteList;
use App\Customer;
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
      $customers = Customer::with(['params', 'frequency'])
      ->whereIn('id', function ($query) {
        $query->from('customer_favorite_lists')
        ->select('id')
        ->where('user_id', Auth::user()->id)
        ->get();
      })->get();
      return response()->json([
        'code'  =>  201,
        'data'  =>  CustomerResource::collection($customers)
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
        return response()->json([
          'code'  =>  400,
          'data'  =>  [
            'errors'  =>  [
              'bad Request input',
              'Id must be numeric'
            ]
          ]
        ]);
      }
      $item = $this->isAlreadyInList($id);
      if($item) {
        return response()->json([
          'code'  =>  203,
          'data'  =>  [
            'errors'  =>  [
              sprintf('Dr %s is already in your favorite list', $item->customer->name)
            ]
          ]
        ]);
      }
      $list = CustomerFavoriteList::create([
        'customer_id' =>  $id,
        'user_id'   =>  Auth::user()->id
      ]);
      return response()->json([
        'code'  =>  201,
        'data'  =>  sprintf('Dr %s added successfully to favorite list', $list->customer->name),
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
        //
    }

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
}
