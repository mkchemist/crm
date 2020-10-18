<?php

use Illuminate\Support\Facades\Route;

/**
 * district manager api routes
 *
 *  start with prefix Admin/version/path
 */
Route::prefix('v1')->group(function() {
  Route::apiResource("customers", "CustomerController");
});
