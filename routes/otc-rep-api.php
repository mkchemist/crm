<?php

use Illuminate\Support\Facades\Route;

/**
 * Regional Manager account routes
 *
 *
 * @version 1
 */

Route::get('v1/reports/pharmacy/analysis/coverage','PharmacyReportController@coverageReport');
Route::get('v1/reports/pharmacy/analysis/order','PharmacyReportController@orderAnalysis');
Route::group([
  'prefix'  =>  'v1'
], function () {
  /* Pharmacies Routes */
  Route::apiResource('pharmacies', 'PharmacyController');
  /* Planner Routes */
  Route::post('planner/group-delete', 'PlannerController@deleteGroup');
  Route::post('planner/duplicate', 'PlannerController@duplicate');
  Route::post('planner/submit', 'PlannerController@submit');
  Route::apiResource('planner', 'PlannerController');
  /* Reports Routes */
  Route::group(['prefix' => 'reports'], function() {
    Route::apiResource('pharmacy', 'PharmacyReportController');
  });
});

