<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RepPlannerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $freq = $this->customer && count($this->customer->frequency) ? $this->customer->frequency[0]->current: 0;
        $params = $this->customer && count($this->customer->params) ? $this->customer->params[0]->current: 'NN';
        return [
          //'customer' => new RepCustomersResource($this->customer),
          'start'    => $this->plan_date,
          'end'      => $this->plan_date,
          'id'      =>  $this->id,
          'type'    =>  $this->type,
          'class'   =>  $this->submitted ? 'submitted PM' :'PM',
          'title'    => $this->customer ?$this->customer->name : '',
          'specialty' =>  $this->customer?$this->customer->specialty: '',
          'freq'      =>  $freq,
          'param'     =>  $params,
          'plans_count' =>  $this->customer?count($this->customer->planner) : '',
          'customer_id' =>  $this->customer ?$this->customer->id: '',
          'user_id'     =>  $this->user->id,
          'area'        =>  $this->customer?$this->customer->area : '',
          'brick'       =>  $this->customer?$this->customer->brick : '',
          'user_name'   =>  $this->user->name,
          'address'     =>  $this->customer?$this->customer->address : '',
          'date'        =>  $this->plan_date,
          'submitted'   =>  $this->submitted
        ];
    }
}
