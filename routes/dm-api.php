<?php

use Illuminate\Support\Facades\Route;

/**
 * district manager api routes
 *
 *  start with prefix Admin/version/path
 */
Route::prefix('v1')->group(function() {
  // Customers Routes
  Route::apiResource("customers", "CustomerController");
  // Workplace Routes
  Route::apiResource('workplaces','WorkplaceController');
  // Pharmacy Routes
  Route::apiResource('pharmacies', 'PharmacyController');
  // Approval Routes
  Route::group(['prefix' => 'approval'], function() {
    Route::get('/frequency', 'ApprovalController@RequestCustomerFrequency');
    Route::get('/parameters', 'ApprovalController@CustomerParameterRequests');
    Route::post('/frequency', 'ApprovalController@approveCustomersFrequency');
    Route::post('/parameters', 'ApprovalController@approveCustomersParameters');
    Route::get('/new-customers', 'ApprovalController@newCustomerApprovals');
    Route::post('/new-customers', 'ApprovalController@approveNewCustomers');
  });
});
