<?php

namespace App\Http\Resources\OTCRep;

use Illuminate\Http\Resources\Json\JsonResource;

class PharmacyReportResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
          'id'  =>  $this->id,
          'date'  =>  $this->visit_date,
          'pharmacy'  =>  $this->pharmacy->name,
          'user'      =>  $this->user->name,
          'user_id'   =>  $this->user_id,
          'product'   =>  $this->product,
          'rate'      =>  $this->rate,
          'stock'     =>  $this->stock,
          'distributor' =>  $this->distributor,
          'order'     =>  $this->order,
          'competitor1' =>  $this->competitor1,
          'competitor1_rate' =>  $this->competitor1_rate,
          'competitor1_stock' =>  $this->competitor1_stock,
          'competitor2' =>  $this->competitor2,
          'competitor2_rate' =>  $this->competitor2_rate,
          'competitor2_stock' =>  $this->competitor2_stock,
          'competitor3' =>  $this->competitor3,
          'competitor3_rate' =>  $this->competitor3_rate,
          'competitor3_stock' =>  $this->competitor3_stock,
          'feedback'        =>  $this->general_feedback,
          'type'            =>  $this->pharmacy->type
        ];
    }
}
