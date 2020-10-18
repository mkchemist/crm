<?php

namespace App\Http\Resources\DM;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
    $user = Auth::user();
    $users = DB::table("users")->select("id")->where([
      "district"  =>  $user->district,
      "line"      =>  $user->line,
    ])
      ->where('id', '!=', $user->id)
      ->get();
    $usersId = [];
    $usersId = array_map(function ($user) {
      return $user->id;
    }, $users->toArray());
    $freq = $this->frequency()->whereIn('user_id', $usersId)->first();
    $param = $this->params()->whereIn('user_id', $usersId)->first();
    $reports =$this->report()->whereIn('user_id', $usersId)->get();
    return [
      "name"  =>  $this->name,
      "specialty" => $this->specialty,
      "brick"     =>  $this->brick,
      "address"   =>  $this->address,
      "current_freq"   =>  $freq ? $freq->current : 0,
      "next_freq"     => $freq ? $freq->next : 0,
      "area"    =>  $this->area,
      "param"   =>  $param ? $param->param : 'NN',
      "reports" =>  $reports
    ];
  }
}
