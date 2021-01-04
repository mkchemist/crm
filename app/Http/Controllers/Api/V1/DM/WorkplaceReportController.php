<?php

namespace App\Http\Controllers\Api\V1\DM;

use App\Http\Controllers\Controller;
use App\Http\Resources\DM\PharmacyReportResource;
use App\Http\Resources\DM\WorkplaceReportResource;
use App\WorkplaceReport;
use App\PharmacyReport;
use Illuminate\Support\Facades\Auth;

class WorkplaceReportController extends Controller
{
    /**
     * get all hospitals reports
     *
     * @return \Illuminate\Http\Response
     */
    public function hospitalsReports()
    {
      $user = Auth::user();
      $relations = json_decode($user->user_relations);
      $reps = $relations->reps;
      $reports = WorkplaceReport::with(['customer', 'user', 'workplace'])
      ->whereIn('user_id', $reps)->get();

      return response([
        'code' => 201,
        'data'  => WorkplaceReportResource::collection($reports)
      ]);
    }

    public function pharmaciesReports()
    {
      $user = Auth::user();
      $relations = json_decode($user->user_relations);
      $reps = $relations->reps;
      $reports = PharmacyReport::with(['pharmacy', 'user'])
      ->whereIn('user_id', $reps)->get();

      return response([
        'code'  =>  201,
        'data'  =>   PharmacyReportResource::collection($reports)
      ]);
    }
}
