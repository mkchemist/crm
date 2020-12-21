<?php

namespace App\Helpers\Traits;

use Illuminate\Support\Facades\Auth;


trait CustomData {



  public function getRelatedUserData($model)
  {
    $user = Auth::user();
    switch($user->role) {
      case 'dm' :
        return $this->getRelatedRepsData($user, $model);
      default:
        return $model->where('user_id', $user->id);
    }
    /* return $model->whereIn('user_id', function($query) use($user) {
      $query->from('users')->select('id')
      ->whereIn('line', json_decode($user->line))
      ->whereIn('district', json_decode($user->district))
      ->get();
    }); */
  }

  public function getRelatedRepsData($user, $model)
  {
    if($user->user_relations) {
      $relations = json_decode($user->user_relations);
      if(count($relations->reps) > 0) {
        $reps = $relations->reps;
        return $model->whereIn('user_id', $reps);
      } else {
        return $model->get();
      }
    }
  }
}
