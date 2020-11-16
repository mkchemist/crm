<?php

use Illuminate\Support\Facades\Route;

/**
 * admin api routes
 *
 *  start with prefix Admin/version/path
 */
Route::prefix('v1')->group(function() {
    Route::apiResource('users', 'UserController');
    Route::apiResource('customers', 'CustomerController');
});
