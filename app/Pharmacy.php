<?php

namespace App;

use App\Helpers\Traits\CustomData;
use Illuminate\Database\Eloquent\Model;

class Pharmacy extends Model
{

  use CustomData;

  protected $fillable = [
    'name', 'type', 'key_person', 'address', 'brick',
    'area', 'district', 'territory', 'region', 'state',
    'approved_by'
  ];

  public function report() {
    $model = $this->hasMany('App\PharmacyReport')->orderBy('visit_date');
    return $this->getRelatedUserData($model);
  }
}
