<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{

    protected $fillable = [
      "name",
      "specialty",
      "workplace_id",
      "title",
      "phone",
      "address",
      "brick",
      "area",
      "district",
      "territory",
      "region"
    ];

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

    public function fav() {
      return $this->hasMany('App\CustomerFavoriteList', 'customer_id', 'id');
    }

    public function planner()
    {
      return $this->hasMany('App\Planner', 'customer_id', 'id');
    }

    public function workplace()
    {
      return $this->belongsTo('App\Workplace', 'workplace_id', 'id');
    }
}
