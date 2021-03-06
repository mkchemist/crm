<?php

use Illuminate\Support\Facades\Route;

/**
 * admin api routes
 *
 *  start with prefix Admin/version/path
 */
Route::prefix('v1')->group(function () {
    Route::post('users/relations/{id}', "UserController@userRelations");
    Route::post("users/reactivate/{id}", "UserController@reActivateUser");
    Route::post("users/deactive/{id}", "UserController@deaActiveUser");
    Route::apiResource('users', 'UserController');
    Route::apiResource('customers', 'CustomerController');
    Route::get('/locations', 'AreaController@area');
    Route::get('/specialties', 'AreaController@specialty');
    Route::group([
        'prefix' => 'validation',
        'namespace' => 'Approvals',
    ], function () {
        Route::get('/new-customers', 'NewCustomerValidationController@getNewCustomers');
        Route::post('/new-customers', 'NewCustomerValidationController@approveNewCustomers');
        Route::post('/new-customers/delete', 'NewCustomerValidationController@deleteRejected');
        Route::get('/customers', 'CustomerValidationController@index');
        Route::put('/customers', 'CustomerValidationController@update');
        Route::delete("/customers/clear-rejected", "CustomerValidationController@clearRejectedRequests");
        Route::get('/parameters', 'ParameterValidationController@index');
        Route::put('/parameters', 'ParameterValidationController@update');
        Route::get('/frequency', 'FrequencyValidationController@index');
        Route::put('/frequency', 'FrequencyValidationController@update');
        Route::get('/workplaces', 'WorkplaceValidationController@index');
        Route::put('/workplaces', 'WorkplaceValidationController@update');
        Route::get('/pharmacies', 'PharmacyValidationController@index');
        Route::put('/pharmacies', 'PharmacyValidationController@update');
    });
    Route::group([
      'prefix'  =>  'setting',
      'namespace' => 'Setting'
    ], function() {
      Route::get('/cycles', 'CycleController@index');
      Route::post('/cycles', 'CycleController@store');
      Route::get('/active-cycle', 'ActiveCycleController@index');
      Route::post('/active-cycle', 'ActiveCycleController@store');
      Route::get('/report-interval', 'ReportIntervalController@index');
      Route::post('/report-interval', 'ReportIntervalController@store');
      Route::get('/lines/{id}', 'LineSettingController@show');
      Route::delete('/lines/{id}', 'LineSettingController@destroy');
      Route::get('/lines', 'LineSettingController@index');
      Route::post('/lines', 'LineSettingController@store');
      Route::get('/non-field-activity', 'NonFieldActivityController@index');
      Route::post('/non-field-activity', 'NonFieldActivityController@store');
      Route::get('/field-activity', 'FieldActivityController@index');
      Route::post('/field-activity', 'FieldActivityController@store');
      Route::get('/refresh-hash-key', 'ForceRefreshHashKeySettingController@index');
      Route::post('/refresh-hash-key', 'ForceRefreshHashKeySettingController@store');
      Route::get('/request-types', 'RequestSettingController@index');
      Route::post('/request-types', 'RequestSettingController@store');
      Route::get('/products/price', 'ProductController@index');
      Route::post('/products/price', 'ProductController@update');
    });
    Route::apiResource('broadcasting', 'MessageBroadcastingController');
    // Admin management routes
    Route::group(['prefix' => 'management'], function () {
        Route::get('duplicate-customers', 'CustomerManagementController@duplicateCustomers');
        Route::get('query-duplicate-customer', 'CustomerManagementController@queryDuplicateCustomer');
    });

    // Planner Routes
    Route::group(['prefix' => 'planner'], function() {
      Route::get('/', 'PlannerController@index');
      Route::post('/approval', 'PlannerController@approvalAction');
    });

    // reports routes
    Route::group(['prefix' => 'reports', 'namespace' => 'Reports'], function () {
      Route::get('pm', 'VisitsReportController@index');
      Route::get('am', 'WorkplaceReportController@index');
      Route::get('pharmacy', 'PharmacyReportController@index');
      Route::get('missed', 'MissedVisitsReportController@index');
    });
});
