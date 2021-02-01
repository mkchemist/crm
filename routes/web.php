<?php

use App\Helpers\Setting\ForceRefreshHashKeySetting;
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

Route::get('/login', function () {
  return view('pages.login');
});
// login action
Route::post('/login', 'UserController@login');

// protected routes
Route::group(['middleware' => ['auth']], function () {
    // logout route
    Route::get('/logout', function () {
        Auth::logout();
        return redirect('/');
    });
    // user change password
    Route::get('change-password', 'UserController@changePassword');
    Route::post('change-password', 'UserController@updatePassword');
    // Rep application
    Route::get('/rep/{name?}', function() {
        $hash_key = new ForceRefreshHashKeySetting;
        return view('pages.rep.index', ['hash_key' => $hash_key->all()]);
    })->where('name', '.*');

    // District Manager application
    Route::get('/dm/{name?}', function() {
      $hash_key = new ForceRefreshHashKeySetting;
        return view('pages.dm.index', ['hash_key' => $hash_key->all()]);
    })->where('name', '.*')->middleware('dmOnly');

    // territory Manager application
    Route::get('/tm/{name?}', function() {
      $hash_key = new ForceRefreshHashKeySetting;

        return view('pages.tm.index', ['hash_key' => $hash_key->all()]);
    });

    // area Manager application
    Route::get('/am/{name?}', function() {
      $hash_key = new ForceRefreshHashKeySetting;

        return view('pages.am.index', ['hash_key' => $hash_key->all()]);
    })->where("name", ".*");

    // regional Manager application
    Route::get('/rm/{name?}', function() {
      $hash_key = new ForceRefreshHashKeySetting;

        return view('pages.rm.index', ['hash_key' => $hash_key->all()]);
    })->where("name", ".*");

    // general Manager application
    Route::get('/gm/{name?}', function() {
      $hash_key = new ForceRefreshHashKeySetting;

        return view('pages.gm.index', ['hash_key' => $hash_key->all()]);
    })->where("name", ".*");

    // OTC rep application
    Route::get('/otc-rep/{name?}', function() {
      $hash_key = new ForceRefreshHashKeySetting;

        return view('pages.otc-rep.index', ['hash_key' => $hash_key->all()]);
    })->where("name", ".*")->middleware('otc-rep');

    // OTC manager application
    Route::get('/otc-manager/{name?}', function() {
      $hash_key = new ForceRefreshHashKeySetting;

        return view('pages.otc-manager.index', ['hash_key' => $hash_key->all()]);
    })->where("name", ".*")->middleware('otc-manager');

    // admin application
    Route::get('/admin/{name?}', function() {
      $hash_key = new ForceRefreshHashKeySetting;

        return view('pages.admin.index', ['hash_key' => $hash_key->all()]);
    })->where("name", ".*")->middleware('adminOnly');
});
