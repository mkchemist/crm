<?php

namespace App\Helpers\Setting;

use App\Setting;

class ReportIntervalSetting extends Manager
{

  protected $name = "report_interval";

  protected $group = "report_control";


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
    $reportInterval = Setting::where([
      'name'  =>  $this->name,
      'group' =>  $this->group
    ])->first();
    if($reportInterval) {
      $this->data = $reportInterval->content;
    } else {
      $this->data = 30;
    }
  }
}
