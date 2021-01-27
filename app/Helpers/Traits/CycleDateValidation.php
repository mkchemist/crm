<?php

namespace App\Helpers\Traits;

use App\Helpers\Setting\ActiveCycleSetting;
use App\Helpers\ResponseHelper;

trait CycleDateValidation {

  public function isNotValidDate($date)
  {
    $activeCycle = new ActiveCycleSetting;
      $activeCycle = $activeCycle->all();
      if(!$activeCycle) {
        return null;
      }
      if($date < $activeCycle->start || $date > $activeCycle->end) {
        return ResponseHelper::outActiveCycleDateRange($activeCycle->start, $activeCycle->end);
      }
      return null;
  }

  public function isPassedDay($date)
  {
      if($date < date('20y-m-d')) {
        return ResponseHelper::InvalidDayRange();
      }
      return null;
  }

  /**
   *
   *
   *
   */
  public static function isOldDate($date)
  {
      if($date < date('20y-m-d')) {
        return true;
      }
      return false;
  }
}
