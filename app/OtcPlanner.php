<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class OtcPlanner extends Model
{
    protected $fillable = [
      'user_id',
      'plan_date',
      'type',
      'title',
      'submitted',
      'approved',
      'approved_by',
      'pharmacy_id'
    ];

    public function user() {
      return $this->belongsTo('App\User', 'user_id', 'id');
    }

    public function approval()
    {
      return $this->belongsTo('App\User', 'approved_by', 'id');
    }

    public function pharmacy()
    {
      return $this->belongsTo('App\Pharmacy', 'pharmacy_id', 'id');
    }
}
