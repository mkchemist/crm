<?php

namespace App\Http\Controllers\Api\V1\Admin\Setting;

use App\Helpers\ResponseHelper;
use App\Helpers\Setting\CyclesSetting;
use App\Http\Controllers\Controller;
use App\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CycleController extends Controller
{
  public function index()
  {
    $cycles = new CyclesSetting;

    return response([
      'code'  => 200,
      'data'  =>  $cycles->all(),
    ]);
  }

  /**
   * update or store cycle setting
   *
   * @param \Illuminate\Http\Request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'cycles'  =>  'required|json'
    ], [
      'cycles.required' =>  'Cycles are missing',
      'cycles.json'     =>  'Cycles must be a valid json format'
    ]);

    if($validator->fails()) {
      return response(ResponseHelper::validationErrorResponse($validator));
    }

    $cycles = new CyclesSetting;
    $cycles->save($request->cycles);
    return response([
      'code'  =>  200,
      'message' =>  'Cycles updated'
    ]);
  }
}
