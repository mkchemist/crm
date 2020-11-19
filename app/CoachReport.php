<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CoachReport extends Model
{
    protected $fillable = [
      'coach_id',
      'rep_id',
      'visit_date',
      'customer_id',
      'data',
      'coach_submit',
      'rep_submit',
    ];

    public function rep() {
      return $this->belongsTo('App\User', 'rep_id', 'id');
    }

    public function coach() {
      return $this->belongsTo('App\User', 'coach_id', 'id');
    }

    public function customer()
    {
      return $this->belongsTo('App\Customer', 'customer_id', 'id');
    }
}
