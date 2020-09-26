<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RepReportResource extends JsonResource
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
        'customer'  =>  $this->customer,
        'customer_name' =>  $this->customer->name,
        'customer_address'  =>  $this->customer->address,
        'customer_brick'    =>  $this->customer->brick,
        'customer_specialty'  =>  $this->customer->specialty,
        'date'        =>  $this->visit_date,
        'dual_with'        =>  $this->dual_with,
        'user'        =>  $this->user->name,
        'comment'     =>  $this->comment,
        'products'    =>  json_decode($this->products),
        'general_feedback'  =>  $this->general_feedback
       ];
    }
}