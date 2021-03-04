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

Route::group(["middleware" => ["auth:api"]], function () {
    // clear all customer favorite lists
    Route::post('/customers-favorite-list/clear', 'Api\V1\CustomerFavoriteListController@clearAllList');
    // Customers favorite lists routes
    Route::apiResource('/customers-favorite-list', 'Api\V1\CustomerFavoriteListController');
});

Route::group([
    'middleware' => ['auth:api'],
], function () {
    /** Broadcasting messages */
    Route::get('broadcasting', 'Api\V1\MessageBroadcastingReaderController@all');
    /** non field activity types */
    Route::get('/non-field-activity-types', 'Api\V1\Rep\RepSettingController@nonFieldActivityTypes');
    /** field activity types */
    Route::get('/field-activity-types', 'Api\V1\Rep\RepSettingController@fieldActivityTypes');
    /**  activity planner */
    Route::apiResource('/activity-planner', 'Api\V1\ActivityPlansController');
    /** activity reports */
    Route::apiResource('/activity-reports', 'Api\V1\ActivityReportController');
    /** customer requests route */
    Route::apiResource('/customer-requests', 'Api\V1\CustomerRequestController');
    /** Requests type */
    Route::get('/request-types', 'Api\V1\RequestsTypeController@index');
    /* application setting */
    Route::get('app-setting', 'Api\V1\ApplicationSetting@index');
    /* application user line */
    Route::get('line-products', 'Api\V1\ApplicationSetting@lineProducts');
    /* locations routes */
    Route::get('user-locations', 'Api\V1\ApplicationSetting@locations');
    /** coach Follow up */
    Route::get('v1/coach-follow-up', 'Api\V1\CoachFollowUpController@index');
    /* user relations */
    Route::get('v1/user/relations', 'Api\V1\ApplicationSetting@relations');
    /* coach routes */
    Route::post('v1/coach-reports/day/submit','Api\V1\CoachReportModuleController@submitDay');
    Route::post('v1/coach-reports/day/delete','Api\V1\CoachReportModuleController@clearDay');
    Route::get('v1/coach-reports/raw/reports', 'Api\V1\CoachReportModuleController@rawReports');
    Route::apiResource('v1/coach-reports', 'Api\V1\CoachReportModuleController');
    Route::get('v1/coach-reports/view/day','Api\V1\CoachReportModuleController@coachDay');
    Route::get('v1/coach-reports/view/table','Api\V1\CoachReportModuleController@tableView');
    /* user customers */
    Route::get('v1/user-customers/customers/{brick}','Api\V1\UserCustomersController@customersInBrick');
    Route::post('v1/user-customers/search/customers','Api\V1\UserCustomersController@searchCustomers');
    Route::get('v1/user-customers/pharmacies/{brick}','Api\V1\UserCustomersController@pharmaciesInBrick');
    Route::get('v1/user-customers/bricks/{id?}','Api\V1\UserCustomersController@getUserCustomersLocations');
    /* Single Visits */
    Route::post('v1/single-visit/customer', 'Api\V1\SingleVisitsController@pmSingleVisit');
    Route::post('v1/single-visit/pharmacy', 'Api\V1\SingleVisitsController@pharmacySingleVisit');
    Route::put('v1/single-visit/pharmacy/{id}', 'Api\V1\SingleVisitsController@editSinglePharmacyVisit');
    /* Requests Routes */
    Route::get('v1/requests/search/{search}', 'Api\V1\RequestController@analysis');
    Route::post('v1/requests/cancel/{serial}','Api\V1\RequestController@cancelRequest');
    Route::post('v1/requests/submit/{serial}','Api\V1\RequestController@submitRequest');
    Route::post('v1/requests/approve','Api\V1\RequestController@approveRequest');
    Route::post('v1/requests/sharing/{serial}','Api\V1\RequestController@sharing');
    Route::get("v1/requests/shared/list", "Api\V1\RequestController@readShared");
    Route::post('v1/requests/set-cost','Api\V1\RequestController@setCost');
    Route::apiResource('v1/requests', 'Api\V1\RequestController');
    Route::apiResource('v1/request-events','Api\V1\RequestEventManagerController');
    Route::get('v1/price-list', 'Api\V1\ProductFactoryPriceController@index')->middleware(['CanManageRequests']);

});

/** Rep routes */
Route::group([
    'middleware' => 'auth:api',
    'prefix' => 'rep/v1',
    'namespace' => 'Api\V1\Rep',
], function () {
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
    Route::apiResource('/customers', 'CustomerController');
    // customer frequency
    Route::post('/customer-frequency', 'CustomerFrequencyController@update');
    Route::post('/customer-frequency/submit', 'CustomerFrequencyController@submitFrequency');
    Route::get('/workplace-customers/{workplace}', 'CustomerController@getWorkplaceRelatedCustomers');
    Route::post('/workplace-customers/add/{workplace}', 'CustomerController@bindWorkplaceCustomer');
    Route::post('/workplace-customers/unlink', 'CustomerController@unlinkWorkplaceCustomer');
    // workplaces routes
    Route::apiResource('/workplaces', 'WorkplaceController');
    // pharmacies routes
    Route::apiResource('/pharmacies', 'PharmacyController');
    // Workplace Department routes
    Route::group(['prefix' => '/workplace-department'], function () {
        Route::get('/all/{id}', 'WorkplaceDepartmentController@getWorkplaceDepartment');
        Route::post('/', 'WorkplaceDepartmentController@store');
        Route::put('/{id}', 'WorkplaceDepartmentController@update');
        Route::delete('/{id}', 'WorkplaceDepartmentController@delete');
    });
    // planner routes
    Route::post('planner/submit', 'PlannerController@submitPlan');
    Route::delete('planner/delete', 'PlannerController@groupDelete');
    Route::put('planner/duplicate', 'PlannerController@DuplicateDate');
    Route::delete('planner/clear-day', 'PlannerController@clearDate');
    Route::apiResource('planner', 'PlannerController');
    // workplace planner routes
    Route::post('workplace-planner/submit', 'WorkplacePlannerController@submit');
    Route::delete('workplace-planner/delete', 'WorkplacePlannerController@groupDelete');
    Route::apiResource('/workplace-planner', 'WorkplacePlannerController');
    // Reports routes
    Route::group(['prefix' => 'reports'], function () {
        // Report pm routes
        Route::apiResource('pm', 'CustomerReportController');
        // Report am routes
        Route::apiResource('am', 'WorkplaceReportController');
        // Report pharmacy routes
        Route::apiResource('pharmacy', 'PharmacyReportController');
        // Coaching reports routes
        Route::get('/coaching', 'CoachReportsController@index');
        Route::get('/coaching/{id}', 'CoachReportsController@show');
        Route::get('/missed-customers', 'MissedCustomerController@index');
    });

    /** other reps collections */
    Route::group(['prefix' => 'other-reps'], function () {
        Route::get('customer-plans/{id}', 'OtherRepsController@customerPlans');
        Route::get('customer-reports/{id}', 'OtherRepsController@customerReports');
        Route::get('workplace-plans/{id}', 'OtherRepsController@workplacePlans');
        Route::get('workplace-reports/{id}', 'OtherRepsController@workplaceReports');
        Route::get('pharmacy-reports/{id}', 'OtherRepsController@pharmacyReports');
    });

});
