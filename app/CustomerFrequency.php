<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CustomerFrequency extends Model
{
    protected $fillable = [
      "user_id",
      "customer_id",
      "current",
      "next",
      "locked"
    ];
}
