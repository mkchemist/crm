<?php

namespace App\Http\Controllers\Api\V1\Admin\Approvals;

use App\Customer;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NewCustomerValidation extends Controller
{

  /**
   * get all new customers that need to be validate
   *
   * @return \Illuminate\Http\Response
   */
  public function getNewCustomers()
  {
    $customers = Customer::where('state' ,'!=', 'approved')->get();

    return response([
      "code"  =>  200,
      "data"  =>  $customers
    ], 200);
  }

  /**
   * approve new customers
   *
   * @param \Illuminate\Http\Request
   * @return \Illuminate\Http\Response
   */
  public function approveNewCustomers(Request $request)
  {
    return response([
      "code"  =>  200,
      "message" =>  "New customer validation POST end point"
    ]);
  }
}
