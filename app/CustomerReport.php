<?php

namespace App;

use App\Helpers\Traits\CustomData;
use Illuminate\Database\Eloquent\Model;

class CustomerReport extends Model
{
  use CustomData;

  protected $fillable = [
    'customer_id',
    'user_id',
    'visit_date',
    'dual_with',
    'comment',
    'products',
    'general_feedback',
    'visit_type'
  ];

  public function customer()
  {
    return $this->belongsTo("App\Customer", "customer_id", "id");
  }

  public function user()
  {
    return $this->belongsTo("App\User", "user_id", "id");
  }

  public function coach() {
    return $this->belongsTo('App\User', 'dual_with', 'id');
  }
}
