<?php

namespace App\Http\Resources\DM;

use Illuminate\Http\Resources\Json\JsonResource;

class DistrictRepResource extends JsonResource
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
          "id"  =>  $this->id,
          'name'  =>  $this->name,
          'area'  =>  $this->area,
          'assigned_brick' => $this->assigned_brick,
          'district'        =>  $this->district,
          'territory'       =>  $this->territory,
          'line'            =>  json_decode($this->line)
        ];
    }
}
