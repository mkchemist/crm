<?php

namespace App;

use App\Helpers\Setting\ActiveCycleSetting;
use App\Helpers\Traits\CustomData;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Customer extends Model
{

  use CustomData;

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
    "region",
    'state',
    "added_by",
    'approved_by',
    'approved'
  ];

  /* protected $with = [
    'params',
    'frequency',
    'report',
    'planner',
    'workplace'
  ]; */

  public function params()
  {
   $model = $this->hasMany('App\CustomerParameter','customer_id', 'id');
   return $this->getRelatedUserData($model);
  }

  public function frequency()
  {
    $model = $this->hasMany('App\CustomerFrequency');
    return $this->getRelatedUserData($model);

  }

  public function report()
  {
    $model = $this->hasMany('App\CustomerReport');
    $activeCycle = new ActiveCycleSetting;
    $data = $activeCycle->all();
    return $this->getRelatedUserData($model, 'visit_date', [$data->start, $data->end]);
  }

  public function fav()
  {
    return $this->hasMany('App\CustomerFavoriteList', 'customer_id', 'id');
  }

  public function planner()
  {
   $model = $this->hasMany('App\Planner', 'customer_id', 'id');
   $activeCycle = new ActiveCycleSetting;
   $data = $activeCycle->all();
   return $this->getRelatedUserData($model,'plan_date' ,[$data->start, $data->end]);
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

  public function requests() {
    return $this->hasMany('App\CustomerRequest','customer_id', 'id');
  }

  public function addedBy()
  {
    return $this->belongsTo('App\User','added_by', 'id');
  }
}
