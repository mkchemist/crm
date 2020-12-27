<?php

namespace App\Http\Controllers\Api\V1\Admin\Setting;

use App\Helpers\Setting\ForceRefreshHashKeySetting;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ForceRefreshHashKeySettingController extends Controller
{
    /**
     * get current hash key
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $hash = new ForceRefreshHashKeySetting;
      return response([
        'code'  =>  200,
        'data'  =>  $hash->all()
      ]);
    }

    /**
     * generate hash key
     *
     * @return \Illuminate\Http\Response
     */
    public function store()
    {
      $hashed_key = Str::random(15);
      $hash = new ForceRefreshHashKeySetting;

      $hash->save($hashed_key);
      return response([
        'code'  =>  200,
        'message' =>  'Hash key changed',
        'data'  =>  $hashed_key
      ]);
    }
}
