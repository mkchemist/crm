<?php

namespace App\Http\Resources\DM;

use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
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
      "id"    =>  $this->id,
      'title' =>  $this->title,
      "name"  =>  $this->name,
      "specialty" => $this->specialty,
      "brick"     =>  $this->brick,
      "address"   =>  $this->address,
      "current_freq"   =>  count($this->frequency) ? $this->frequency[0]->current : 0,
      "next_freq"     => count($this->frequency) ? $this->frequency[0]->next : 0,
      "area"    =>  $this->area,
      "parameter"   =>  count($this->params) ? $this->params[0]->current : 'NN',
      "reports" =>  count($this->report),
      'workplace' =>  $this->workplace ? $this->workplace->name : null,
      "plans"     =>  count($this->planner),
      'district'  =>  $this->district,
      'territory' =>  $this->territory,
      'region'    =>  $this->region
    ];
  }

}
