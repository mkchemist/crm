<?php

use Illuminate\Support\Facades\Route;

/**
 * district manager api routes
 *
 *  start with prefix Admin/version/path
 */
Route::prefix('v1')->group(function() {
  // District Manager Reps
  Route::get('/reps', "RepController@getAllRep");
  // Customers Routes
  Route::apiResource("customers", "CustomerController");
  // Workplace Routes
  Route::apiResource('workplaces','WorkplaceController');
  // Pharmacy Routes
  Route::apiResource('pharmacies', 'PharmacyController');
  // Planner Routes
  Route::post('/planner/submit', 'PlannerController@repPlansAction');
  Route::apiResource("planner", "PlannerController");
  // Rep workplace planner
  Route::get('workplace-planner', 'RepWorkplacePlannerController@index');
  Route::post('workplace-planner/submit', 'RepWorkplacePlannerController@submit');
  // Approval Routes
  Route::group(['prefix' => 'approval'], function() {
    Route::get('/frequency', 'ApprovalController@RequestCustomerFrequency');
    Route::get('/parameters', 'ApprovalController@CustomerParameterRequests');
    Route::post('/frequency', 'ApprovalController@approveCustomersFrequency');
    Route::post('/parameters', 'ApprovalController@approveCustomersParameters');
    Route::get('/new-customers', 'ApprovalController@newCustomerApprovals');
    Route::post('/new-customers', 'ApprovalController@approveNewCustomers');
    Route::get('/customers-details', 'ApprovalController@customerDetailsApproval');
    Route::post('/customers-details', 'ApprovalController@approveCustomerDetails');
  });
  // Reports Routes
  Route::group(['prefix' => 'reports'], function() {
    // PM reports
    Route::apiResource('/pm', 'CustomerReportController');
    // Coach Reports
    Route::post('coach/submit', 'CoachingReportController@submitReport');
    Route::apiResource('coach', 'CoachingReportController');
    // Workplace reports
    Route::group(['prefix' => 'workplaces'], function() {
      Route::delete('/delete/pharmacy/{id}', 'WorkplaceReportController@deletePharmacy');
      Route::get('/show/pharmacy/{id}', 'WorkplaceReportController@showPharmacyVisit');
      Route::get('/hospitals', 'WorkplaceReportController@hospitalsReports');
      Route::get('/pharmacies', 'WorkplaceReportController@pharmaciesReports');
    });

    Route::get('/missed-customers', 'MissedCustomerController@index');
  });
});
