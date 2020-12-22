<?php

namespace App\Helpers\Setting;

use App\Setting;

class LineSetting extends Manager {

  protected $name = "line_setting";

  protected $group = "user_control";

  public function __construct()
  {
    $this->fetch();
  }


  public function update()
  {
    Setting::updateOrCreate([
      'name'  =>  $this->name,
      'group' =>  $this->group
    ],[
      'content' =>  json_encode($this->data)
    ]);
  }


  public function fetch()
  {
    $lines = Setting::where([
      'name'  =>  $this->name,
      'group' =>  $this->group
    ])->first();
    if($lines->content) {
      $this->data = json_decode($lines->content);
    } else {
      $this->data = [];
    }
  }

}
