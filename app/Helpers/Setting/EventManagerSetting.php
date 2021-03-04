<?php

namespace App\Helpers\Setting;

use App\Setting;

class EventManagerSetting extends Manager
{


  protected $name;

  protected $group = "events";

  public function saveEvent(string $name, string $data)
  {
    $this->name = $name;
    $this->data = $data;
    $this->update();
  }

  /**
   * update setting
   *
   *
   */
  public function update()
  {
    Setting::updateOrCreate([
      'group' => $this->group,
      'name'  =>  $this->name
    ],[
      'content'  => $this->data
    ]);
  }

  /**
   * fetch event
   *
   *
   */
  public function fetch()
  {
    $events = Setting::where('group', $this->group)->get();
    if(count($events)) {
      $this->data = $events;
    } else {
      $this->data = [];
    }
  }

  /**
   * get single event
   *
   * @param string $name [event name]
   * @return Setting|null
   */
  public function event(string $name)
  {
    $event = Setting::where([
      'name'  =>  $name,
      'group' =>  $this->group
    ])->first();

    return $event;
  }
}
