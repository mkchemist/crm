<?php

namespace App\Http\Controllers\Api\V1\Rep;

use App\Helpers\ResponseHelper;
use App\Helpers\Setting\ActiveCycleSetting;
use App\Helpers\Traits\CycleDateValidation;
use App\Http\Controllers\Controller;
use App\Http\Resources\RepWorkplacePlannerResource;
use App\WorkplacePlanner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class WorkplacePlannerController extends Controller
{
    use CycleDateValidation;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = Auth::user();
        $cycle = new ActiveCycleSetting;
        $date = $cycle->all();
        if($date) {
          $plans = WorkplacePlanner::with('workplace')->where([
              'user_id' => $user->id,
          ])->whereBetween('plan_date', [$date->start, $date->end])
          ->orderBy('plan_date', 'asc')->get();

        } else {
          $plans = WorkplacePlanner::with('workplace')->where([
            'user_id' => $user->id,
        ])->orderBy('plan_date', 'asc')->get();
        }

        return response()->json([
            'code' => 201,
            'data' => RepWorkplacePlannerResource::collection($plans),
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
        /** Validate incoming request */
        $validator = Validator::make($request->all(), [
            'date' => 'required',
            'workplaces' => 'required',
        ]);
        /** If validation fails */
        if ($validator->fails()) {
            return response()->json(ResponseHelper::validationErrorResponse($validator));
        }
        $isNotValidDate = $this->isNotValidDate($request->date);
        if ($isNotValidDate) {
            return response($isNotValidDate);
        }
        /** convert workplaces IDs json to normal array */
        $ids = json_decode($request->workplaces);
        /** rejected plans */
        $rejected = [];
        /** accepted plans */
        $accepted = [];
        $user = Auth::user();
        /** looping through ids */
        foreach ($ids as $id) {
            /**
             * check if plan already exists
             *
             * if exists it will add the given id
             * to rejected plans
             * if no exists it will create new plan
             * for the given workplace id
             *
             */
            $state = WorkplacePlanner::updateOrCreate([
                'workplace_id' => $id,
                'user_id' => Auth::id(),
                'plan_date' => $request->date,
            ]);
        }
        return response()->json([
            'code' => 201,
            'accepted' => $accepted,
            'rejected' => $rejected,
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
        $check = $this->getPlanByWorkplaceId($plan->workplace_id, $request->date);
        $isNotValidDate = $this->isNotValidDate($request->date);
        if ($isNotValidDate) {
            return response($isNotValidDate);
        }
        if ($check) {
            return response()->json(ResponseHelper::ITEM_ALREADY_EXIST);
        }
        $plan->plan_date = $request->date;
        $plan->save();
        return response()->json([
            'code' => 201,
            'data' => "hospital {$plan->workplace->name} plan updated successfully",
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
        $plan->delete();
        return response()->json([
            'code' => 201,
            'data' => sprintf('workplace %s plan removed successfully', $plan->workplace->name),
        ]);
    }

    /**
     * group delete workplace plans
     *
     * @param Illuminate\Http\Request $request
     * @return Illuminate\Http\Response
     */
    public function groupDelete(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required',
            'workplaces' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(ResponseHelper::validationErrorResponse($validator));
        }
        $ids = json_decode($request->workplaces);
        $plans = WorkplacePlanner::whereIn('id', $ids)
            ->where([
                'user_id' => Auth::user()->id,
                'plan_date' => $request->date,
            ])
            ->delete();
        return response()->json([
            'code' => 201,
            'data' => sprintf("%d workplace plans removed successfully", count($ids)),
        ]);
    }

    /**
     * get plan by workplace ID
     *
     * @param integer $id [workplace id]
     * @param string $date [plan_date]
     * @return WorkplacePlanner|Null
     */
    private function getPlanByWorkplaceId(int $id, string $date)
    {
        $plan = WorkplacePlanner::where([
            'user_id' => Auth::user()->id,
            'workplace_id' => $id,
            'plan_date' => $date,
        ])->first();
        return $plan;
    }

    /**
     * get Planner by ID
     *
     * @param int $id [plan id]
     * @return WorkplacePlanner | Null
     */
    private function getPlanById(int $id)
    {
        $plan = WorkplacePlanner::where([
            'id' => $id,
            'user_id' => Auth::user()->id,
        ])->first();
        return $plan;
    }
}
