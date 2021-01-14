<?php

namespace App\Http\Controllers\Api\V1\RM;

use App\CoachReport;
use App\Helpers\Setting\ActiveCycleSetting;
use App\Http\Controllers\Controller;
use App\Http\Resources\RM\CoachReportResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CoachReportController extends Controller
{
    public function index()
    {
      $users = $this->getQueryUser();
      $activeCycle = new ActiveCycleSetting;
      $cycle = $activeCycle->all();
      $reports = CoachReport::with(['coach', 'rep', 'customer', 'customer.params', 'customer.frequency'])
      ->whereIn('coach_id', $users)
      ->whereBetween('visit_date', [$cycle->start, $cycle->end])
      ->orderBy('visit_date')
      ->get();
      return response([
        'code'  =>  200,
        'data'  => CoachReportResource::collection($reports),
        'users' =>$users
      ]);
    }

    private function getQueryUser()
    {
      $user = Auth::user();
      $users = json_decode($user->user_relations)->dm;

      if(request()->user !== "null") {
        $users = [request()->user];
      }
      return $users;
    }
}
