<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Resources\Json\JsonResource;

class RepPharmacyVisitResource extends JsonResource
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
            'rep' => $this->user->name,
            'visit_date' => $this->visit_date,
            'pharmacy' => $this->pharmacy->name,
            'user_id' => $this->user_id,
            'type' => $this->pharmacy->type,
            'key_person' => $this->pharmacy->key_person,
            'products' => json_decode($this->products),
            'feedback' => $this->general_feedback,
            'address' => $this->address,
            'brick' => $this->pharmacy->brick,
            'area' => $this->pharmacy->area,
            'district' => $this->pharmacy->district,
            'territory' => $this->pharmacy->territory,
        ];
    }
}
