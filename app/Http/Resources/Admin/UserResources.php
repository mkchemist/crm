<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResources extends JsonResource
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
          'name'  =>  $this->name,
          'username'  =>  $this->username,
          'email'     =>  $this->email,
          'role'      =>  $this->role,
          'line'      =>  json_decode($this->line),
          'assigned_brick'  =>  json_decode($this->assigned_brick),
          'assigned_specialties'  =>  json_decode($this->assigned_specialties),
          'area'          =>  json_decode($this->area),
          'territory'     =>  json_decode($this->territory),
          'district'      =>  json_decode($this->district),
          'region'        =>  json_decode($this->region),
          'active'        =>  $this->active,
          'api_token'     =>  $this->api_token,
          'relations'     =>  json_decode($this->user_relations)
        ];
    }
}
