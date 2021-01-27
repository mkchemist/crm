<?php

namespace App\Http\Resources\OTCRep;

use Illuminate\Http\Resources\Json\JsonResource;

class PlannerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $title = $this->type === "regular"
        ? "<span class='fa fa-store mr-1'></span>$this->title"
        : "<span class='fa fa-briefcase-medical mr-1'></span>$this->title in {$this->pharmacy->name} pharmacy";
        $class = $this->type === "regular" ? 'pharmacy-plan' : 'health-day';
        if($this->submitted) {
          $class .=" submitted";
        }
        return [
          'user_id' =>  $this->user_id,
          'id'      =>  $this->id,
          'start'   =>  $this->plan_date,
          'end'     =>  $this->plan_date,
          'title'   =>  $title,
          'submitted' =>  $this->submitted,
          'type'    =>  $this->type,
          'class'   =>  $class
        ];
    }
}
