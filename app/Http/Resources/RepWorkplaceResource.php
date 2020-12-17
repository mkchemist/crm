<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RepWorkplaceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        //return parent::toArray($request);
        return [
          'id'    =>  $this->id,
          'name'  =>  $this->name,
          'type'  =>  $this->type,
          'address' =>  $this->address,
          'brick'   =>  $this->brick,
          'area'    =>  $this->area,
          'state'   =>  $this->state,
          'depart'  =>  $this->departs,
          'phone'   =>  $this->phone ?? '',
          'plans'   =>  count($this->plans),
          'visits'  =>  count($this->reports->groupBy('visit_date')),
          'diff'    =>  count($this->plans) - count($this->reports->groupBy('visit_date'))
        ];
    }
}
