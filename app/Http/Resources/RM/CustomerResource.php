<?php

namespace App\Http\Resources\RM;

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
          'id'  =>  $this->customer->id,
          'name'  =>  $this->customer->name,
          'specialty' => $this->customer->specialty,
          'area'    =>  $this->customer->area,
          'brick' =>  $this->customer->brick,
          'address' =>  $this->customer->address,
          'district'  =>  $this->customer->district,
          'territory' => $this->customer->territory,
          'rep'       =>  $this->user->name,
          'line'      =>  implode(' | ',json_decode($this->user->line)),
          'parameter' => $this->current,
          'frequency' => count($this->customer->frequency) ? $this->customer->frequency[0]->current : 0,
          'plans'     =>  $this->customer->planner->where('user_id','=', $this->user->id),
          'reports'   =>  $this->customer->report->where('user_id','=', $this->user->id)
        ];
    }
}
