<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ResponseHelper;
use App\Helpers\Setting\EventManagerSetting;
use App\Http\Controllers\Controller;
use App\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RequestEventManagerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $events = new EventManagerSetting;
        return response([
          'code'  =>  200,
          'data'  =>  $events->all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      $validator = Validator::make($request->all(), [
        'name'  =>  'required|string',
        'hotel' =>  'required|string',
        'duration'  =>  'required|numeric',
        'room_type' =>  'required|string',
        'rooms'   =>  'required|numeric',
        'type'    =>  'required|string'
      ]);

      if($validator->fails()) {
        return response(ResponseHelper::validationErrorResponse($validator));
      }

      $data = json_encode($request->except('api_token'));
      $eventManager = new EventManagerSetting;
      $eventManager->saveEvent($request->name, $data);

      return response([
        'code'  =>  200,
        'message' =>  'Event Saved'
      ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
      Setting::destroy($id);
      return response([
        'code'  =>  200,
        'message' =>  'Event Deleted'
      ]);
    }
}
