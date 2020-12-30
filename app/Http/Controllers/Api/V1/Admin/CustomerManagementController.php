<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Customer;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class CustomerManagementController extends Controller
{
    public function duplicateCustomers()
    {
        $customers = DB::select(
            'SELECT name,address,brick,specialty, COUNT(name) AS no_existence,area,territory,region
            FROM customers
            GROUP BY name,address,brick,specialty,area,territory,region
            HAVING COUNT(name) > 1
            ORDER BY name ASC'
        );
        return response([
            'code' => 200,
            'data' => $customers,
        ]);
    }

    public function queryDuplicateCustomer()
    {
      $name= request()->name;
      $specialty = request()->specialty;
      $area = request()->area;
      $customer = Customer::where([
        'name'  =>  $name,
        'specialty' =>  $specialty,
        'area'    =>  $area
      ])->get();
      return response([
        'code'  =>  200,
        'data'  =>  $customer
      ]);
    }
}
