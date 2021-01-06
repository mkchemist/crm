<?php

namespace App\Http\Resources\RM;

use Illuminate\Http\Resources\Json\JsonResource;

class RepsPharmacyReportResource extends JsonResource
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
          'rep'   =>  $this->user->name,
          'user_id' =>  $this->user_id,
          'pharmacy'  =>  $this->pharmacy->name,
          'products'  =>  json_decode($this->products),
          'feedback'  =>  $this->general_feedback,
          'address'   =>  $this->pharmacy->address,
          'brick'     =>  $this->pharmacy->brick,
          'area'      =>  $this->pharmacy->area,
          'district'  =>  $this->pharmacy->district,
          'territory' =>  $this->pharmacy->territory,
          'type'      =>  $this->type,
          'key_person'  =>  $this->key_person
        ];
    }
}
