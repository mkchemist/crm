<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CustomerFavoriteList extends Model
{
    protected $fillable = [
      'customer_id',
      'user_id'
    ];

    public function customer()
    {
      return $this->belongsTo('App\Customer','customer_id', 'id');
    }
}
