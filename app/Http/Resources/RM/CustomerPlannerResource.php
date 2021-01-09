<?php

namespace App\Http\Resources\RM;

use Illuminate\Http\Resources\Json\JsonResource;

class CustomerPlannerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $freq = count($this->customer->frequency) ? $this->customer->frequency[0]->current : 0;
        $param = count($this->customer->params) ? $this->customer->params[0]->current : 0;
        return [
          'start'      =>  $this->plan_date,
          'end'      =>  $this->plan_date,
          'user_id'   =>  $this->user_id,
          'rep'       =>  $this->user->name,
          'title'  =>  $this->customer->name,
          'specialty' =>  $this->customer->specialty,
          'address'   =>  $this->customer->address,
          'brick'     =>  $this->customer->brick,
          'area'      =>  $this->customer->area,
          'district'  =>  $this->customer->district,
          'territory' =>  $this->customer->territory,
          'parameter' =>  $param,
          'frequency' =>  $freq,
          'count_plans' =>  count($this->customer->planner),
          'diff'      =>  $freq - count($this->customer->planner)
        ];
    }
}
