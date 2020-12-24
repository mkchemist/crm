<?php

namespace App\Http\Controllers\Api\V1\Admin\Setting;

use App\Helpers\ResponseHelper;
use App\Helpers\Setting\NonFieldActivitySetting;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NonFieldActivityController extends Controller
{

  public function index()
  {
    $nonFieldActivity = new NonFieldActivitySetting;
    $data = $nonFieldActivity->all();
    return response([
      'code'  =>  200,
      'data'  =>  $data,

    ]);
  }


  public function store(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'types' =>  'required|json'
    ],[
      'type.required' => 'Types is missing',
      'type.json'     =>  'Types must be a valid json format'
    ]);
    if($validator->fails()) {
      return response(ResponseHelper::validationErrorResponse($validator));
    }

    $types = new NonFieldActivitySetting;
    $types->save($request->types);
    return response([
      'code'  =>  200,
      'message' => 'Non field activity types saved'
    ]);
  }
}
