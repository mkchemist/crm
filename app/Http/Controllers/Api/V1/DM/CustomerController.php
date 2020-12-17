<?php

namespace App\Http\Controllers\Api\V1\DM;

use App\Customer;
use App\Helpers\Traits\UserWithAssignment;
use App\Http\Controllers\Controller;
use App\Http\Resources\DM\CustomerResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustomerController extends Controller
{
  use UserWithAssignment;

   /**
     * current auth user
     *
     * @var User
     */
    public $user;

    /**
     * CustomerController constructor
     *
     *
     */
    public function __construct()
    {
      $this->middleware(function($request, $next) {
        $this->user= Auth::user();
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
      'params', 'report', 'frequency', 'planner', 'workplace'
      ])->where('state', 'approved');
      $customers = $this->getQueryWithAssignment($this->user, $customers);
      $customers = $customers->orderBy('name', 'asc')->get();

    return response([
      "code"  =>  201,
      "data"  =>  CustomerResource::collection($customers),
    ], 201);
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
    $customer = Customer::with(['params', 'planner', 'report.coach'])->where([
      'id'       => $id
    ]);
    $customer = $this->getQueryWithAssignment($this->user, $customer);
    $customer = $customer->first();
    return response([
      'code'  =>  201,
      'data'  =>  [
        'customer'  =>  new CustomerResource($customer),
        'reports'   =>  $customer->report,
        'plans'     =>  $customer->planner
      ]
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
