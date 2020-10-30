<?php

namespace App\Helpers\Traits;

use Illuminate\Support\Facades\Auth;


trait CustomData {
  private $user;

  public function getDataUser()
  {
    if(!isset($this->user)) {
      $this->setDataUser();
    }
    return $this->user;
  }

  public function setDataUser()
  {
    $this->user = Auth::user();
  }


  public function getRelatedUserData($model)
  {
    $user = $this->getDataUser();
    return $model->whereIn('user_id', function($query) use($user) {
      $query->from('users')->select('id')
      ->where([
        'line'  =>  $user->line,
        'district'  =>  $user->district
      ])->get();
    });
  }
}
