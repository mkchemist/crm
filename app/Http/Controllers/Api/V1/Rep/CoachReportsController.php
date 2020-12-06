<?php

namespace App\Http\Controllers\Api\V1\Rep;

use App\CoachReport;
use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CoachReportsController extends Controller
{



    /**
     * get all rep coaching reports
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

      $user = Auth::id();
      $reports = DB::table('coach_reports as cr')
      ->join('customers as c','cr.customer_id','=','c.id')
      ->join('users as u', 'cr.coach_id', '=', 'u.id')
      ->where([
        'cr.rep_id' => $user,
        'cr.coach_submit' =>  true
      ])->select(
        'cr.id',
        'cr.visit_date as date',
        'u.name as coach',
        'c.name as customer',
        'c.specialty',
        'c.brick',
        'c.address'
      )->get();
      return response([
        'code'  =>  200,
        'data'  =>  $reports,
        'message' =>  'Coaching reports loaded'
      ]);
    }

    /**
     * show single coaching report
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
      $user = Auth::id();
      $report = CoachReport::with(['customer', 'coach'])
      ->where([
        'id'  =>  $id,
        'rep_id'  => $user
      ])->first();

      return response([
        'code'  =>  200,
        'data'  =>  $report,
        'message' =>  'Report loaded'
      ]);
    }
}
