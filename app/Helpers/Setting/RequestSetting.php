<?php

namespace App\Helpers\Setting;

use App\Setting;

class RequestSetting extends Manager {


  protected $name = 'request_types';

  protected $group = 'request_control';

  public function __construct()
  {
    $this->fetch();
  }

  protected function update()
  {
    Setting::updateOrCreate([
      'name'  =>  $this->name,
      'group' =>  $this->group
    ],[
      'content' =>  $this->data
    ]);
  }


  protected function fetch()
  {
    $requests = Setting::where([
      'name' => $this->name,
      'group' =>  $this->group
    ])->first();

    if($requests) {
      $this->data = json_decode($requests->content);
    } else {
      $this->data = [];
    }
  }

}
