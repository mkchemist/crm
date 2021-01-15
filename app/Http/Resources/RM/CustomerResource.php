<?php

namespace App\Http\Resources\RM;

use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
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
          'name'  =>  $this->name,
          'user_id' =>  $this->frequency[0]->user_id,
          'frequency' =>  $this->frequency[0]->current,
          'rep' =>  $this->frequency[0]->user->name,
          'parameter' =>  count($this->params) ? $this->params[0]->current : 'NN',
          'plans'     =>  count($this->planner),
          'specialty' =>  $this->specialty,
          'address'   =>  $this->address,
          'brick'     =>  $this->brick,
          'area'      =>  $this->area,
          'district'  =>  $this->district,
          'territory' =>  $this->territory
        ];
    }
}
