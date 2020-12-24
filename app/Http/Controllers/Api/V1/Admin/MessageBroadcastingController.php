<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\MessageBroadcasting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class MessageBroadcastingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $messages = MessageBroadcasting::with(['user'])->get();
      return response([
        'code'  =>  200,
        'data'  =>  $messages
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
          'title' =>  'required|string',
          'body'  =>  'required|string',
          'type'  =>  'required|string'
        ]);
        if($validator->fails()) {
          return response(ResponseHelper::validationErrorResponse($validator));
        }
        $user = Auth::user();
        MessageBroadcasting::create([
          'title'   =>  $request->title,
          'type'    =>  $request->type,
          'body'    =>  $request->body,
          'user_id' =>  $user->id
        ]);
        return response([
          'code'  =>  200,
          'message' =>  'New message sent'
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
      MessageBroadcasting::destroy($id);
      return response([
        'code'  =>  200,
        'message' =>  'Broadcast message deleted'
      ]);
    }
}
