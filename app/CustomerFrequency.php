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

    public function customer()
    {
      return $this->belongsTo('App\Customer', 'customer_id', 'id');
    }

    public function user()
    {
      return $this->belongsTo('App\User', 'user_id', 'id');
    }
}
