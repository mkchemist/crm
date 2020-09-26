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
      $user = Auth::user();
      $params = $this->params()->where(['user_id' => $user->id])->first();
      $freq = $this->frequency()->where(['user_id' =>  $user->id])->first();
      $plans = $this->planner()->where(['user_id' =>  $user->id])->get();
      $report = $this->report()->where(['user_id' => $user->id])->get();
      $workplace = $this->workplace ? $this->workplace->name : null;
      $workplace_id = $this->workplace? $this->workplace->id : null;

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
        'phone'   =>  $this->phone,
        'parameter' =>  $params ? $params->param : "NN",
        'current_freq'    =>  $freq ? $freq->current : 0,
        'next_freq'   =>  $freq ? $freq->next : 0,
        'plans'       =>  count($plans),
        'workplace' =>  $workplace,
        'workplace_id' => $workplace_id,
        'report'   =>  count($report)
      ];
    }
}
