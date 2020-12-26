<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class NonFieldActivityReport extends Model
{
    protected $fillable = [
      'user_id',
      'content',
      'start',
      'comment',
      'end',
      'type',
      'approved',
      'approved_by'
    ];

    public function user()
    {
      return $this->belongsTo('App\User', 'user_id', 'id');
    }
}
