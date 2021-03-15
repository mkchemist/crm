<?php

namespace App;

use App\Helpers\Setting\ActiveCycleSetting;
use App\Helpers\Traits\CustomData;
use Illuminate\Database\Eloquent\Model;

class Pharmacy extends Model
{

  use CustomData;

  protected $fillable = [
    'name', 'type', 'key_person', 'address', 'brick',
    'area', 'district', 'territory', 'region', 'state',
    'approved_by','added_by','approved',
    'phone'
  ];

  /**
   * regular rep reports
   *
   *
   */
  public function report() {
    $model = $this->hasMany('App\PharmacyReport')->orderBy('visit_date');
    $activeCycle = new ActiveCycleSetting;
    $cycle = $activeCycle->all();
    return $this->getRelatedUserData($model,'visit_date', [$cycle->start, $cycle->end]);
  }

  /**
   * otc rep reports
   *
   *
   *
   */
  public function otcReport()
  {
    $model = $this->hasMany('App\OTCPharmacyReport','pharmacy_id', 'id');
    $active = new ActiveCycleSetting;
    $cycle = $active->all();
    return $this->getRelatedUserData($model,'visit_date',[$cycle->start, $cycle->end]);
  }


  public function addedBy()
  {
    return $this->belongsTo('App\User','added_by', 'id');
  }

  public function favorite()
  {
    $model = $this->hasMany('App\PharmacyFavoriteList');
    return $this->getRelatedUserData($model,'user_id');
  }
}
