<?php

namespace App\Helpers\Setting;

use App\Setting;
use Illuminate\Support\Facades\DB;

class ActiveCycleSetting extends Manager
{

  /**
   * setting name
   *
   */
  protected $name = "active_cycle";

  /**
   * setting group
   *
   */
  protected $group = "cycle_control";

  /**
   * active cycle setting constructor
   *
   */
  public function __construct()
  {
    $this->fetch();
  }

  /**
   * update active cycle
   *
   */
  protected function update()
  {
    $update = Setting::updateOrCreate([
      'name'  =>  $this->name,
      'group' =>  $this->group
    ],[
      'content' =>  $this->data
    ]);
  }

  /**
   * fetch active cycle
   *
   */
  protected function fetch()
  {
    $activeCycle  = DB::table('settings')->where([
      'name'  =>  $this->name,
      'group' =>  $this->group
    ])->first();
    if($activeCycle) {
      $this->data = json_decode($activeCycle->content);
    } else {
      $this->data =  null;
    }
  }


}
