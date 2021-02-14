<?php

namespace App\Http\Controllers\Api\V1\OTCManager;

use App\Helpers\CycleHelper;
use App\Helpers\ResponseHelper;
use App\Helpers\Setting\ActiveCycleSetting;
use App\Http\Controllers\Controller;
use App\Http\Resources\OTCManager\PlannerResource;
use App\OtcPlanner;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;

class PlannerController extends Controller
{

    protected $user;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = Auth::user();
            return $next($request);
        });
    }

    /**
     * get all rep plans
     *
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $reps = json_decode($this->user->user_relations)->reps;
        $model = OtcPlanner::query();
       // $model = CycleHelper::getCycleData($model, 'plan_date');
        $model = $model->whereIn('user_id', $reps)
              ->orderBy('user_id');

        $plans = $model->with(['user', 'pharmacy'])->get();

        $submitted = $model
        ->where('submitted', true)
        ->select('user_id', 'submitted', 'approved')
        ->distinct('user_id')
        ->get();

        return response([
            'code' => 200,
            'data' => PlannerResource::collection($plans),
            "submitted" => $submitted,
        ]);
    }

    /**
     * approve or reject rep planner
     *
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function submit(Request $request)
    {
      $validator = Validator::make($request->all(), [
        'user'  =>  'required|string',
        'state' =>  [
          'required',
          Rule::in(['approve', 'reject'])
        ]
      ]);

      if($validator->fails()) {
        return response(ResponseHelper::validationErrorResponse($validator));
      }

      $state = $request->state;
      $active = new ActiveCycleSetting;
      $cycle = $active->all();
      if($state === "approve") {
        $this->approvePlans($request->user, [$cycle->start, $cycle->end]);
        $message = "All plans approved";
      } else {
        $this->rejectPlans($request->user, [$cycle->start, $cycle->end]);
        $message = "All plans rejected";
      }

      return response([
        "code"  =>  200,
        'message' =>  $message,
        "cycle"   =>  $cycle
      ]);
    }


    /**
     * approve rep plans
     *
     * @param int $user [user id]
     * @param array $cycle [cycle of approval]
     * @return void
     */
    private function approvePlans(int $user, array $cycle)
    {
      OtcPlanner::where([
        'user_id' =>  $user,
        'submitted' =>  1,
        'approved'  =>  0
      ])
      ->whereBetween('plan_date', $cycle)
      ->update([
        'approved'  =>  true,
        'approved_by' => $this->user->id
      ]);
    }

    /**
     * reject rep plans
     *
     * @param int $user [user id]
     * @param array $cycle [cycle of approval]
     * @return void
     */
    private function rejectPlans(int $user, array $cycle)
    {
      OtcPlanner::where([
        'user_id' =>  $user,
        'submitted' =>  true,
        'approved'  =>  false
      ])
      ->whereBetween('plan_date', $cycle)
      ->update([
        'submitted' => false,
        'approved'  =>  false,
        'approved_by' => $this->user->id
      ]);
    }
}
