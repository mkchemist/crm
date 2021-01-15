<?php

namespace App\Http\Resources\DM;

use Illuminate\Http\Resources\Json\JsonResource;

class CoachPlannerResource extends JsonResource
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
          'start'  =>  $this->plan_date,
          'end'  =>  $this->plan_date,
          'class' =>  'PM',
          'title' =>  $this->rep->name,
          'area'  =>  $this->rep->area,
          'id'    =>  $this->id,
          'user_id' =>  $this->coach->id,
          'type'    =>  'coach-plan',
          'date_start'=>  $this->plan_date,
          'date_end'  =>  $this->plan_date,
          'rep_id'    =>  $this->rep_id
        ];
    }
}
