<?php

namespace App\Http\Controllers\Api\V1\RM;

use App\Helpers\Setting\ActiveCycleSetting;
use App\Http\Controllers\Controller;
use App\Http\Resources\RM\RepsWorkplaceReportController;
use App\WorkplaceReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WorkplaceReportController extends Controller
{
    public function index()
    {
      $user = Auth::user();
      $relations = json_decode($user->user_relations);
      $users = array_merge(
        $relations->reps,
        $relations->dm
      );
      $activeCycle = new ActiveCycleSetting;
      $activeCycle = $activeCycle->all();
      $reports =WorkplaceReport::with([
        'workplace', 'customer','user'
      ])->whereBetween('visit_date', [$activeCycle->start, $activeCycle->end])
      ->whereIn('user_id', $users)
      ->get();

      return response([
        'code'  =>  200,
        'data'  =>  RepsWorkplaceReportController::collection($reports)
      ]);
    }
}
