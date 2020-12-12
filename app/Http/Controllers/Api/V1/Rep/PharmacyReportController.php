<?php

namespace App\Http\Controllers\Api\V1\Rep;

use App\Helpers\ResponseHelper;
use App\Helpers\Setting\ActiveCycleSetting;
use App\Http\Controllers\Controller;
use App\PharmacyReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\RepPharmacyReportResource as PharmacyReportResource;

class PharmacyReportController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $cycle = new ActiveCycleSetting;
      $date = $cycle->all();
      if($date) {
        $visits = PharmacyReport::with(['pharmacy'])
        ->where([
          'user_id' =>  Auth::user()->id
        ])->whereBetween('visit_date', [$date->start, $date->end])
        ->orderBy('visit_date')->get();

      } else {
        $visits = PharmacyReport::with(['pharmacy'])
        ->where([
          'user_id' =>  Auth::user()->id
        ])->orderBy('visit_date')->get();
      }

      return response()->json([
        'code'  =>  201,
        'data'  =>  PharmacyReportResource::collection($visits)
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
        'date'  =>  'required|date',
        'pharmacy_id' =>  'required|numeric',
        'general_feedback'  =>  'required|string',
        'products'  =>  'required|string'
      ]);

      if($validator->fails()) {
        return response()->json(ResponseHelper::validationErrorResponse($validator));
      }

      $check = $this->getVisitByPharmacyId($request->pharmacy_id, $request->date);

      if($check) {
        return response()->json(ResponseHelper::ITEM_ALREADY_EXIST);
      }

      $visit = PharmacyReport::create([
        'user_id' =>  Auth::user()->id,
        'pharmacy_id' => $request->pharmacy_id,
        'visit_date'  =>  $request->date,
        'products'    =>  $request->products,
        'general_feedback'     => $request->general_feedback
      ]);


      return response()->json([
        'code'  =>  201,
        'data'  =>  $visit
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
        return response()->json(ResponseHelper::BAD_REQUEST_INPUT);
      }

      $visit = $this->getVisitById($id);
      if(!$visit) {
        return response()->json(ResponseHelper::INVALID_ID);
      }

      return response()->json([
        'code'  =>  201,
        'data'  =>  new PharmacyReportResource($visit)
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
      if(!is_numeric($id)) {
        return response()->json(ResponseHelper::BAD_REQUEST_INPUT);
      }

      $visit = $this->getVisitById($id);
      if(!$visit) {
        return response()->json(ResponseHelper::INVALID_ID);
      }

      $check = $this->getVisitByPharmacyId($visit->pharmacy_id, $request->date);
      if($check && $check->visit_date !== $visit->visit_date) {
        return response()->json(ResponseHelper::ITEM_ALREADY_EXIST);
      }

      $visit->visit_date = $request->date;
      $visit->products = $request->products;
      $visit->general_feedback = $request->general_feedback;
      $visit->save();
      return response()->json([
        'code'  =>  201,
        'data'  =>  sprintf('Report of pharmacy %s updated successfully', $visit->pharmacy->name)
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
      $report = PharmacyReport::where([
        'id'  =>  $id,
        'user_id' =>  $user->id
      ])->first();
      $report->delete();
      return response([
        'code'  =>  200,
        'message' =>  'Pharmacy report deleted'
      ]);
    }

    /**
     * get visit by pharmacy id and date
     *
     * @param integer $id
     * @param string $date
     * @return PharmacyReport|null
     */
    private function getVisitByPharmacyId(int $id, string $date)
    {
      $visit = PharmacyReport::where([
        'user_id' =>  Auth::user()->id,
        'pharmacy_id' =>  $id,
        'visit_date'  =>  $date
      ])->first();
      return $visit;
    }

    /**
     * get visit by ID
     *
     * @param integer $id
     * @return PharmacyReport|null
     */
    private function getVisitById(int $id)
    {
      $visit = PharmacyReport::where([
        'user_id' =>  Auth::user()->id,
        'id'      =>  $id
      ])->first();
      return $visit;
    }
}
