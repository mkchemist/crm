<?php

namespace App\Http\Resources\OTCRep;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;

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
          'type'            =>  $this->pharmacy->type,
          'report_type'     =>  $this->type,
          'comment'         =>  isset($this->comment) ? json_decode($this->comment) : [],
          'address'         =>  $this->pharmacy->address,
          'brick'           =>  $this->pharmacy->brick,
          'area'            =>  $this->pharmacy->area,
          'district'        =>  $this->pharmacy->district,
          'territory'       =>  $this->pharmacy->territory,
          'product_type'    =>  $this->product_type,
          'competitor1_type' => $this->competitor1_type,
          'competitor2_type' => $this->competitor2_type,
          'competitor3_type' => $this->competitor3_type,
        ];
       /*  return [$this->collection]; */
       /* return $this->collection; */
    }

    public function with($request) {
      return [
        "code"  =>  200
      ];
    }
}
