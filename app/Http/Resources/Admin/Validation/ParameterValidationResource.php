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
          'customer_id'     =>  $this->customer ?$this->customer->id : null,
          'customer'        =>  $this->customer ?$this->customer->name : null,
          'from'            =>  $this->current,
          'to'              =>  $this->next,
          'user'            =>  $this->user->name,
          'user_id'         =>  $this->user->id,
          'specialty'       =>  $this->customer ?$this->customer->specialty : null,
          'address'         =>  $this->customer ?$this->customer->address : null,
          'brick'           =>  $this->customer ?$this->customer->brick : null,
          'area'            =>  $this->customer ?$this->customer->area : null,
          'district'        =>  $this->customer ?$this->customer->district : null,
          'territory'       =>  $this->customer ?$this->customer->territory : null,
          'region'          =>  $this->customer ?$this->customer->region : null,
          'line'            =>  json_decode($this->user->line)
        ];
    }
}
