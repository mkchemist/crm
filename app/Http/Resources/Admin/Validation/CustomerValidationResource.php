<?php

namespace App\Http\Resources\Admin\Validation;

use Illuminate\Http\Resources\Json\JsonResource;

class CustomerValidationResource extends JsonResource
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
          'id'            =>  $this->id,
          'user'          =>  $this->user->name,
          'user_id'       =>  $this->user->id,
          'customer'      =>  $this->customer->name,
          'customer_id'   =>  $this->customer->id,
          'specialty'     =>  $this->customer->specialty,
          'new_workplace' =>  $this->workplace ? $this->workplace->name : '',
          'old_workplace' =>  $this->customer->workplace ? $this->customer->workplace->name : '',
          'new_phone'     =>  $this->phone,
          'old_phone'     =>  $this->customer->phone,
          'new_title'     =>  $this->title,
          'old_title'     =>  $this->customer->title,
          'new_address'   =>  $this->address,
          'old_address'   =>  $this->customer->address,
          'brick'         =>  $this->customer->brick,
          'area'          =>  $this->customer->area,
          'district'      =>  $this->customer->district,
          'territory'     =>  $this->customer->territory,
          'region'        =>  $this->customer->region,
          'state'         =>  $this->approved === 1 ? true : false,
          'approval'      =>  $this->approved_by ? true : false,
          "line"          =>  json_decode($this->user->line)

        ];
    }
}
