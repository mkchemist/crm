<?php

namespace App\Http\Controllers\Api\V1\DM;

use App\CoachReport;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\DM\CoachReportResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CoachingReportController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $user = Auth::user();
      $reports = CoachReport::with(['coach', 'rep', 'customer', 'customer.params'])->where([
        'coach_id'  =>  $user->id
      ])->get();

      return response([
        'code'  =>  200,
        'data'  =>  CoachReportResource::collection($reports)
      ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      return response([
        'code'  =>  404,
        'message' =>  'End point is closed'
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
        if(!is_numeric($id)) {
          return response(ResponseHelper::BAD_REQUEST_INPUT);
        }
        $user = Auth::user();
        $report = CoachReport::with(['rep', 'customer', 'customer.params'])->where([
          'coach_id' => $user->id,
          'id'      =>  $id
        ])->first();
        if(!$report) {
          return response(ResponseHelper::INVALID_ID);
        }

        return response([
          'code'  =>  201,
          'data'  =>  new CoachReportResource($report)
        ]);
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
          'report'  =>  'required'
        ]);
        if($validator->fails()) {
          return response(ResponseHelper::validationErrorResponse($validator));
        }
        if(!is_numeric($id)) {
          return response(ResponseHelper::BAD_REQUEST_INPUT);
        }
        $user = Auth::user();
        $report = CoachReport::where([
          'coach_id'  =>  $user->id,
          'id'        =>  $id
        ])->first();

        $report->update(['data' => $request->report]);
        return response([
          'code'  =>  201,
          'data'  =>  'Report Updated successfully'
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
      if(!is_numeric($id)) {
        return response(ResponseHelper::BAD_REQUEST_INPUT);
      }
      $user = Auth::user();
      $report = CoachReport::where([
        'coach_id'  =>  $user->id,
        'id'        =>  $id
      ])->delete();
      return response([
        "code"  =>  200,
        "message" =>  "Report rejected and deleted"
      ], 200);
    }

    /**
     * Submit Coach reports
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function submitReport(Request $request)
    {
      $validator = Validator::make($request->all(), ['ids' => 'required']);
      if($validator->fails()) {
        return response(ResponseHelper::validationErrorResponse($validator));
      }
      $ids = json_decode($request->ids);
      CoachReport::whereIn('id', $ids)->update(['coach_submit'=> true]);
      return response([
        'code'  =>  200,
        'message'  =>  'Reports submitted and will be sent to reps'
      ],200);
    }
}
