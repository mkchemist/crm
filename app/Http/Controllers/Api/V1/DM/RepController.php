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
      $relations = json_decode($user->user_relations);
      $reps = $relations->reps ?? [];
      $reps = User::whereIn('id', $reps)->get();

      return response([
        'code'  =>  200,
        'data'  =>  DistrictRepResource::collection($reps),
      ],200);
    }
}
