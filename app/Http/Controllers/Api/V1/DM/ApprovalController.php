<?php

namespace App\Http\Controllers\Api\V1\DM;

use App\CustomerFrequency;
use App\CustomerParameter;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApprovalController extends Controller
{

  public function RequestCustomerFrequency()
  {
    $customers = CustomerFrequency::with(['customer','user','customer.getUserParams'])
    ->whereIn('user_id', function ($query) {
      $query->from('users')
        ->select('id')
        ->where([
          'line'      =>  Auth::user()->line,
          'district'  =>  Auth::user()->district
        ])->get();
    })
    ->whereIn('customer_id', function($query) {
      $query->from('customer_parameters')
      ->select('customer_id')
      ->whereNotIn('current', ['NN', 'XX'])
      ->get();
    })->where(['state' => 'requested'])->get();
    return response([
      'code'  =>  201,
      'data'  =>  $customers
    ], 201);
  }


  public function CustomerParameterRequests()
  {
    $customers = CustomerParameter::with(['customer', 'user'])
    ->whereIn('user_id', function($query) {
      $query->from('users')
      ->select('id')
      ->where([
        'line'  =>  Auth::user()->line,
        'district'  =>  Auth::user()->district
      ])->get();
    })->where(['state' => 'requested'])->get();

    return response([
      'code'  =>  201,
      'data'  =>  $customers
    ],201);
  }
}
