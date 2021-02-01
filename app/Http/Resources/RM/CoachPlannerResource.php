<?php

namespace App\Http\Resources\RM;

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
          'id'  =>  $this->id,
          'user_id' =>  $this->coach_id,
          'coach'   =>  $this->coach->name,
          'rep'   =>  $this->rep->name,
          'title'   =>  $this->rep->name,
          'start'   =>  $this->plan_date,
          'end'   =>  $this->plan_date,
          'rep_id'  =>  $this->rep_id,
          'class'   =>  'COACH'
        ];
    }
}
