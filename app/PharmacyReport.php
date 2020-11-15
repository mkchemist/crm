<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PharmacyReport extends Model
{
  protected $fillable = [
    'pharmacy_id',
    'user_id',
    'visit_date',
    'general_feedback',
    'products'
  ];

  public function pharmacy()
  {
    return $this->belongsTo('App\Pharmacy', 'pharmacy_id', 'id');
  }

  public function user()
  {
    return $this->belongsTo('App\User');
  }
}
