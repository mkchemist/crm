<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WorkplacePlanner extends Model
{
    protected $fillable = [
      'workplace_id',
      'user_id',
      'plan_date'
    ];

    public function workplace()
    {
      return $this->belongsTo('App\Workplace', 'workplace_id', 'id');
    }

    public function user()
    {
      return $this->belongsTo('App\User', 'user_id', 'id');
    }
}
