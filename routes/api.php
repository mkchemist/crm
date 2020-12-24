<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

// user Api login
Route::post('/login', "Api\UserController@login");


Route::group(["middleware" => ["auth:api"]] ,function() {
  // clear all customer favorite lists
  Route::post('/customers-favorite-list/clear','Api\V1\CustomerFavoriteListController@clearAllList');
  // Customers favorite lists routes
  Route::apiResource('/customers-favorite-list', 'Api\V1\CustomerFavoriteListController');
});

/** Broadcasting messages */
Route::get('broadcasting', 'MessageBroadcastingReaderController@all')->middleware(['auth:api']);
Route::get('/non-field-activity-types', 'Api\V1\Rep\RepSettingController@nonFieldActivityTypes');
Route::get('/field-activity-types', 'Api\V1\Rep\RepSettingController@fieldActivityTypes');
Route::apiResource('/non-field-activity-planner', 'NonFieldActivityPlansController')->middleware(['auth:api']);

/** Rep routes */
Route::group([
  'middleware' => 'auth:api',
  'prefix' => 'rep/v1',
  'namespace' => 'Api\V1\Rep'
], function() {
  // locations route
  Route::get('/locations', 'RepSettingController@locations');
  // cycles route
  Route::get('/cycles', 'RepSettingController@Cycles');
  /** Active cycle */
  Route::get('/active-cycle', 'RepSettingController@activeCycle');
  /** Line setting */
  Route::get('/rep-line', 'RepSettingController@line');
  // coaches routes
  Route::get('/coach', 'CoachController@index');
  // customers routes
  Route::apiResource('/customers','CustomerController');
  // customer frequency
  Route::post('/customer-frequency', 'CustomerFrequencyController@update');
  Route::post('/customer-frequency/submit', 'CustomerFrequencyController@submitFrequency');
  // workplaces routes
  Route::apiResource('/workplaces', 'WorkplaceController');
  // pharmacies routes
  Route::apiResource('/pharmacies', 'PharmacyController');
  // Workplace Department routes
  Route::group(['prefix' => '/workplace-department'], function() {
    Route::get('/all/{id}', 'WorkplaceDepartmentController@getWorkplaceDepartment');
    Route::post('/', 'WorkplaceDepartmentController@store');
    Route::put('/{id}','WorkplaceDepartmentController@update');
    Route::delete('/{id}', 'WorkplaceDepartmentController@delete');
  });
  // planner routes
  Route::post('planner/submit', 'PlannerController@submitPlan');
  Route::delete('planner/delete','PlannerController@groupDelete');
  Route::put('planner/duplicate', 'PlannerController@DuplicateDate');
  Route::delete('planner/clear-day', 'PlannerController@clearDate');
  Route::apiResource('planner', 'PlannerController');
  // workplace planner routes
  Route::post('workplace-planner/submit', 'WorkplacePlannerController@submit');
  Route::delete('workplace-planner/delete','WorkplacePlannerController@groupDelete');
  Route::apiResource('/workplace-planner', 'WorkplacePlannerController');
  // Reports routes
  Route::group(['prefix' => 'reports'], function () {
    // Report pm routes
    Route::apiResource('pm', 'CustomerReportController');
    // Report am routes
    Route::apiResource('am','WorkplaceReportController');
    // Report pharmacy routes
    Route::apiResource('pharmacy', 'PharmacyReportController');
    // Coaching reports routes
    Route::get('/coaching', 'CoachReportsController@index');
    Route::get('/coaching/{id}', 'CoachReportsController@show');
  });

  /** other reps collections */
  Route::group(['prefix' => 'other-reps'], function() {
    Route::get('customer-plans/{id}', 'OtherRepsController@customerPlans');
    Route::get('customer-reports/{id}', 'OtherRepsController@customerReports');
    Route::get('workplace-plans/{id}', 'OtherRepsController@workplacePlans');
    Route::get('workplace-reports/{id}', 'OtherRepsController@workplaceReports');
    Route::get('pharmacy-reports/{id}', 'OtherRepsController@pharmacyReports');
  });

});
