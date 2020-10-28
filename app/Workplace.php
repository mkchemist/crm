<?php

namespace App;

use App\Helpers\Traits\CustomData;
use Illuminate\Database\Eloquent\Model;

class Workplace extends Model
{
    use CustomData;

    protected $fillable = [
      'name',
      'type',
      'address',
      'brick',
      'area',
      'district',
      'territory',
      'region',
      'phone'
    ];

    public function departs()
    {
      return $this->hasMany('App\WorkplaceDepartment', 'workplace_id', 'id');
    }

    public function reports()
    {
      $model = $this->hasMany('App\WorkplaceReport')->orderBy('visit_date');
      return $this->getRelatedUserData($model);
    }

    public function plans()
    {
      $model = $this->hasMany('App\WorkplacePlanner')->orderBy('plan_date');
      return $this->getRelatedUserData($model);
    }
}
