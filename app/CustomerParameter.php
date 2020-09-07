<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CustomerParameter extends Model
{
    protected $fillable = [
      "customer_id",
      "user_id",
      "param"
    ];
}
