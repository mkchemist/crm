<?php

namespace App\Http\Controllers\Api\V1\DM;

use App\Helpers\ResponseHelper;
use App\Helpers\Setting\ActiveCycleSetting;
use App\Http\Controllers\Controller;
use App\Http\Resources\DM\PharmacyReportResource;
use App\Http\Resources\DM\WorkplaceReportResource;
use App\WorkplaceReport;
use App\PharmacyReport;
use Illuminate\Http\Request;
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
      $activeCycle = new ActiveCycleSetting;
        $activeCycle = $activeCycle->all();
        $start = $activeCycle->start;
        $end = $activeCycle->end;
        if(request()->start) {
          $start = request()->start;
        }
        if(request()->end) {
          $end = request()->end;
        }
      $reps = $relations->reps ?? [];
      $reports = WorkplaceReport::with(['customer', 'user', 'workplace'])
      ->whereIn('user_id', $reps);
      $reports = $reports->whereBetween('visit_date', [$start, $end]);
      $reports = $reports->get();

      return response([
        'code' => 201,
        'data'  => WorkplaceReportResource::collection($reports)
      ]);
    }

    public function pharmaciesReports()
    {
      $user = Auth::user();
      $relations = json_decode($user->user_relations);
      $reps = $relations->reps ?? [];
      $reps[] = $user->id;
      $activeCycle = new ActiveCycleSetting;
      $activeCycle = $activeCycle->all();
      $start = $activeCycle->start;
      $end = $activeCycle->end;
      if(request()->start) {
        $start = request()->start;
      }
      if(request()->end) {
        $end = request()->end;
      }
      $reports = PharmacyReport::with(['pharmacy', 'user'])
      ->whereIn('user_id', $reps)
      ->whereBetween('visit_date', [$start, $end])
      ->get();

      return response([
        'code'  =>  201,
        'data'  =>   PharmacyReportResource::collection($reports)
      ]);
    }


    public function showPharmacyVisit($id)
    {
      $user = Auth::user();
      $report = PharmacyReport::with(['user','pharmacy'])
      ->where([
        'id'  =>  $id,
        'user_id' =>  $user->id
      ])->first();
      if(!$report) {
        return response(ResponseHelper::INVALID_ID);
      }
      return response([
        'code'  =>  200,
        'data' => $report
      ]);
    }

    public function deletePharmacy($id)
    {
      $user = Auth::user();
      $report = PharmacyReport::where([
        'id'  =>  $id,
        'user_id' =>  $user->id
      ])->first();
      if(!$report) {
        return response(ResponseHelper::INVALID_ID);
      }

      $report->delete();

      return response([
        'code'  =>  200,
        'message' => 'Report Deleted'
      ]);
    }
}
