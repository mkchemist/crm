<?php

namespace App\Http\Resources\DM;

use Illuminate\Http\Resources\Json\JsonResource;

class CustomerReportResource extends JsonResource
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
          'date'        =>  $this->visit_date,
          'user_name'  =>  $this->user->name,
          'coach'       =>  $this->coach ? $this->coach->name: null,
          'coach2'      =>  $this->coach2 ? $this->coach2->name: null,
          'customer'    =>  $this->customer->name,
          'specialty'   =>  $this->customer->specialty,
          'param'       =>  count($this->customer->params) ? $this->customer->params[0]->current: 'NN',
          'address'     =>  $this->customer->address,
          'brick'       =>  $this->customer->brick,
          'area'        =>  $this->customer->area,
          'comment'     =>  $this->comment,
          'feedback'    =>  $this->general_feedback,
          'products'     =>  json_decode($this->products),
          'user_id'     =>  $this->user_id,
          'plans'       =>  count($this->customer->planner),
          'reports'     =>  count($this->customer->report)
        ];
    }
}
