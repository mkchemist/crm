<?php

namespace App\Http\Resources\Admin\Validation;

use Illuminate\Http\Resources\Json\JsonResource;

class FrequencyValidationResource extends JsonResource
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
          'id'            =>  $this->id,
          'user'          =>  $this->user->name,
          'user_id'       =>  $this->user->id,
          'customer'      =>  $this->customer->name,
          'customer_id'   =>  $this->customer_id,
          'specialty'     =>  $this->customer->specialty,
          'brick'         =>  $this->customer->brick,
          'address'       =>  $this->customer->address,
          'area'          =>  $this->customer->area,
          'district'      =>  $this->customer->district,
          'territory'     =>  $this->customer->territory,
          'region'        =>  $this->customer->region,
          'from'          =>  $this->current,
          'to'            =>  $this->next,
          'locked'        =>  $this->locked ? true : false
        ];
    }
}
