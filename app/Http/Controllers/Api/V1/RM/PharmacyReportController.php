<?php

namespace App\Http\Controllers\Api\V1\RM;

use App\Helpers\Setting\ActiveCycleSetting;
use App\Http\Controllers\Controller;
use App\Http\Resources\RM\RepsPharmacyReportResource;
use App\PharmacyReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PharmacyReportController extends Controller
{
    /**
     * get all reps pharmacy reports
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $user = Auth::user();
      $reps = json_decode($user->user_relations)->reps;
      $activeCycle = new ActiveCycleSetting;
      $activeCycle = $activeCycle->all();

      $reports = PharmacyReport::with(['user', 'pharmacy'])
      ->whereIn('user_id', $reps)
      ->whereBetween('visit_date', [$activeCycle->start, $activeCycle->end])
      ->get();

      return response([
        'code'  =>  200,
        'data'  =>  RepsPharmacyReportResource::collection($reports)
      ]);
    }
}
