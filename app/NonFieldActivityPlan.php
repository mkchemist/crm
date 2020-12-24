<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class NonFieldActivityPlan extends Model
{
    protected $fillable = [
      'user_id',
      'start',
      'end',
      'type',
      'content',
      'approved',
      'submitted',
      'approved_by'
    ];


    public function user()
    {
      return $this->belongsTo('App\User', 'user_id', 'id');
    }
}
