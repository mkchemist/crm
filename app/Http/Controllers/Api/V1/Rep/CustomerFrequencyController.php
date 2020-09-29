<?php

namespace App\Http\Controllers\Api\V1\Rep;

use App\CustomerFrequency;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustomerFrequencyController extends Controller
{
  /**
   * update customer Frequency
   *
   * @param Illuminate\Http\Request $request
   * @return Illuminate\Http\Response
   */
  public function update(Request $request)
  {
    $customers = json_decode($request->customers);
    $result = [];
    foreach($customers as $customer) {
      $param = $this->checkIfExists($customer->id);
      if($param) {
        $param->next = $customer->val;
        $param->save();
      } else {
        $param = CustomerFrequency::create([
          'customer_id' =>  $customer->id,
          'user_id'     =>  Auth::user()->id,
          'next'        =>  $customer->val
        ]);
      }
      $result[] = $param;
    }
    return response()->json([
      'code'  =>  201,
      'data'  =>  $result
    ]);
  }


  public function checkIfExists(int $id)
  {
    $customer = CustomerFrequency::where([
      'customer_id'  => $id,
      'user_id'      => Auth::user()->id
    ])->first();

    return $customer;
  }
}
