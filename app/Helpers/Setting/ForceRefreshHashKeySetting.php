<?php

namespace App\Helpers\Setting;

use App\Setting;

class ForceRefreshHashKeySetting extends Manager {

  protected $name = 'hash_key';

  protected $group = 'app_control';

  protected function update()
  {
    Setting::updateOrCreate([
      'name'  =>  $this->name,
      'group' =>  $this->group
    ],[
      'content' => $this->data
    ]);

  }

  protected function fetch()
  {
    $hash = Setting::where([
      'name'  =>  $this->name,
      'group' =>  $this->group
    ])->first();

    if($hash) {
      $this->data = $hash->content;
    } else {
      $this->data = '';
    }
  }
}
