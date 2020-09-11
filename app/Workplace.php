<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Workplace extends Model
{
    protected $fillable = [
      'name',
      'type',
      'address',
      'brick',
      'area',
      'district',
      'territory',
      'region'
    ];
}
