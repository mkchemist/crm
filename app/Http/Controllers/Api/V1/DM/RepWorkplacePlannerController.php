<?php

namespace App\Http\Controllers\Api\V1\DM;

use App\Http\Controllers\Controller;
use App\WorkplacePlanner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RepWorkplacePlannerController extends Controller
{
    public function index()
    {
      $user = Auth::user();
      $relations = json_decode($user->user_relations);
      $reps = $relations->reps;

      $plans = WorkplacePlanner::with(['workplace', 'user'])
      ->whereIn('user_id', $reps)
      ->orderBy('plan_date','asc')->get();

      return response([
        'code'  =>  200,
        'data'  =>  $plans
      ]);
    }
}
