<?php

namespace App\Helpers;

use App\Helpers\Setting\ActiveCycleSetting;

class CycleHelper {

  /**
   * get data between cycle period
   *
   * @param  $model [query model]
   * @param string $field [date field]
   * @param array|null $cycle [date boundaries]
   * @return
   */
  public static function getCycleData( $model, string $field, array $cycle = null)
  {
    $active = new ActiveCycleSetting;
    $active = $active->all();
    if(!$cycle) {
      $cycle = [$active->start, $active->end];
    }
    return $model->whereBetween($field, $cycle);
  }
}
