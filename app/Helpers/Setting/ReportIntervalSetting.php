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
      'content' =>  json_encode($this->data)
    ]);

  }


  protected function fetch()
  {
    $reportInterval = Setting::where([
      'name'  =>  $this->name,
      'group' =>  $this->group
    ])->first();
    if($reportInterval) {
      $data = json_decode($reportInterval->content);
      if(is_object($data)) {
        $this->data = $data->interval;
        $this->canEditDate = $data->can_edit_date;
      } else {
        $this->data = $reportInterval->content;
        $this->canEditDate = true;
      }
    } else {
      $this->data = 30;
      $this->canEditDate = true;
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

  public function canEditReportDate() {
    return $this->canEditDate !==  "false";
  }
}
