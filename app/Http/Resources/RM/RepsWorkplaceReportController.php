<?php

namespace App\Http\Resources\RM;

use Illuminate\Http\Resources\Json\JsonResource;

class RepsWorkplaceReportController extends JsonResource
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
          'rep' =>  $this->user->name,
          'date'  =>  $this->visit_date,
          'workplace' => $this->workplace->name,
          'user_id'   =>  $this->user_id,
          'customer'  =>  $this->customer->name,
          'specialty' =>  $this->customer->specialty,
          'address'   =>  $this->workplace->address,
          'brick'     =>  $this->workplace->brick,
          'area'      =>  $this->workplace->area,
          'district'  =>  $this->workplace->district,
          'territory' =>  $this->workplace->territory,
          'products'  =>  json_decode($this->products),
          'comment'   =>  $this->comment,
          'feedback'  =>  $this->general_feedback
        ];
    }
}
