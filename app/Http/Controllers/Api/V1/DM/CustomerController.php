<?php

namespace App\Http\Controllers\Api\V1\DM;

use App\Customer;
use App\Helpers\Traits\UserWithAssignment;
use App\Http\Controllers\Controller;
use App\Http\Resources\DM\CustomerResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
    if(request()->active) {
      $customers = $this->activeList();
    } else {
      $customers = $this->inactiveList();
    }

    return response([
      'data'  =>  $customers,
      "code"  =>  200
    ], 200);
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

  private function inactiveList()
  {
    $customers = Customer::with([
       'report', 'frequency', 'planner', 'workplace'
      ])->where('state', 'approved')
      ->whereNotIn('id', function($query) {
        $model= $query->from("customer_parameters")->select("customer_id");
        return $this->getQueryWithAssignment($this->user,$model);
      });
      $customers = $this->getQueryWithAssignment($this->user, $customers);
      $customers = $customers->orderBy('name', 'asc')->get();

    return $customers;
  }

  private function activeList()
  {
    $relations = json_decode($this->user->user_relations);
      $customers = DB::table('customer_parameters as param')
      ->select(
        'customer.id as id',
        'customer.title as title',
        'customer.name as name',
        'customer.specialty as specialty',
        'customer.brick as brick',
        'customer.address as address',
        'freq.current as current_freq',
        'freq.next as next_freq',
        'customer.area as area',
        'param.current as parameter',
        DB::raw('count(DISTINCT plan.plan_date) as plans'),
        DB::raw('count(DISTINCT report.visit_date) as reports'),
        'wp.name as workplace',
        'customer.district as district',
        'customer.territory as territory',
        'user.name as rep',
        'user.line as line'
      )->join('customers as customer', 'customer.id','=','param.customer_id')
      ->join('users as user','user.id','=','param.user_id')
      ->leftJoin('customer_frequencies as freq', function($join) {
        $join->on('freq.customer_id', '=', 'param.customer_id');
        $join->on('freq.user_id', '=', 'param.user_id');
      })->leftJoin('planners as plan', function($join) {
        $join->on('plan.customer_id', '=', 'param.customer_id');
        $join->on('plan.user_id', '=', 'param.user_id');
        $join->whereBetween('plan.plan_date',["2021-02-16","2021-03-31"]);
      })->leftJoin('customer_reports as report', function($join) {
        $join->on('report.customer_id', '=', 'param.customer_id');
        $join->on('report.user_id', '=', 'param.user_id');
        $join->whereBetween('report.visit_date',["2021-02-16","2021-03-31"]);
      })->leftJoin('workplaces as wp','wp.id','=','customer.workplace_id')
      ->whereIn('param.user_id',$relations->reps)
      ->where('customer.state','approved')
      ->groupBy([
        'user.name',
        'user.line',
        'customer.name',
        'customer.specialty',
        'customer.id',
        'customer.title',
        'customer.brick',
        'customer.address',
        'freq.current',
        'freq.next',
        'customer.area',
        'param.current',
        'wp.name',
        'customer.district',
        'customer.territory',
      ]);
      $customers = $customers->get();

    return $customers;
  }
}
