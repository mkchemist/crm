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
  /* Customers Routes */
  Route::apiResource('customers', 'CustomerController');

  /** Planner Routes */
  Route::group(['prefix' => 'planner'], function() {
    Route::get('coach', 'PlannerController@coachPlans');
    Route::get('am', 'PlannerController@repAmPlans');
    Route::get('pm', 'PlannerController@repPmPlans');
  });
  /**
   * reports routes
   */
  Route::group([
    'prefix'=> 'reports'
  ], function () {
    Route::get('pm', 'CustomerReportController@index');
    Route::get('am', 'WorkplaceReportController@index');
    Route::get('pharmacy', 'PharmacyReportController@index');
    Route::get('missed-customers', 'MissedCustomerController@index');
    Route::get('coach-reports', 'CoachReportController@index');
    Route::get('coach-report/single/{id}', 'CoachReportController@show');
    Route::get('coach-follow-up', 'CoachReportController@coachingFollowUp');
    // Analysis routes
    Route::group(['prefix' => 'analysis'], function () {
      Route::get('pm', 'AnalysisController@pmAnalysis');
      Route::get('am', 'AnalysisController@amAnalysis');
      Route::get('plan', 'AnalysisController@planAnalysis');
    });
  });
});

