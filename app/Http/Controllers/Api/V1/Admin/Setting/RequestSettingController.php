<?php

namespace App\Http\Controllers\Api\V1\Admin\Setting;

use App\Helpers\ResponseHelper;
use App\Helpers\Setting\RequestSetting;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RequestSettingController extends Controller
{
    public function index()
    {
      $setting = new RequestSetting;
      return response([
        'code'  =>  200,
        'data'  =>  $setting->all()
      ]);
    }


    public function store(Request $request)
    {
      $validator = Validator::make($request->all(),[
        'requests' => 'required|json'
      ]);
      if($validator->fails()) {
        return response(ResponseHelper::validationErrorResponse($validator));
      }

      $setting = new RequestSetting;
      $setting->save($request->requests);
      return response([
        'code'  =>  200,
        'message' =>  'Groups saved'
      ]);
    }
}
