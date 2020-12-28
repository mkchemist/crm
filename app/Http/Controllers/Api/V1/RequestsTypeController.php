<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\Setting\RequestSetting;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RequestsTypeController extends Controller
{
    public function index()
    {
      $requests = new RequestSetting;
      $data = [];
      foreach($requests->all() as $group) {
        $data = array_merge($data, $group->requests);
      }
      return response([
        'code'  =>  200,
        'data'  =>  $data,
      ]);
    }
}
