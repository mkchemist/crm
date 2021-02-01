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
  /* Reps Routes */
  Route::get('/reps', 'RepController@getAllReps');
  /** Pharmacy Routes */
  Route::apiResource('/pharmacies', 'PharmacyController');
  /* Planner Routes */
  Route::get('/planner', 'PlannerController@index');
  Route::post('/planner/submit', 'PlannerController@submit');
  /* Reports routes */
  Route::apiResource('reports', 'PharmacyReportController');
});

