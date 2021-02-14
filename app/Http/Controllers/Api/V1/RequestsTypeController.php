<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\Setting\RequestSetting;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RequestsTypeController extends Controller
{
    public function index()
    {
      $user = Auth::user();
      $requests = new RequestSetting;
      $requests = $requests->all();
      $data = [];
      foreach($requests as $request) {
        if($user->role === "rep") {
          if($request->name === $user->role) {
            $data = $request->requests;
          }
        } else {
          if($request->name !== "rep") {
            $data= $request->requests;
          }
        }

      }
      return response([
        'code'  =>  200,
        'data'  =>  $data,
        'requests'  =>  $requests
      ]);
    }
}
