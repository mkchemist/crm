<?php

namespace App\Http\Controllers\Api\V1\OTCRep;

use App\Helpers\CycleHelper;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\OTCRep\PlannerResource;
use App\OtcPlanner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

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
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $plans = OtcPlanner::with(['user', 'pharmacy'])
            ->where('user_id', $this->user->id);
        $cycle = null;
        if((integer)request()->start && (integer) request()->end) {
          $cycle = [request()->start, request()->end];
        };

        $plans = CycleHelper::getCycleData($plans, 'plan_date', $cycle);
        $plans = $plans->orderBy('plan_date')->get();

        $isSubmitted = $this->isSubmitted();

        return response([
            'code' => 200,
            'data' => PlannerResource::collection($plans),
            'isSubmitted' => $isSubmitted
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
        $validator = Validator::make($request->all(), [
            'date' => 'required|date',
            'titles' => 'required|json',
            'type' => 'required',
        ]);

        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }

        if($this->isSubmitted()) {
          return response([
            'code'  =>  400,
            'data' => [
              'errors' => [
                'Plan is Submitted'
              ]
            ]
          ]);
        }

        if ($request->type === "health_day" && !$request->pharmacy) {
            return response([
                'code' => 400,
                'data' => [
                    'errors' => [
                        'Pharmacy is missing',
                    ],
                ],
            ]);
        }

        $titles = json_decode($request->titles);

        foreach ($titles as $title) {
            $data = [
                'user_id' => $this->user->id,
                'type' => $request->type,
                'title' => $title,
                'plan_date' => $request->date,
            ];
            if ($request->pharmacy) {
                $data['pharmacy_id'] = $request->pharmacy;
            }
            OtcPlanner::create($data);
        }
        return response([
            'code' => 200,
            'message' => 'Plan Added',
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
        $validator = Validator::make($request->all(), [
            'ids' => 'required|json',
            'date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }

        $ids = json_decode($request->ids);
        OtcPlanner::whereIn('id', $ids)
            ->where('user_id', $this->user->id)
            ->where('submitted', '!=', true)
            ->update([
                'plan_date' => $request->date,
            ]);

        return response([
            'code' => 200,
            'message' => 'Plan date updated',
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
        //
    }

    /**
     * delete plan group
     *
     * @param \Illuminate\Http\Request
     * @return \Illuminate\Http\Response
     */
    public function deleteGroup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|json',
        ]);

        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }
        $ids = json_decode($request->ids);
        $plans = OtcPlanner::whereIn('id', $ids)
            ->where('user_id', $this->user->id)
            ->where('submitted', '!=', true);
        $plans->delete();
        return response([
            'code' => 200,
            'message' => 'Plans deleted',
        ]);
    }

    /**
     * Duplicate plans
     *
     * @param \Illuminate\Http\Request
     * @return \Illuminate\Http\Response
     */
    public function duplicate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|json',
            'date'  =>  'required|date'
        ]);

        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }
        $ids = json_decode($request->ids);
        foreach($ids as $id) {
          $item = OtcPlanner::where([
            'id'  =>  $id,
            'user_id' =>  $this->user->id
          ])->first();
          $new = $item->replicate();
          $new->plan_date = $request->date;
          $new->save();
        }


        return response([
          'code'  =>  200,
          'message' =>  'Plan duplicated'
        ]);
    }

    /**
     * Submit Plans
     *
     * @return \Illuminate\Http\Response
     */
    public function submit()
    {
      $plans = OtcPlanner::where('user_id', $this->user->id);
      $plans = CycleHelper::getCycleData($plans, 'plan_date');
      $plans->update([
        'submitted' => true
      ]);

      return response([
        'code'  =>  200,
        'message' =>  'Planner submitted'
      ]);
    }

    /**
     * check if plan is submitted
     *
     * @return bool
     */
    private function isSubmitted()
    {
      $isSubmitted = OtcPlanner::where('user_id', $this->user->id)
        ->where('submitted', true);
        $isSubmitted = CycleHelper::getCycleData($isSubmitted,'plan_date');
        $isSubmitted = $isSubmitted->first();
      if($isSubmitted) {
        return true;
      }
      return false;
    }
}
