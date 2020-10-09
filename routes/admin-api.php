<?php

use Illuminate\Support\Facades\Route;

/**
 * admin api routes
 *
 *  start with prefix Admin/version/path
 */
Route::prefix('v1')->group(function() {
  Route::get('/customers', function () {
    return response(\App\Customer::all());
  });
});
