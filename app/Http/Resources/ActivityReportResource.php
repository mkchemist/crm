<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ActivityReportResource extends JsonResource
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
          'id'        =>  $this->id,
          'start'     =>  $this->start,
          'end'       =>  $this->end,
          'user'      =>  $this->user->name,
          'user_id'   =>  $this->user_id,
          'comment'   =>  $this->comment,
          'type'      =>  $this->type,
          'content'   =>  $this->content
        ];
    }
}
