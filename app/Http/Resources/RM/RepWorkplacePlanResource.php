<?php

namespace App\Http\Resources\RM;

use Illuminate\Http\Resources\Json\JsonResource;

class RepWorkplacePlanResource extends JsonResource
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
          'user_id' =>  $this->user_id,
          'rep'     =>  $this->user->name,
          'start'     =>  $this->plan_date,
          'end'     =>  $this->plan_date,
          'workplace' =>  $this->workplace->name,
          'title' =>  $this->workplace->name,
          'address'   =>  $this->workplace->address,
          'area'      =>  $this->workplace->area,
          'district'  =>  $this->workplace->district,
          'brick'     =>  $this->workplace->brick,
          'territory' =>  $this->workplace->territory,
          'type'      =>  'AM',
          'workplace_type'      =>  $this->workplace->type,
          'class'     =>  'AM'

        ];
    }
}
