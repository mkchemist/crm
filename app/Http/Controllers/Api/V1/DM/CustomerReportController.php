<?php

namespace App\Http\Controllers\Api\V1\DM;

use App\CustomerReport;
use App\Http\Controllers\Controller;
use App\Http\Resources\DM\CustomerReportResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustomerReportController extends Controller
{
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index()
  {
    $user = Auth::user();
    $reports = CustomerReport::with(['customer', 'user', 'customer.params', 'coach', 'customer.planner', 'customer.report'])
      ->whereIn('user_id', function ($query) use ($user) {
        $query->select('id')->from('users')
          ->where([
            'district'  =>  $user->district,
            'line'      =>  $user->line
          ])->get();
      })->get();

    return response([
      'code'  =>  200,
      'data'  =>  CustomerReportResource::collection($reports)
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
    //
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
