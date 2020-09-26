<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PharmacyReport extends Model
{
  protected $fillable = [
    'pharmacy_id',
    'user_id',
    'general_feedback',
    'products'
  ];
}
