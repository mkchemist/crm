<?php

namespace App\Helpers\Traits;

use Illuminate\Support\Facades\Auth;


trait CustomData {



  public function getRelatedUserData($model)
  {
    $user = Auth::user();
    return $model->whereIn('user_id', function($query) use($user) {
      $query->from('users')->select('id')
      /* ->whereIn('line', json_decode($user->line)) */
      /* ->whereIn('district', json_decode($user->district)) */
      ->get();
    });
  }
}
