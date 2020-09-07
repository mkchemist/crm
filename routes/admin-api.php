<?php

use Illuminate\Support\Facades\Route;


Route::prefix('v1')->group(function() {
  Route::get('/customers', function () {
    return response(\App\Customer::all());
  });
});
