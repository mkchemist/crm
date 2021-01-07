<?php

namespace App\Http\Controllers\Api\V1\Admin\Reports;

use App\Helpers\Setting\ActiveCycleSetting;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\RepWorkplaceVisitResource;
use App\User;
use App\WorkplaceReport;
use Illuminate\Http\Request;

class WorkplaceReportController extends Controller
{
    public function index()
    {
      $userId = request()->user;
      $active = new ActiveCycleSetting;
      $cycle = $active->all();
      $reports = WorkplaceReport::with(['user', 'customer', 'workplace'])
      ->whereBetween('visit_date', [$cycle->start, $cycle->end]);

      if($userId) {
        $user = User::find($userId);
        if($user) {

          $reps = json_decode($user->user_relations)->reps;
          $reports = $reports->whereIn('user_id', $reps);
        }
      }

      $reports = $reports->get();

      return response([
        'code'  =>  200,
        'data'  =>  RepWorkplaceVisitResource::collection($reports)
      ]);
    }
}
