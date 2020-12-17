<?php

namespace App\Http\Resources\DM;

use Illuminate\Http\Resources\Json\JsonResource;

class WorkplaceReportResource extends JsonResource
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
          'user_name' =>  $this->user->name,
          'user_id'   =>  $this->user->id,
          'date'      =>  $this->visit_date,
          'hospital_name' =>  $this->workplace->name,
          'hospital_type' =>  $this->workplace->type,
          'address'     =>  $this->workplace->address,
          'brick'       =>  $this->workplace->brick,
          'area'        =>  $this->workplace->area,
          'comment'     =>  $this->comment,
          'dual_with'   =>  $this->coach ? $this->coach->name: '',
          'products'    =>  json_decode($this->products),
          'feedback'    =>  $this->general_feedback,
          'customer_name'    =>  $this->customer->name,
          'customer_specialty'      => $this->customer->specialty
        ];
    }
}
