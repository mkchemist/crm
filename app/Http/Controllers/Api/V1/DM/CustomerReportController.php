<?php

namespace App\Http\Controllers\Api\V1\DM;

use App\CustomerReport;
use App\Helpers\ResponseHelper;
use App\Helpers\Setting\ActiveCycleSetting;
use App\Helpers\Setting\ReportIntervalSetting;
use App\Http\Controllers\Controller;
use App\Http\Resources\DM\CustomerReportResource;
use App\Planner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CustomerReportController extends Controller
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
        $reps = $relations->reps ?? [];
        $reps[] = $user->id;
        $activeCycle = new ActiveCycleSetting;
        $activeCycle = $activeCycle->all();
        $start = $activeCycle->start;
        $end = $activeCycle->end;
        if(request()->start) {
          $start = request()->start;
        }
        if(request()->end) {
          $end = request()->end;
        }
        $reports = CustomerReport::with([
            'customer', 'user', 'customer.params', 'coach', 'customer.planner', 'customer.report', 'coach2',
        ])->whereIn('user_id', $reps);
        if ($activeCycle) {
            $reports = $reports->whereBetween('visit_date', [$start, $end]);
        }
        $reports = $reports->get();

        return response([
            'code' => 200,
            'data' => CustomerReportResource::collection($reports),
            'reps' => $reps,
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
        /* return response($request->all()); */

        $validator = Validator::make($request->all(), [
            'customer' => 'required|numeric',
            'date' => 'required|date',
            'visit_type' => 'required',
        ]);

        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }

        $user = Auth::user();

        $report = CustomerReport::create([
            'customer_id' => $request->customer,
            'user_id' => $user->id,
            'visit_date' => $request->date,
            'comment' => $request->comment,
            'general_feedback' => $request->feedback,
            'visit_type' => $request->visit_type,
            'products' => $request->products,
        ]);

        return response([
            'code' => 200,
            'data' => $report,
            'message' => "Report submitted successfully",
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
      $user = Auth::user();
      $report = CustomerReport::with('customer')->where([
        'user_id' => $user->id,
        'id'      =>  $id
      ])->first();

      if(!$report) {
        return response(ResponseHelper::INVALID_ID);
      }

      return response([
        'code'  =>  200,
        'data'  =>  $report
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
        'visit_date' => 'required',
        'visit_type'  =>  'required'
      ]);

      if($validator->fails()) {
        return response(ResponseHelper::validationErrorResponse($validator));
      }

      $user =Auth::user();

      $report = CustomerReport::where([
        'id'  =>  $id,
        'user_id' =>  $user->id
      ])->first();

      if(!$report) {
        return response(ResponseHelper::INVALID_ID);
      }
      $reportInterval = new ReportIntervalSetting;
      if($reportInterval->canEditReportDate()) {
        if(!$reportInterval->isValidDateInterval($request->visit_date)) {
          return response(ResponseHelper::InvalidDateRange($request->visit_date, $reportInterval->all()));
        }
        if(!$reportInterval->isBeforeToday($request->visit_date)) {
          return response(ResponseHelper::InvalidDayRange());
        }
        $report->visit_type = $request->visit_type;
      }
      $report->visit_date = $request->visit_date;
      $report->products = $request->products;
      $report->comment = $request->comment;
      $report->general_feedback = $request->general_feedback;
      $report->save();

      return response([
        'code'  =>  200,
        'message' =>  'Report Updated'
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
        $user = Auth::user();
        CustomerReport::where([
          'user_id' =>  $user->id,
          'id'      =>  $id
        ])->delete();
        return response([
          'code'  =>  200,
          'message' =>  'Report Deleted'
        ]);
    }


}
