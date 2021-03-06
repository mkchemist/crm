<?php

namespace App\Http\Controllers\Api\V1\Rep;

use App\Helpers\Setting\ActiveCycleSetting;
use App\Helpers\Setting\CyclesSetting;
use App\Helpers\Setting\LineSetting;
use App\Helpers\Setting\NonFieldActivitySetting;
use App\Helpers\Setting\FieldActivitySetting;
use App\Helpers\Setting\ReportIntervalSetting;
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
      $reportInterval = new ReportIntervalSetting;
      return response([
        'code'  =>  200,
        'data'  =>  $data,
        'can_edit_report_date' => $reportInterval->canEditDate,
        'report_interval'      => $reportInterval->all()
      ]);
    }

    /**
     * get user line props
     *
     * @return \Illuminate\Http\Response
     */
    public function line()
    {
      $user = Auth::user();
      $userLine = json_decode($user->line);
      $lines = new LineSetting;
      $data =$lines->all();
      $products = [];
      if($data && count($data)) {
        foreach($data as $line) {
          if(in_array($line->name,$userLine)) {
            $products = array_merge($products,$line->products);
          }
        }
      }
      return response([
        'code'  =>  200,
        'data'  =>  $products,
        'line'  =>  $userLine,
        '$data'  =>  $data
      ]);
    }

    /**
     * non field activity types
     *
     * @return \Illuminate\Http\Response
     */
    public function nonFieldActivityTypes()
    {
      $types = new NonFieldActivitySetting;
      return response([
        'code'  =>  200,
        'data'  =>  $types->all()
      ]);
    }

    /**
     * field activity types
     *
     * @return \Illuminate\Http\Response
     */
    public function fieldActivityTypes()
    {
      $types = new FieldActivitySetting;
      return response([
        'code'  =>  200,
        'data'  =>  $types->all()
      ]);
    }
}
