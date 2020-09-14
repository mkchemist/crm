<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WorkplaceDepartment extends Model
{
  protected $fillable = [
    'workplace_id',
    'name',
    'head'
  ];
}
