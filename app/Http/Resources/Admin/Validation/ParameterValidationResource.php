<?php

namespace App\Http\Resources\Admin\Validation;

use Illuminate\Http\Resources\Json\JsonResource;

class ParameterValidationResource extends JsonResource
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
          'id'              =>  $this->id,
          'customer_id'     =>  $this->customer->id,
          'customer'        =>  $this->customer->name,
          'from'            =>  $this->current,
          'to'              =>  $this->next,
          'user'            =>  $this->user->name,
          'user_id'         =>  $this->user->id,
          'specialty'       =>  $this->customer->specialty,
          'address'         =>  $this->customer->address,
          'brick'           =>  $this->customer->brick,
          'area'            =>  $this->customer->area,
          'district'        =>  $this->customer->district,
          'territory'       =>  $this->customer->territory,
          'region'          =>  $this->customer->region
        ];
    }
}
