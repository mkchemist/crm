<?php

namespace App\Http\Resources\DM;

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
          'id'          =>  $this->id,
          'customer_id' =>  $this->customer_id,
          'customer_name'    =>  $this->customer->name,
          'customer_specialty'   =>  $this->customer->specialty,
          'customer_params'      =>  count($this->customer->params) ? $this->customer->params[0]->current : 'NN',
          'brick'       =>  $this->customer->brick,
          'address'     =>  $this->customer->address,
          'area'        =>  $this->customer->area,
          'rep'         =>  $this->rep->name,
          'coach'       =>  $this->coach->name,
          'date'        =>  $this->visit_date,
          'report'      =>  $this->data,
          'coach_submit' => $this->coach_submit,
          'rep_submit'  =>  $this->rep_submit,
          "rep_id"       => $this->rep->id
        ];
    }
}
