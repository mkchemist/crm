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
}
