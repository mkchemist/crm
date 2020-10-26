<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\RepWorkplaceResource;

class RepWorkplacePlannerResource extends JsonResource
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
        'start'     =>  $this->plan_date,
        'end'       =>  $this->plan_date,
        'title'     =>  $this->workplace->name,
        'id'        =>  $this->id,
        'type'      =>  'AM',
        'class'     =>  'AM',
        'name'      =>  $this->workplace->name,
        'workplace' =>  $this->workplace
      ];
    }
}
