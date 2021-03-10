<?php

namespace App\Http\Controllers\Api\V1\RM;

use App\Customer;
use App\CustomerParameter;
use App\Helpers\ResponseHelper;
use App\Helpers\Setting\ActiveCycleSetting;
use App\Helpers\Traits\UserWithAssignment;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
      if(request()->inactive) {
        $customers = $this->inactiveCustomersCollection();
      } else {
        $customers = $this->activeCustomersCollection();
      }
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

    private function activeCustomersCollection()
    {
      $cycle = (new ActiveCycleSetting)->all();
      $start = $cycle->start;
      $end = $cycle->end;
      $users = (json_decode($this->user->user_relations))->reps;
      $list = DB::table('customer_parameters as param')
      ->select(
        'c.name',
        'c.id',
        'c.specialty',
        'param.current as parameter',
        'user.name as rep',
        'user.line',
        'freq.current as frequency',
        DB::raw('count(DISTINCT plan.plan_date) as plans'),
        DB::raw('count(DISTINCT report.visit_date) as reports'),
        'c.address',
        'c.brick',
        'c.area',
        'c.district',
        'c.territory'
      )->join('customers as c', 'c.id', '=', 'param.customer_id')
      ->join('users as user', 'user.id', '=', 'param.user_id')
      ->leftJoin('customer_frequencies as freq', function($join) {
        $join->on('freq.customer_id', '=', 'param.customer_id');
        $join->on('freq.user_id', '=', 'param.user_id');
      })
      ->leftJoin('planners as plan', function($join) use($start, $end) {
        $join->on('plan.customer_id', '=', 'param.customer_id');
        $join->on('plan.user_id', '=', 'param.user_id');
        $join->whereBetween('plan.plan_date', [$start, $end]);
      })
      ->leftJoin('customer_reports as report', function($join) use($start, $end) {
        $join->on('report.customer_id', '=', 'param.customer_id');
        $join->on('report.user_id', '=', 'param.user_id');
        $join->whereBetween('report.visit_date', [$start, $end]);
      })
      ->whereIn('param.user_id', $users)
      ->whereNotIn('param.current', ['XX','NN'])
      ->groupBy(
        'c.name',
        'c.id',
        'c.specialty',
        'param.current',
        'user.name','user.line',
        'freq.current',
        'c.address',
        'c.brick',
        'c.area',
        'c.district',
        'c.territory'
      )
      ->get();
      return $list;
    }

    private function inactiveCustomersCollection()
    {
      $list = Customer::with(['workplace:name,id'])->where(['state' => 'approved'])
      ->whereNotIn('id', function ($query) {
        $query->from('customer_parameters')
        ->select('customer_id')
        ->whereNotIn('current', ['HL','HH','HM', 'MM', 'ML', 'MH', 'LM', 'LL', 'LH'])
        ->get();
      });

      $list = $this->getQueryWithAssignment($this->user, $list);

      $list = $list->orderBy('name')
      ->paginate(3000,[
        'name', 'specialty', 'title','phone', 'address',
        'brick', 'area', 'district', 'territory','id','workplace_id'
      ]);

      return $list;
    }
}
