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

    public function customer()
    {
      return $this->belongsTo('App\Customer', 'customer_id', 'id');
    }

    public function user()
    {
      return $this->belongsTo('App\User', 'user_id', 'id');
    }

}
