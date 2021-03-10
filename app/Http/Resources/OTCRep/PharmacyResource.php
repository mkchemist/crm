<?php

namespace App\Http\Resources\OTCRep;

use Illuminate\Http\Resources\Json\JsonResource;

class PharmacyResource extends JsonResource
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
          'id'          =>  $this->id,
          'name'        =>  $this->name,
          'type'        =>  $this->type,
          'key_person'  =>  $this->key_person,
          'address'     =>  $this->address,
          'brick'       =>  $this->brick,
          'area'        =>  $this->area,
          'district'    =>  $this->district,
          'territory'   =>  $this->territory,
          'reports'     =>  count($this->otcReport),
          'reports_details'=> $this->otcReport,
          'phone'       =>  $this->phone,
          'isFavorite'  => count($this->favorite) ? 'yes': 'No'
        ];
    }
}
