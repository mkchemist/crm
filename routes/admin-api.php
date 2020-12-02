<?php

use Illuminate\Support\Facades\Route;

/**
 * admin api routes
 *
 *  start with prefix Admin/version/path
 */
Route::prefix('v1')->group(function() {
    Route::post("users/reactivate/{id}", "UserController@reActivateUser");
    Route::post("users/deactive/{id}", "UserController@deaActiveUser");
    Route::apiResource('users', 'UserController');
    Route::apiResource('customers', 'CustomerController');
    Route::group([
      'prefix' => 'validation',
      'namespace' => 'Approvals'
    ], function () {
      Route::get('/new-customers', 'NewCustomerValidation@getNewCustomers');
      Route::post('/new-customers', 'NewCustomerValidation@approveNewCustomers');
    });
});
