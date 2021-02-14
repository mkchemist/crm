<?php

namespace App\Http\Controllers\Api\V1;

use App\CustomerReport;
use App\Helpers\ResponseHelper;
use App\Helpers\Setting\ReportIntervalSetting;
use App\Http\Controllers\Controller;
use App\PharmacyReport;
use Facade\FlareClient\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class SingleVisitsController extends Controller
{

    protected $user;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = Auth::user();
            return $next($request);
        });
    }

    public function pmSingleVisit(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'required|int',
            'date' => 'required|date',
            'products' => 'required|json',
        ]);

        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }

        $reportInterval = new ReportIntervalSetting;

        if (!$reportInterval->isValidDateInterval($request->date)) {
            return response(ResponseHelper::InvalidDateRange($request->date, $reportInterval->all()));
        }

        $report = CustomerReport::where([
            'user_id' => $this->user->id,
            'customer_id' => $request->customer_id,
            'visit_date' => $request->date,
        ])->first();

        if ($report) {
            return response(ResponseHelper::ITEM_ALREADY_EXIST);
        }

        CustomerReport::create([
            'customer_id' => $request->customer_id,
            'visit_date' => $request->date,
            'user_id' => $this->user->id,
            'products' => $request->products,
            'general_feedback' => $request->feedback,
            'comment' => $request->comment,
        ]);

        return response([
            'code' => 200,
            'message' => 'Report Added Successfully',
        ]);
    }

    public function pharmacySingleVisit(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pharmacy_id' => 'required|int',
            'date' => 'required|date',
            'products' => 'required|json',
            'feedback'  =>  'required|string'
        ]);

        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }

        $reportInterval = new ReportIntervalSetting;

        if (!$reportInterval->isValidDateInterval($request->date)) {
            return response(ResponseHelper::InvalidDateRange($request->date, $reportInterval->all()));
        }


        $report = PharmacyReport::where([
          'user_id' =>  $this->user->id,
          'pharmacy_id' =>  $request->pharmacy_id,
          'visit_date'  =>  $request->date,
        ])->first();
        if ($report) {
            return response(ResponseHelper::ITEM_ALREADY_EXIST);
        }


        PharmacyReport::create([
          'pharmacy_id' =>  $request->pharmacy_id,
          'visit_date'  =>  $request->date,
          'user_id'     =>  $this->user->id,
          'products'    =>  $request->products,
          'general_feedback'  =>  $request->feedback
        ]);
        return response([
            'code' => 200,
            'message' => 'Report Added Successfully',
        ]);
    }


    public function editSinglePharmacyVisit(Request $request,$id)
    {
      $validator = Validator::make($request->all(), [
        'general_feedback' => 'required|string',
        'products'         => 'required|json',
        'visit_date'       => 'required|date'
      ]);
      if($validator->fails()) {
        return response(ResponseHelper::validationErrorResponse($validator));
      }

      $user = Auth::user();
      PharmacyReport::updateOrCreate([
        'id'  =>  $id,
        'user_id' =>  $user->id
      ],[
        'visit_date'  =>  $request->visit_date,
        'products'    =>  $request->products,
        'general_feedback'  =>  $request->general_feedback
      ]);

      return response([
        'code'  =>  200,
        'message' =>  'Report Updated'
      ]);
    }
}
