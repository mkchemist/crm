<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Pharmacy extends Model
{
  protected $fillable = [
    'name', 'type', 'key_person', 'address', 'brick',
    'area', 'district', 'territory', 'region', 'state',
    'approved_by'
  ];
}
