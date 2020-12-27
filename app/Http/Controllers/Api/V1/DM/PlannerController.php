<?php

namespace App\Http\Controllers\Api\V1\DM;

use App\CoachPlanner;
use App\Helpers\ResponseHelper;
use App\Helpers\Setting\ActiveCycleSetting;
use App\Http\Controllers\Controller;
use App\Http\Resources\DM\CoachPlannerResource;
use App\Http\Resources\RepPlannerResource;
use App\Planner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class PlannerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = Auth::user();
        $relations = json_decode($user->user_relations);
        $reps = $relations->reps;
        $repPlansModel = Planner::query();
        $repPlans = $repPlansModel->with([
            'customer', 'customer.frequency', 'customer.planner', 'customer.params', 'user',
        ])->whereIn('user_id', $reps)
            ->get();
        $repPlansSubmitted = $repPlansModel->select('submitted', 'approved', 'user_id')
            ->distinct()->get();

        $coach = CoachPlanner::with(['rep', 'coach'])
            ->where(['coach_id' => $user->id])->get();

        return response([
            'code' => 201,
            'data' => [
                'rep' => RepPlannerResource::collection($repPlans),
                'coach' => CoachPlannerResource::collection($coach),
            ],
            'validation'  =>  $repPlansSubmitted
        ], 201);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rep_id' => 'required|numeric',
            'date' => 'required',
        ]);
        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }
        $user = Auth::user();
        $check = CoachPlanner::where([
            'coach_id' => $user->id,
            'rep_id' => $request->rep_id,
            'plan_date' => $request->date,
        ])->first();
        if ($check) {
            return response(ResponseHelper::ITEM_ALREADY_EXIST);
        }
        CoachPlanner::create([
            'coach_id' => $user->id,
            'rep_id' => $request->rep_id,
            'plan_date' => $request->date,
        ]);
        return response([
            'code' => 201,
            'data' => 'Plan added',
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }

        $user = Auth::user();
        $plan = CoachPlanner::where([
            'coach_id' => $user->id,
            'id' => $id,
        ])->first();

        $check = CoachPlanner::where([
            'coach_id' => $user->id,
            'rep_id' => $plan->rep_id,
            'plan_date' => $request->date,
        ])->first();
        if ($check) {
            return response(ResponseHelper::ITEM_ALREADY_EXIST);
        }

        $plan->plan_date = $request->date;
        $plan->save();
        return response([
            'code' => 200,
            'message' => 'Planned visit updated',
            'plan' => $plan,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if (!is_numeric($id)) {
            return response(ResponseHelper::BAD_REQUEST_INPUT);
        }
        CoachPlanner::destroy($id);
        return response([
            'code' => 201,
            'data' => 'Plan removed',
        ], 201);
    }

    /**
     * approve or reject rep plans
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function repPlansAction(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user' => 'required|int',
            'type' => [
                'required',
                Rule::in(['approved', 'rejected']),
            ],
        ]);
        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }
        $state = $request->type === 'approved' ? true : false;
        $activeCycle = new ActiveCycleSetting;
        $data = $activeCycle->all();
        Planner::where([
            'user_id' => $request->user,
            'submitted' => true,
        ])->whereBetween('plan_date', [$data->start, $data->end])
            ->update([
                'submitted' => $state,
                'approved' => $state,
            ]);
        return response([
            'code' => 200,
            'message' => 'Plans updated',
        ]);
    }
}
