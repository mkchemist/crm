<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RepPharmacyReportResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return array(
          'id'  =>  $this->id,
          'pharmacy'  =>  $this->pharmacy,
          'pharmacy_name' =>  $this->pharmacy->name,
          'general_feedback'  =>  $this->general_feedback,
          'products'    =>  json_decode($this->products),
          'date'        =>  $this->visit_date,

        );
    }
}
