<?php

namespace App\Http\Controllers\Api\V1\Admin\Setting;

use App\Helpers\ResponseHelper;
use App\Helpers\Setting\ActiveCycleSetting;
use App\Helpers\Setting\CyclesSetting;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ActiveCycleController extends Controller
{
    /**
     * get active cycle
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $activeCycle = new ActiveCycleSetting;

      return response([
        'code' => 200,
        'data'  =>  $activeCycle->all()
      ]);
    }

    /**
     * update active cycle
     *
     * @param \Illuminate\Http\Request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      $cycles = new CyclesSetting;
      $validator = Validator::make($request->all(), [
        'cycle_name'  =>  [
          'required',
          'string',
          Rule::in($cycles->getCyclesNames())
        ],
        'cycle' =>  'required|json'
        ], [
          'cycle.required'  =>  'active cycle is missing',
          'cycle_name.in'      =>  "$request->cycle_name is not registered"
        ]);

      if($validator->fails()) {
        return response(ResponseHelper::validationErrorResponse($validator));
      }

      $activeCycle = new ActiveCycleSetting;
      $activeCycle->save($request->cycle);
      return response([
        'code'  =>  200,
        'message' =>  'Setting save successfully',
        'data'    =>  $activeCycle->all()
      ]);
    }
}
