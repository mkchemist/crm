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
        return [
          'customer' => new RepCustomersResource($this->customer) ,
          'start'    => $this->plan_date,
          'end'      => $this->plan_date,
          'title'    => $this->customer->name,
          'id'      =>$this->id,
          'type'    =>  $this->type,
          'class'   =>  'PM'
        ];
    }
}
