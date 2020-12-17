<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class AreaController extends Controller
{
    /**
     * get all locations
     *
     * @return \Illuminate\Http\Response
     */
    public function area()
    {
        $areas = DB::table('customers')->select('brick', 'area', 'district', 'territory', 'region')
            ->distinct()->get();
        return response([
            'code' => 200,
            'data' => $areas,
        ]);
    }

    public function specialty()
    {
        $specialties = DB::table('customers')
        ->select('specialty')
        ->distinct()
        ->get();
        return response([
          'code'  =>  200,
          'data'  =>  $specialties
        ]);
    }
}
