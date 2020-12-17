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
      $relations = json_decode($user->user_relations);
      $coachs = User::whereIn('role', ['dm','tm','rm', 'am'])
      ->whereIn('id', $relations->dm)
      ->orWhereIn('id', $relations->am)
      ->orWhereIn('id', $relations->rm)
      ->orWhereIn('id', $relations->marketing)
      ->get();

      return response([
        'code'  =>  201,
        'data'  =>  $coachs
      ], 201);
    }
}
