<?php

namespace App\Http\Controllers\Api\V1\OTCManager;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RepController extends Controller
{
    public function getAllReps()
    {
      $user = Auth::user();

      $relations = json_decode($user->user_relations);

      $reps = User::where('role', 'otc-rep')
      ->whereIn('id', $relations->reps)
      ->get();

      return response([
        'code'  =>  200,
        'data'  =>  $reps,
      ]);
    }
}
