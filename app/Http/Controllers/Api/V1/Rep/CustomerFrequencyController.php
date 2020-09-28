<?php

namespace App\Http\Controllers\Api\V1\Rep;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustomerFrequencyController extends Controller
{
  public function update(Request $request)
  {
    return response()->json($request->all());
  }
}
