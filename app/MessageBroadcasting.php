<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MessageBroadcasting extends Model
{

    protected $fillable = [
      'body',
      'title',
      'type',
      'user_id'
    ];
    protected $attributes = [
      'for' =>  '[]'
    ];

    public function user()
    {
      return $this->belongsTo('App\User', 'user_id', 'id');
    }
}
