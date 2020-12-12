<?php

namespace App\Http\Controllers\Api\V1\Rep;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CoachController extends Controller
{
    /**
     * get all coaches related to rep
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {

      $user = Auth::user();

      $coachs = User::whereIn('role', ['dm','tm','rm', 'am'])
      ->whereIn('district', ['all', $user->district])
      ->whereIn('territory', ['all', $user->territory])
      ->whereIn('region', [$user->region])
      ->whereIn('line', ['all', $user->line])->get();

      return response([
        'code'  =>  201,
        'data'  =>  $coachs
      ], 201);
    }
}
