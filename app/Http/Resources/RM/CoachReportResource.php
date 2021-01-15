<?php

namespace App\Http\Resources\RM;

use Illuminate\Http\Resources\Json\JsonResource;

class CoachReportResource extends JsonResource
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
          'id'      =>  $this->id,
          'rep_id'  =>  $this->rep_id,
          'coach_id'  =>  $this->coach_id,
          'rep'       =>  $this->rep->name,
          'coach'     =>  $this->coach->name,
          'date'    =>  $this->visit_date,
          'customer'  =>  $this->customer->name,
          'specialty' =>  $this->customer->specialty,
          'parameter' =>  count($this->customer->params) ? $this->customer->params[0]->current : 'NN',
          'frequency' =>  count($this->customer->frequency) ? $this->customer->frequency[0]->current : 0,
          'brick'     =>  $this->customer->brick,
          'area'      =>  $this->customer->area,
          'district'  =>  $this->customer->district,
          'submitted' =>  $this->coach_submit ? true : false
        ];
    }
}
