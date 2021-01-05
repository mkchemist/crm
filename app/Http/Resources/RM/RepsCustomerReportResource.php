<?php

namespace App\Http\Resources\RM;

use App\User;
use Illuminate\Http\Resources\Json\JsonResource;

class RepsCustomerReportResource extends JsonResource
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
          'date'          =>  $this->visit_date,
          'coach'         =>  $this->coach ? $this->coach->name : null,
          'coach2'        =>  $this->coach2 ? $this->coach2->name: null,
          'comment'       =>  $this->comment,
          'feedback'      =>  $this->general_feedback,
          'reported_at'   =>  $this->created_at,
          'customer'      =>  $this->customer? $this->customer->name : null,
          'specialty'      =>  $this->customer? $this->customer->specialty : null,
          'area'          =>  $this->customer?$this->customer->area : null,
          'brick'         =>  $this->customer? $this->customer->brick : null,
          'district'      =>  $this->customer ? $this->customer->district : null,
          'territory'     =>  $this->customer ? $this->customer->territory : null,
          'address'       =>  $this->customer ? $this->customer->address : null,
          'products'      =>  json_decode($this->products),
          'parameter'     =>  count($this->customer->params) ? $this->customer->params[0]->current: "NN",
          'frequency'     =>  count($this->customer->frequency) ? $this->customer->frequency[0]->current : 0,
          'rep'           =>  $this->user->name,
          'user_id'       =>  $this->user_id
        ];
    }
}
