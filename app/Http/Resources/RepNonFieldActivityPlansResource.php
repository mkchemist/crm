<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RepNonFieldActivityPlansResource extends JsonResource
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
          'title' =>  $this->content,
          'start' =>  $this->start,
          'end'   =>  $this->end,
          'class' =>  $this->type === 'non-field-activity' ?'non-field-activity' : 'field-activity',
          'user'  =>  $this->user->name,
          'user_title' =>  $this->user->role,
          'id'    =>  $this->id,
          'user_id' =>  $this->user_id,
          'type'    =>  'non-field-activity',
          'date_start'  =>  $this->start,
          'date_end'    =>  $this->end,
          'plan_type'   =>  $this->type
        ];
    }
}
