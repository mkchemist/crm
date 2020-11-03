<?php

namespace App\Http\Controllers\Api\V1\DM;

use App\Http\Controllers\Controller;
use App\Http\Resources\DM\DistrictRepResource;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RepController extends Controller
{
    /**
     *  get All rep in District manager group
     *
     * @return \Illuminate\Http\Response
     */
    public function getAllRep()
    {
      $user = Auth::user();
      $reps = User::where([
        'district'  =>  $user->district,
        'line'      =>  $user->line,
      ])->get();
      return response([
        'code'  =>  200,
        'data'  =>  DistrictRepResource::collection($reps)
      ],200);
    }
}
