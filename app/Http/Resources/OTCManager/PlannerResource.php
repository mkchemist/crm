<?php

namespace App\Http\Resources\OTCManager;

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
        $pharmacy = $this->pharmacy ? $this->pharmacy->name : 'Visits in';
        $rep = $this->user->name;
        $title = $rep."<br>".$pharmacy."<br>".$this->title;
        $class = $this->type === "regular" ? "pharmacy-plan" : 'health-day';
        return [
          "title" =>  $title,
          'start' =>  $this->plan_date,
          'user_id' =>  $this->user_id,
          'end'     =>  $this->plan_date,
          "class"   =>  $class,
          'rep'    =>  $this->user->name,
          'pharmacy'  =>  $this->pharmacy ? $this->pharmacy->name: '',
          'brick'   => $this->pharmacy ? $this->pharmacy->brick : $this->title,
          "approved"  =>  $this->approved,
          'submitted' =>  $this->submitted,
          'type'    =>  $this->type,
        ];
    }
}
