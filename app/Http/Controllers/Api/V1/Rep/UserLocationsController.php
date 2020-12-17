<?php

namespace App\Http\Controllers\Api\V1\Rep;

use App\Helpers\Traits\UserWithAssignment;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserLocationsController extends Controller
{
    use UserWithAssignment;

    public function index()
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
}
