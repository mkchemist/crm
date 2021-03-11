<?php

namespace App\Http\Controllers\Api\V1;

use App\Customer;
use App\Helpers\Traits\UserWithAssignment;
use App\Http\Controllers\Controller;
use App\Pharmacy;
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


    public function getUserCustomersLocations($id = null)
    {

      if(!$id) {
        $user =Auth::user();
      } else {
        $user = User::find($id);
      }

      if(request()->pharmacy) {
        $locations = Pharmacy::query();
      } else {
        $locations = Customer::query();
      }

      if(!in_array($user->role, ['admin', 'accountant'])) {
        $locations = $this->getQueryWithAssignment($user,$locations);
      }

      $locations = $locations->select('brick')->distinct()->get();

      return response([
        'code' => 200,
        'data'  =>  $locations,
        'user'  =>  [
          'name'  =>  $user->name,
          'role'  =>  $user->role,
          'line'  =>  $user->line
        ]
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
      $withRelations = ['params'];
      if(request()->withRequests) {
        $withRelations[] = "requests";
        $withRelations[] = "requests.user";
      }
      if(request()->pharmacy) {
        $data = Pharmacy::where('brick', $brick);
      } else {

        $data = Customer::where('brick', $brick)->with($withRelations);
      }
      $data = $data->orderBy('name')->get();
      return response([
        'code'  =>  200,
        'data'  =>  $data
      ]);
    }


    public function pharmaciesInBrick($brick) {
      $pharmacies = Pharmacy::where('brick', $brick)
      ->orderBy('name')->get();
      return response([
        'code'  =>  200,
        'data'  =>  $pharmacies
      ]);
    }

    public function searchCustomers(Request $request)
    {
      $name = $request->name;
      $customers = Customer::with('params')
      ->where('name','like', "%$name%");
      if(!in_array($this->user->role,['admin', 'accountant'])) {
        $customers = $this->getQueryWithAssignment($this->user, $customers);
      }
      if($request->brick !== "null") {
        $customers = $customers->where('brick', $request->brick);
      }
      if($request->paginate) {
        $customers = $customers->paginate($request->paginate);
      } else {
        $customers = $customers->get();
      }

      return response([
        'code'  =>  200,
        'data'  =>  $customers
      ]);
    }
}
