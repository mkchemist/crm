<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CustomerValidation extends Model
{

  protected $fillable = [
    'user_id',
    'customer_id',
    'title',
    'phone',
    'address',
    'workplace_id',
    'approved',
    'approved_by'
  ];

  public function customer() {
    return $this->belongsTo('App\Customer');
  }

  public function user() {
    return $this->belongsTo('App\User');
  }

  public function workplace() {
    return $this->belongsTo('App\Workplace');
  }
}
