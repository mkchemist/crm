<?php

namespace App\Http\Controllers;

use App\MessageBroadcasting;
use Illuminate\Http\Request;

class MessageBroadcastingReaderController extends Controller
{
  public function all()
  {
    $messages = MessageBroadcasting::orderBy('created_at','desc')->get();
    return response([
      'code'  =>  200,
      'data'  =>  $messages
    ]);
  }
}
