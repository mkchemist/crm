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

/** Rep routes */
Route::group([
  'middleware' => 'auth:api',
  'prefix' => 'rep/v1',
  'namespace' => 'Api\V1\Rep'
], function() {
  // customers routes
  Route::apiResource('/customers','CustomerController');
  // Customers favorite lists routes
  Route::apiResource('/customers-favorite-list', 'CustomerFavoriteListController');
  // workplaces routes
  Route::apiResource('/workplaces', 'WorkplaceController');
  // pharmacies routes
  Route::apiResource('/pharmacies', 'PharmacyController');
  // Workplace Department routes
  Route::group(['prefix' => '/workplace-department'], function() {
    Route::get('/all/{id}', 'WorkplaceDepartmentController@getWorkplaceDepartment');
    Route::post('/', 'WorkplaceDepartmentController@store');
    Route::put('/{id}','WorkplaceDepartmentController@update');
  });
  // planner routes
  Route::delete('planner/delete','PlannerController@groupDelete');
  Route::apiResource('planner', 'PlannerController');
});
