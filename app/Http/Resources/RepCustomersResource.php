<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

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
      return [
        'id'    =>  $this->id,
        'name'  =>    $this->name,
        'title'   =>  $this->title,
        'specialty' =>  $this->specialty,
        'brick'   =>  $this->brick,
        'address' =>  $this->address,
        'area'    =>  $this->area,
        'workplace' =>  $this->workplace_id,
        'phone'   =>  $this->phone,
        'parameter' =>  count($this->params) ? $this->params[0]->current : "NN",
        'current_freq'    =>  count($this->frequency) ? $this->frequency[0]->current : 0,
        'next_freq'   =>  count($this->frequency) ? $this->frequency[0]->next : 0,
        'plans'       =>  count($this->planner),
        'workplace' =>  $this->workplace ? $this->workplace->name : null,
        'workplace_id' => $this->workplace ? $this->workplace->id : null,
        'reports'   =>  count($this->report),
        'freq'  =>  count($this->frequency) ? $this->frequency[0] : null,
        'last_freq_update'  =>  count($this->frequency) ? $this->frequency[0]->updated_at : null,
        'district'    =>  $this->district,
        'territory'   =>  $this->territory,
        'region'      =>  $this->region
      ];
    }
}
