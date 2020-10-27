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
        $freq = count($this->customer->frequency) ? $this->customer->frequency[0]->current: 0;
        return [
          //'customer' => new RepCustomersResource($this->customer),
          'start'    => $this->plan_date,
          'end'      => $this->plan_date,
          'id'      =>  $this->id,
          'type'    =>  $this->type,
          'class'   =>  'PM',
          'title'    =>  $this->customer->name,
          'specialty' =>  $this->customer->specialty,
          'freq'      =>  $freq,
          'plans_count' =>  count($this->customer->planner),
          'customer_id' =>  $this->customer->id
        ];
    }
}
