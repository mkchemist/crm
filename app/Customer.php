<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    public function params()
    {
      return $this->hasMany('App\CustomerParameter','customer_id', 'id');
    }

    public function frequency()
    {
      return $this->hasMany('App\CustomerFrequency','customer_id','id');
    }

    public function report()
    {
      return $this->hasMany('App\CustomerReport', 'customer_id', 'id');
    }
}
