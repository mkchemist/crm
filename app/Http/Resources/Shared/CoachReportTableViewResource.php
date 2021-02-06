<?php

namespace App\Http\Resources\Shared;

use Illuminate\Http\Resources\Json\JsonResource;

class CoachReportTableViewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $param = $this->customer->params && count($this->customer->params) ? $this->customer->params[0]->current : 'NN';
        return [
            'date' => $this->visit_date,
            'coach_name' => $this->coach->name,
            'rep_name' => $this->rep->name,
            'line' => $this->rep->line,
            'coach_submit' => $this->coach_submit,
            'day_submit' => $this->day_submitted,
            'customer_name' => $this->customer->name,
            'customer_specialty' => $this->customer->specialty,
            'customer_parameter' => $param,
            'brick' =>  $this->customer->brick,
            'area' =>  $this->customer->area,
            'district' =>  $this->customer->district,
            'territory' =>  $this->customer->territory,
        ];
    }
}
