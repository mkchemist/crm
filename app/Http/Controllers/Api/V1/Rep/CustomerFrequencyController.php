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
    $rejected = [];
    foreach($customers as $customer) {
      $freq = $this->checkIfExists($customer->id);
      if($freq) {
        $freq->next = $customer->frequency;
        $freq->state = "updated";
        $freq->save();
      } else {
        $freq = CustomerFrequency::create([
          'customer_id' =>  $customer->id,
          'user_id'     =>  Auth::user()->id,
          'next'        =>  $customer->frequency,
          "state"       =>  "updated"
        ]);
      }
      $result[] = $freq;
    }
    return response()->json([
      'code'  =>  201,
      'data'  =>  sprintf("%d customer is accepted and %d is rejected", $result, $rejected),
      'rejected' => $rejected,
      'accepted'  =>  $result
    ]);
  }

  /**
   * check if the given customer has frequency
   *
   * @param int $id [customer id]
   * @return CustomerFrequency|null
   */
  public function checkIfExists(int $id)
  {
    $customer = CustomerFrequency::where([
      'customer_id'  => $id,
      'user_id'      => Auth::user()->id
    ])->first();

    return $customer;
  }

  /**
   * submit all rep frequency
   *
   * @return void
   */
  public function submitFrequency()
  {
    $user = Auth::user();
    $customers = CustomerFrequency::where([
      'user_id' =>  $user->id,
      'state'   =>  'updated'
    ])
    ->whereIn('customer_id', function($query) use($user) {
      $query->from('customer_parameters')->select('customer_id')
      ->where('user_id', $user->id)->get();
    })->update(['submitted' => true, "state" => "requested"]);
    return response()->json([
      'code'  =>  201,
      'data'  =>  $customers
    ]);
  }
}
