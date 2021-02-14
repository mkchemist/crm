<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class OTCPharmacyReport extends Model
{
    protected $table="otc_pharmacy_reports";

    protected $fillable = [
      'user_id',
      'pharmacy_id',
      'visit_date',
      'type',
      'product',
      'product_type',
      'competitor1',
      'competitor1_rate',
      'competitor1_stock',
      'competitor2',
      'competitor2_rate',
      'competitor2_stock',
      'competitor3',
      'competitor3_rate',
      'competitor3_stock',
      'rate',
      'stock',
      'order',
      'distributor',
      'comment',
      'general_feedback',
      'competitor1_type',
      'competitor2_type',
      'competitor3_type',
    ];


    protected $attributes = [
      'comment' =>  ''
    ];

    public function pharmacy()
    {
      return $this->belongsTo('App\Pharmacy', 'pharmacy_id', 'id');
    }

    public function user()
    {
      return $this->belongsTo('App\User','user_id', 'id');
    }
}
