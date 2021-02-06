<?php

namespace App\Http\Controllers\Api\V1;

use App\Customer;
use App\Helpers\Traits\UserWithAssignment;
use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserCustomersController extends Controller
{
    use UserWithAssignment;

    protected $user;

    public function __construct()
    {
      $this->middleware(function($request, $next) {
        $this->user = Auth::user();
        return $next($request);
      });

    }


    public function getUserCustomersLocations($id)
    {
      if(!is_numeric($id)) {
        return response([
          'code'  =>  204,
          'data'  =>  [
            'errors' => [
              'Rep ID must be Number '.gettype($id)." given"
            ]
          ]
        ]);
      }
      $user = User::find($id);

      $locations = Customer::query();
      $locations = $this->getQueryWithAssignment($user,$locations);
      $locations = $locations->select('brick')->distinct()->get();

      return response([
        'code' => 200,
        'data'  =>  $locations
      ]);
    }


    public function customersInBrick($brick)
    {
      if(!is_string($brick)) {
        return response([
          'code'  =>  204,
          'data'  =>  [
            'errors'=>  [
              'Brick must be String '.gettype($brick)."  given"
            ]
          ]
        ]);
      }

      $customers = Customer::where('brick', $brick)->with('params')
      ->orderBy('name')->get();

      return response([
        'code'  =>  200,
        'data'  =>  $customers
      ]);
    }
}
