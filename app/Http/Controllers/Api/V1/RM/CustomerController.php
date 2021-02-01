<?php

namespace App\Http\Controllers\Api\V1\RM;

use App\Customer;
use App\Helpers\ResponseHelper;
use App\Helpers\Traits\UserWithAssignment;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustomerController extends Controller
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

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $customers = Customer::with([
        'workplace', 'report','planner','frequency', 'params'
        ]);
      $customers = $this->getQueryWithAssignment($this->user,$customers,true);
      $customers = $customers->paginate(5000);
      return response([
        'code'  =>  200,
        'data'  =>  $customers
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
      if(!is_numeric($id)) {
        return response(ResponseHelper::BAD_REQUEST_INPUT);
      }

      $customer = Customer::with(['workplace', 'report','planner', 'frequency', 'params', 'planner.user','report.user','report.coach', 'report.coach2'])
      ->where('id', $id);
      $customer = $this->getQueryWithAssignment($this->user, $customer,true)->first();

      if(!$customer) {
        return response(ResponseHelper::INVALID_ID);
      }

      return response([
        'code'  =>  200,
        'data'  =>  $customer
      ]);
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
}
