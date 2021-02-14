<?php

namespace App\Http\Resources\Shared;

use Illuminate\Http\Resources\Json\JsonResource;

class CustomerRequestResource extends JsonResource
{

    private function getCustomerParameter($customer) {
      if(count($customer->params) > 0) {
        return $customer->params[0]->current;
      }
      return "NN";
    }
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {

        return [
          'user' => [
            'name'  =>  $this->user->name,
            'id'    =>  $this->user_id,
            'role'  =>  $this->user->role,
            'line'  =>  json_decode($this->user->line)
          ],
          'customer'  =>  [
            'name'  =>  $this->customer->name,
            'specialty' =>  $this->customer->specialty,
            'brick'    =>  $this->customer->brick,
            'area'    =>  $this->customer->area,
            'district' => $this->customer->district,
            'territory' =>  $this->customer->territory,
            'parameter' =>    $this->getCustomerParameter($this->customer)
          ],
          "type"        =>  $this->type,
          "product"     =>  $this->product,
          "apply_date"  =>  $this->apply_date,
          'query_date'  =>  $this->query_date,
          'cost'        =>  $this->cost,
          'quantity'    =>  $this->quantity,
          'rx_per_month'  =>  $this->rx,
          'rx_months'   =>  $this->rx_months,
          'total_rx'    =>  $this->rx * $this->rx_months,
          'serial'      =>  $this->serial,
          'pharmacy1'   =>  $this->pharmacy_1->name,
          'pharmacy2'   =>  $this->pharmacy_2?$this->pharmacy2->name: null,
          'pharmacy3'   =>  $this->pharmacy_3?$this->pharmacy3->name: null,
          'pharmacy4'   =>  $this->pharmacy_4?$this->pharmacy4->name: null,
          'comment'     =>  json_decode($this->comment),
          'others'      =>  $this->others,
          'area_manager_approval' =>  $this->am_approval ? true : false,
          'business_unit_approval' =>  $this->rm_approval ? true : false,
          'state'       =>  $this->state,
          'reject_due'  =>  $this->reject_due
        ];
    }
}
