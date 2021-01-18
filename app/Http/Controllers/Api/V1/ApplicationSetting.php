<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\Setting\ActiveCycleSetting;
use App\Helpers\Setting\CyclesSetting;
use App\Helpers\Setting\LineSetting;
use App\Helpers\Setting\ReportIntervalSetting;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class ApplicationSetting extends Controller
{
    public function index()
    {
      $activeCycle = new ActiveCycleSetting;
      $cycles = new CyclesSetting;
      $reportInterval = new ReportIntervalSetting;
      $lines = new LineSetting;
      $userLine = $this->getUserLine($lines->all());
      return response([
        'code'  =>  200,
        'data'  =>  [
          'cycles'  =>  $cycles->all(),
          'activeCycle' =>  $activeCycle->all(),
          'reportInterval'  =>  $reportInterval->all(),
          'canEditReportDate' =>  $reportInterval->canEditDate,
          'line'          =>  $userLine
        ]
      ]);
    }

    private function getUserLine($lines)
    {
      $user = Auth::user();
      $userLine = json_decode($user->line);
      $line = [];
      foreach($lines as $key => $val) {
        if(in_array($val->name, $userLine)) {
          $line[] = $val;
        }
      }
      return $line;
    }
}
