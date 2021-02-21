<?php

namespace App\Http\Controllers\Api\V1\Rep;

use App\Helpers\ResponseHelper;
use App\Helpers\Setting\ActiveCycleSetting;
use App\Helpers\Traits\CycleDateValidation;
use App\Http\Controllers\Controller;
use App\Http\Resources\RepPlannerResource;
use App\Planner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PlannerController extends Controller
{
    use CycleDateValidation;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $activeCycle = new ActiveCycleSetting;
        $activeCycleData = $activeCycle->all();
        $start = $activeCycleData->start;
        $end = $activeCycleData->end;
        $user = Auth::user();
        $model = Planner::query();
        $plans = $model->with([
            'customer', 'customer.frequency', 'customer.planner', 'customer.params', 'user',
        ])
            ->where('user_id', $user->id)->orderBy('plan_date', 'asc');
        if((integer)request()->start) {
          $start = request()->start;
        }
        if((integer) request()->end) {
          $end = request()->end;
        }

        $plans = $plans->whereBetween('plan_date', [$start, $end])->get();


        $isSubmitted = $model->where(['submitted' => true, 'user_id' => $user->id])->first();
        return response()->json([
            'code' => 201,
            'data' => RepPlannerResource::collection($plans),
            'submitted' => $isSubmitted ? true : false,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $ids = json_decode($request->customers);
        $exists = [];
        $user = Auth::user();
        if ($this->isPassedDay($request->date)) {
            return $this->isPassedDay($request->date);
        }
        /*  $isNotValidDate = $this->isNotValidDate($request->date);
        if ($isNotValidDate) {
        return response($isNotValidDate);
        } */
        $accepted = [];
        foreach ($ids as $id) {
            Planner::updateOrCreate([
                'customer_id' => $id,
                'user_id' => $user->id,
                'plan_date' => $request->date,
            ]);
        }
        return response()->json([
            'code' => 201,
            'accepted' => $accepted,
            'rejected' => $exists,
        ]);
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
        $plan = $this->getPlanById($id);
        if ($this->isPassedDay($request->date)) {
            return $this->isPassedDay($request->date);
        }
        $check = $this->checkIfExists($plan->customer_id, $request->date);
        if ($check) {
            return response()->json(ResponseHelper::ITEM_ALREADY_EXIST);
        }
        /* $isNotValidDate = $this->isNotValidDate($request->date);
        if ($isNotValidDate) {
        return response($isNotValidDate);
        } */
        $plan->plan_date = $request->date;
        $plan->save();
        return response()->json([
            'code' => 201,
            'data' => "Plan of {$plan->customer->name} updated successfully",
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
        $plan = $this->getPlanById($id);
        if (!$plan) {
            return response()->json(ResponseHelper::BAD_REQUEST_INPUT);
        }
        if(CycleDateValidation::isOldDate($plan->plan_date)) {
          return ResponseHelper::UnableToDeleteOldDate();
        }
        if ($plan->delete()) {
            return response()->json([
                'code' => 201,
                'data' => sprintf("Plan of %s is deleted successfully", $plan->customer->name),
            ]);
        }
    }

    /**
     * Delete group of plans
     *
     * @param Illuminate\Http\Request $request
     * @return Illuminate\Http\Response
     */
    public function groupDelete(Request $request)
    {
        $ids = json_decode($request->customers);
        $model = Planner::where([
            'user_id' => Auth::user()->id,
            'plan_date' => $request->date,
            'submitted' => false,
        ])->whereIn('id', $ids);
        $plans = $model->get();
        if(CycleDateValidation::isOldDate($plans[0]->plan_date)) {
          return ResponseHelper::UnableToDeleteOldDate();
        }
        $model->delete();
        return response()->json([
            'code' => 201,
            'data' => sprintf('%d customer deleted', count($ids)),
        ]);
    }

    /**
     * duplicate plan day
     *
     * @param Illuminate\Http\Request $request
     * @return Illuminate\Http\Response
     */
    public function DuplicateDate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date',
            'replan_date' => 'required|date',
        ]);
        if ($validator->fails()) {
            return response()->json(ResponseHelper::validationErrorResponse($validator));
        }
        if ($this->isPassedDay($request->replan_date)) {
            return $this->isPassedDay($request->replan_date);
        }
        $rejected = [];
        $accepted = [];
        $plans = Planner::where([
            'plan_date' => $request->date,
            'user_id' => Auth::user()->id,
            'submitted' => false,
        ])->get();
        foreach ($plans as $plan) {
            $check = $this->checkIfExists($plan->customer_id, $request->replan_date);
            if ($check) {
                $rejected[] = sprintf("Customer %s is already planned on %s", $plan->customer->name, $request->date);
            } else {
                $newPlan = Planner::create([
                    'customer_id' => $plan->customer_id,
                    'plan_date' => $request->replan_date,
                    'user_id' => Auth::user()->id,
                ]);
                $accepted[] = $newPlan;
            }
        };
        return response()->json([
            'code' => 201,
            'data' => sprintf("date %s replanned successfully", $request->date),
            'rejected' => $rejected,
            'accepted' => $accepted,
        ]);
    }

    /**
     * clear total plan date
     *
     * @param Illuminate\Http\Request $request
     * @return Illuminate\Http\Response
     */
    public function clearDate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date',
        ]);
        if ($validator->fails()) {
            return response()->json(ResponseHelper::validationErrorResponse($validator));
        }
        $model = Planner::where([
            'plan_date' => $request->date,
            'user_id' => Auth::user()->id,
            'submitted' => false,
        ]);
        $plans = $model->get();
        if(CycleDateValidation::isOldDate($plans[0]->plan_date)) {
          return ResponseHelper::UnableToDeleteOldDate();
        }

        $model->delete();
        return response()->json([
            'code' => 201,
            'data' => sprintf("Date %s cleared successfully", $request->date),
        ]);
    }

    /**
     * check if plan already exists
     *
     * @param integer $id
     * @param string $date
     * @return Planner|Null
     */
    private function checkIfExists(int $id, string $date)
    {
        $check = Planner::where([
            'customer_id' => $id,
            'user_id' => Auth::user()->id,
            'plan_date' => $date,
        ])->first();
        return $check;
    }

    /**
     * get Plan by Id
     *
     * @param integer $id
     * @return Planner|Null
     */
    private function getPlanById(int $id)
    {
        $plan = Planner::where([
            'id' => $id,
            'user_id' => Auth::user()->id,
            'submitted' => false,
        ])->first();
        return $plan;
    }

    public function submitPlan()
    {
        $user = Auth::user();
        $activeCycle = new ActiveCycleSetting;
        $data = $activeCycle->all();
        if (!$data) {
            return response([
                'code' => 400,
                'data' => [
                    'errors' => [
                        'No active cycle selected',
                    ],
                ],
            ]);
        }
        $start = $data->start;
        $end = $data->end;
        $plans = Planner::where([
            'user_id' => $user->id,
            'submitted' => false,
        ])->whereBetween('plan_date', [$start, $end])->update([
            'submitted' => true,
        ]);
        return response([
            'code' => 200,
            'message' => 'PM plans have been submitted',
        ]);
    }

}
