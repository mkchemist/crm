<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Planner extends Model
{

  protected $fillable = [
    'customer_id',
    'user_id',
    'plan_date',
    'type',
    'dual_visit_with',
  ];

  public function customer() {
    return $this->belongsTo('App\Customer','customer_id','id');
  }
}
