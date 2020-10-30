<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RepWorkplaceReport extends JsonResource
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
        'date'          =>  $this->visit_date,
        'customer_name' =>  $this->customer->name,
        'customer'      =>  $this->customer,
        'workplace_name'  =>  $this->workplace->name,
        'workplace'     =>  $this->workplace,
        'id'          =>  $this->id,
        'comment'     =>  $this->comment,
        'products'    =>  json_decode($this->products),
        'general_feedback'  =>  $this->general_feedback
      ];
    }
}
