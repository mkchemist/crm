<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WorkplaceReport extends Model
{
  protected $fillable = [
    'visit_date',
    'workplace_id',
    'user_id',
    'customer_id',
    'products',
    'comment',
    'general_feedback',
    'dual_with'
  ];

  public function customer()
  {
    return $this->belongsTo('App\Customer', 'customer_id', 'id');
  }

  public function workplace()
  {
    return $this->belongsTo('App\Workplace', 'workplace_id', 'id');
  }
}
