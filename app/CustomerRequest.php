<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CustomerRequest extends Model
{
    protected $fillable = [
      'user_id',
      'customer_id',
      'type',
      'comment',
      'state',
      'query_date',
      'apply_date',
      'approved',
      'approved_by',
      'quantity',
      'price'
    ];

    public function user()
    {
      return $this->belongsTo('App\User', 'user_id', 'id');
    }

    public function customer()
    {
      return $this->belongsTo('App\Customer', 'customer_id', 'id');
    }
}
