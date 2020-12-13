<?php

namespace App\Helpers\Setting;

use App\Setting;

class CyclesSetting extends Manager {

  /**
   * setting name
   *
   */
  protected $name = "cycles";

  /**
   * setting group
   *
   */
  protected $group = "cycle_control";

  /**
   * cycle setting constructor
   *
   */
  public function __construct()
  {
    $this->fetch();
  }

  /**
   * update cycle settings
   *
   *
   */
  protected function update()
  {
    Setting::updateOrCreate([
      'name'  =>  $this->name,
      'group' =>  $this->group
    ],[
      'content' =>  $this->data
    ]);
  }

  /**
   * get cycle settings
   *
   */
  protected function fetch()
  {
    $setting = Setting::where([
      'name'  =>  $this->name,
      'group' =>  $this->group
    ])->first();
    if($setting) {
      $this->data = json_decode($setting->content);
    } else {
      $this->data = [$this->name, $this->group];
    }
  }

  /**
   * get all registered cycles names
   *
   * @return array
   */
  public function getCyclesNames()
  {
    $cycles = [];
    foreach($this->data as $cycle) {
      $cycles[] = $cycle->name;
    }
    return $cycles;
  }
}
