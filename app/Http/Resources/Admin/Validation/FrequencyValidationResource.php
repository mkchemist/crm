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
          'customer'      =>  $this->customer ?$this->customer->name:'',
          'customer_id'   =>  $this->customer ?$this->customer_id :'',
          'specialty'     =>  $this->customer ?$this->customer->specialty :'',
          'brick'         =>  $this->customer ?$this->customer->brick :'',
          'address'       =>  $this->customer ?$this->customer->address :'',
          'area'          =>  $this->customer ?$this->customer->area :'',
          'district'      =>  $this->customer ?$this->customer->district :'',
          'territory'     =>  $this->customer ?$this->customer->territory :'',
          'region'        =>  $this->customer ?$this->customer->region :'',
          'from'          =>  $this->current,
          'to'            =>  $this->next,
          'locked'        =>  $this->locked ? true : false
        ];
    }
}
