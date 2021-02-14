<?php

namespace App\Http\Resources\DM;

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
          'rep_name'        =>  $this->user->name,
          'user_id'         =>  $this->user_id,
          'date'            =>  $this->visit_date,
          'pharmacy_name'   =>  $this->pharmacy->name,
          'type'            =>  $this->pharmacy->type,
          'products'        =>  json_decode($this->products),
          'feedback'        =>  $this->general_feedback,
          'address'         =>  $this->pharmacy->address,
          'brick'           =>  $this->pharmacy->brick,
          'area'            =>  $this->pharmacy->area,
          'id'              =>  $this->id
        ];
    }
}
