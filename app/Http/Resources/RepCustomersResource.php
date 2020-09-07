<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RepCustomersResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        //return parent::toArray($request);
      return [
        'id'    =>  $this->id,
        'name'  =>    $this->name,
        'title'   =>  $this->title,
        'specialty' =>  $this->specialty,
        'brick'   =>  $this->brick,
        'address' =>  $this->address,
        'area'    =>  $this->area,
        'workplace' =>  $this->workplace_id,
        'phone'   =>  $this->phone
      ];
    }
}
