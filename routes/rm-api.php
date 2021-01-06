<?php

use Illuminate\Support\Facades\Route;

/**
 * Regional Manager account routes
 *
 *
 * @version 1
 */

Route::group([
  'prefix'  =>  'v1'
], function () {

  Route::get('user-relations', 'RepsController@index');

  /**
   * reports routes
   */
  Route::group([
    'prefix'=> 'reports'
  ], function () {
    Route::get('pm', 'CustomerReportController@index');
    Route::get('am', 'WorkplaceReportController@index');
    Route::get('pharmacy', 'PharmacyReportController@index');
  });
});

