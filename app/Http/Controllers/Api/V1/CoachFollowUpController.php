<?php

namespace App\Http\Controllers\Api\V1;

use App\CoachReport;
use App\Helpers\CycleHelper;
use App\Http\Controllers\Controller;

class CoachFollowUpController extends Controller
{

    /**
     * get all coaching reports for
     * the given rep to evaluate rep skills
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      if(!request()->rep && !request()->coach) {
        return response([
          'code'  =>  204,
          'message' =>  'No rep selected'
        ]);
      }
      $reports = CoachReport::with(['coach','rep','customer','customer.params','customer.frequency']);

      if(request()->rep) {
        $reports = $reports->where('rep_id', request()->rep);
      }

      if(request()->coach) {
        $reports = $reports->where('coach_id', request()->coach);
      }
      $reports = CycleHelper::getCycleData($reports, 'visit_date');
      $reports = $reports->get();

      return response([
        'code'  =>  200,
        'data'  =>  $reports
      ]);
    }
}
