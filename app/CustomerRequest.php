<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CustomerRequest extends Model
{
    protected $fillable = [
        'user_id',
        'customer_id',
        'type',
        'comment',
        'state',
        'query_date',
        'apply_date',
        'approved',
        'approved_by',
        'quantity',
        'cost',
        'others',
        'am_approval',
        'am_approval_date',
        'rm_approval',
        'rm_approval_date',
        'reject_due',
        'product',
        'rx',
        'rx_months',
        'pharmacy1',
        'pharmacy2',
        'pharmacy3',
        'pharmacy4',
        'serial',
    ];

    protected $attributes = [
        'reject_due' => '',
    ];

    public function user()
    {
        return $this->belongsTo('App\User', 'user_id', 'id');
    }

    public function customer()
    {
        return $this->belongsTo('App\Customer', 'customer_id', 'id');
    }

    public function pharmacy_1()
    {
        return $this->belongsTo('App\Pharmacy', 'pharmacy1', 'id');
    }

    public function pharmacy_2()
    {
        return $this->belongsTo('App\Pharmacy', 'pharmacy2', 'id');
    }

    public function pharmacy_3()
    {
        return $this->belongsTo('App\Pharmacy', 'pharmacy3', 'id');
    }

    public function pharmacy_4()
    {
        return $this->belongsTo('App\Pharmacy', 'pharmacy4', 'id');
    }
}
