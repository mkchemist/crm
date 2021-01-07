<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Resources\Json\JsonResource;

class RepCustomerVisitResource extends JsonResource
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
          'rep' =>  $this->rep,
          'user_id' =>  $this->user_id,
          'visit_date'  =>  $this->date,
          'customer'  =>  $this->name,
          'specialty' =>  $this->specialty,
          'parameter' =>  $this->parameter,
          'frequency' =>  $this->frequency,
          'planned'   =>  $this->plan_date ? 'planned' : 'unplanned',
          'coach1'    =>  $this->coach1_name,
          'coach2'    =>  $this->coach2_name,
          'products'  =>  json_decode($this->products),
          'address'   =>  $this->address,
          'brick'     =>  $this->brick,
          'area'      =>  $this->area,
          'district'  =>  $this->district,
          'territory' =>  $this->territory,
          'comment'     =>  $this->comment,
          'feedback'    =>  $this->general_feedback,
        ];
    }
}
