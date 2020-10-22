<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Customer extends Model
{

  protected $fillable = [
    "name",
    "specialty",
    "workplace_id",
    "title",
    "phone",
    "address",
    "brick",
    "area",
    "district",
    "territory",
    "region"
  ];

  protected $with = [
    'params',
    'frequency',
    'report',
    'planner',
    'workplace'
  ];

  public function params()
  {
    return $this->hasMany('App\CustomerParameter', 'customer_id', 'id');
  }

  public function frequency()
  {
    $model = $this->hasMany('App\CustomerFrequency');
    return $this->getUserData($model);

  }

  public function report()
  {
    $model = $this->hasMany('App\CustomerReport');
    return $this->getUserData($model);
  }

  public function fav()
  {
    return $this->hasMany('App\CustomerFavoriteList', 'customer_id', 'id');
  }

  public function planner()
  {
   $model = $this->hasMany('App\Planner', 'customer_id', 'id');
   return $this->getUserData($model);
  }

  public function workplace()
  {
    return $this->belongsTo('App\Workplace', 'workplace_id', 'id');
  }

  private function getUser() {
    $user = Auth::user();
    return $user;
  }

  private function getUserData($model)
  {
    $user = $this->getUser();
    return $model->whereIn('user_id', function($query) use($user) {
      $query->from('users')->select('id')
      ->where([
        'line'  =>  $user->line,
        'district'  =>  $user->district
      ])->get();
    });
  }
}
