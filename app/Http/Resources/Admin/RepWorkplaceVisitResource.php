<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Resources\Json\JsonResource;

class RepWorkplaceVisitResource extends JsonResource
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
          'rep' =>  $this->user->name,
          'visit_date'  =>  $this->visit_date,
          'workplace'   =>  $this->workplace->name,
          'customer'    =>  $this->customer->name,
          'user_id'     =>  $this->user_id,
          'specialty'   =>  $this->customer->specialty,
          'type'        =>  $this->workplace->type,
          'products'    =>  json_decode($this->products),
          'comment'     =>  $this->comment,
          'feedback'    =>  $this->general_feedback,
          'address'     =>  $this->address,
          'brick'       =>  $this->workplace->brick,
          'area'        =>  $this->workplace->area,
          'district'    =>  $this->workplace->district,
          'territory'   =>  $this->workplace->territory
        ];
    }
}
