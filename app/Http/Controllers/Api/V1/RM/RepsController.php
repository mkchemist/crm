<?php

namespace App\Http\Controllers\Api\V1\RM;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RepsController extends Controller
{

  /**
   * get all related reps
   *
   * @
   */
  public function index()
  {
    $user = Auth::user();
    $relations = json_decode($user->user_relations);
    $dm = [];
    $areaMangers = [];
    $reps = [];
    $bu = [];
    if(!empty($relations)) {
      $dm = User::where('role', 'dm')->whereIn('id', $relations->dm)->get();
      $reps = User::where('role', 'rep')->whereIn('id', $relations->reps)->get();
      $areaMangers = User::where('role', 'am')->whereIn('id', $relations->am)->get();
      $bu = User::where('role','rm')->whereIn('id', $relations->rm)->get();
    }
    return response([
      'code'  =>  200,
      'data'  =>  [
        'dm'  =>  $dm,
        'reps'  =>  $reps,
        'area_managers' => $areaMangers,
        'regional_managers' =>  $bu
      ],
      "relations" =>  $relations
    ]);
  }
}
