<?php

namespace App\Http\Controllers\Api\V1\Admin\Setting;

use App\Helpers\ResponseHelper;
use App\Helpers\Setting\ReportIntervalSetting;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReportIntervalController extends Controller
{
    /**
     * get report interval setting
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $reportInterval = new ReportIntervalSetting;
      $data = $reportInterval->all();
      return response([
        'code'  =>  200,
        'data'  =>  $data
      ]);
    }

    /**
     * update Report Interval Setting
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      $validator = Validator::make($request->all(), [
        'interval'  =>  'required|numeric'
      ],[
        'interval.required' =>  'Report Interval is missing',
        'interval.numeric'  =>  'Report Interval must be a number'
      ]);

      if($validator->fails()) {
        return response(ResponseHelper::validationErrorResponse($validator));
      }

      $reportInterval = new ReportIntervalSetting;
      $reportInterval->save($request->interval);
      return response([
        'code'  =>  200,
        'message' =>  'Report interval updated'
      ]);
    }
}
