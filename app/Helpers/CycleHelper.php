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
    if(!$cycle) {
      $cycle = new ActiveCycleSetting;
      $cycle = $cycle->all();
    }
    return $model->whereBetween($field, [$cycle->start, $cycle->end]);
  }
}
