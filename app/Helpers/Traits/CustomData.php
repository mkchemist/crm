<?php

namespace App\Helpers\Traits;

use Illuminate\Support\Facades\Auth;


trait CustomData {



  public function getRelatedUserData($model, $field = null, $range = null)
  {
    $user = Auth::user();
    switch($user->role) {
      case 'rep' :
        $model= $model->where('user_id', $user->id);
        break;
      case 'otc-rep' :
        $model = $model->where('user_id', $user->id);
        break;
      case 'admin':
        break;
      case 'accountant':
          break;
      default:
        $model = $this->getRelatedRepsData($user, $model);
        break;
    }
    if($range) {
      $model = $model->whereBetween($field, $range);
    }
    return $model;
  }

  public function getRelatedRepsData($user, $model)
  {
    $relations = json_decode($user->user_relations);
    $reps = $relations->reps?? [];
    return $model->whereIn('user_id', $reps);
  }
}
