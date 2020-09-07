<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// login page
Route::get('/', function () {
    return view('pages.login');
})->name('login');
// login action
Route::post('/login', 'UserController@login');

// protected routes
Route::group(['middleware' => ['auth']], function () {
    // logout route
    Route::get('/logout', function () {
        Auth::logout();
        return redirect('/');
    });
    // Rep application
    Route::get('/rep/{name?}', function() {
        return view('pages.rep.index');
    })->where('name', '.*');

    // District Manager application
    Route::get('/dm/{name?}', function() {
        return view('pages.dm.index');
    });

    // territory Manager application
    Route::get('/tm/{name?}', function() {
        return view('pages.tm.index');
    });

    // regional Manager application
    Route::get('/rm/{name?}', function() {
        return view('pages.rm.index');
    });

    // general Manager application
    Route::get('/gm/{name?}', function() {
        return view('pages.gm.index');
    });

    // admin application
    Route::get('/admin/{name?}', function() {
        return view('pages.admin.index');
    });
});
