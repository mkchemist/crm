<?php

namespace App\Helpers\Setting;

use App\Setting;
use Illuminate\Support\Carbon;

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

  public function isValidDateInterval($date)
  {
    $interval = $this->data;
    $today = new Carbon(date('20y-m-d'));
    $date = new Carbon($date);
    if($today->diffInDays($date) <= $interval) {
      return true;
    }
    return false;
  }

  public function isBeforeToday($date)
  {
    if($date <= date('20y-m-d')) {
      return true;
    }

    return false;
  }
}
