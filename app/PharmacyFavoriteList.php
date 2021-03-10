<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PharmacyFavoriteList extends Model
{


    protected $fillable = [
      'pharmacy_id',
      'user_id'
    ];

    public function pharmacy()
    {
      return $this->belongsTo('App\Pharmacy', 'pharmacy_id', 'id');
    }
}
