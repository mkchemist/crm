<?php

namespace App\Http\Controllers\Api\V1\Admin\Reports;

use App\Helpers\Setting\ActiveCycleSetting;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\RepPharmacyVisitResource;
use App\PharmacyReport;
use App\User;
use Illuminate\Http\Request;

class PharmacyReportController extends Controller
{
    public function index()
    {
      $userId = request()->user;
      $active= new ActiveCycleSetting;
      $cycle = $active->all();

      $reports = PharmacyReport::with(['pharmacy', 'user'])
      ->whereBetween('visit_date', [$cycle->start, $cycle->end]);

      if($userId) {
        $user = User::find($userId);
        if($user) {
          $relations = json_decode($user->user_relations);
          $reports = $reports->whereIn('user_id', $relations->reps);
        }
      }
      $reports = $reports->get();

      return response([
        'code'  =>  200,
        'data'  =>  RepPharmacyVisitResource::collection($reports)
      ]);
    }
}
