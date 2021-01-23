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
  /* Pharmacies Routes */
  Route::apiResource('pharmacies', 'PharmacyController');
  /* Planner Routes */
  Route::post('planner/group-delete', 'PlannerController@deleteGroup');
  Route::post('planner/duplicate', 'PlannerController@duplicate');
  Route::apiResource('planner', 'PlannerController');
  /* Reports Routes */
  Route::group(['prefix' => 'reports'], function() {
    Route::apiResource('pharmacy', 'PharmacyReportController');
  });
});

