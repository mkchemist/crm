<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{

  /**
   * Undocumented function
   *
   * @param Illuminate\Http\Request $request
   * @return Illuminate\Http\Response
   */
  public function login(Request $request)
  {
    $validator = Validator::make($request->all(), [
      "username"  =>  'required',
      "password"  =>  'required'
    ]);

    if($validator->fails()) {
      return response([
        "code"  => 400,
        "message" =>  "Invalid request inputs",
        "date"    =>  Date("D d-m-20y"),
        "errors"  =>  $validator->errors()
      ],400);
    }
    $credentials = [
      "username"  =>  $request->username,
      "password"  =>  $request->password
    ];
    if(Auth::attempt($credentials)) {
      return response([
        "code"  =>  201,
        "data"  =>  Auth::user()
      ],201);
    } else {
      return response([
        "code"  =>  401,
        "date"  =>  Date("D d-m-20y"),
        "message" =>  "Invalid login credentials"
      ],401);
    }
  }
}
