<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CoachPlanner extends Model
{
    protected $fillable = [
      'plan_date',
      'coach_id',
      'rep_id',
      'submitted'
    ];

    public function coach()
    {
      return $this->belongsTo('App\User', 'coach_id','id');
    }

    public function rep()
    {
      return $this->belongsTo('App\User', 'rep_id', 'id');
    }
}
