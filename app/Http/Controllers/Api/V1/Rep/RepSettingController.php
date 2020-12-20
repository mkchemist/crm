<?php

namespace App\Http\Controllers\Api\V1\Rep;

use App\Helpers\Setting\ActiveCycleSetting;
use App\Helpers\Setting\CyclesSetting;
use App\Helpers\Traits\UserWithAssignment;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RepSettingController extends Controller
{
    use UserWithAssignment;

    /**
     * user locations
     *
     */
    public function locations()
    {
      $locations = DB::table('customers')
      ->select('brick','area','district','territory','region')
      ->distinct();

      $user = Auth::user();

      $locations = $this->getQueryWithAssignment($user, $locations);
      $locations = $locations->get();

      return response([
        'code'  =>  200,
        'data'  =>  $locations
      ]);
    }

    /**
     * current cycles
     *
     * @return \Illuminate\Http\Response
     */
    public function Cycles()
    {
      $cycles = new CyclesSetting;
      $data = $cycles->all();
      return response([
        'code'  =>  200,
        'data'  =>  $data
      ]);
    }

    /**
     * get active cycle
     *
     * @return \Illuminate\Http\Response
     */
    public function activeCycle()
    {
      $activeCycle = new ActiveCycleSetting;
      $data = $activeCycle->all();
      return response([
        'code'  =>  200,
        'data'  =>  $data
      ]);
    }
}
