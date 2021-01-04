<?php

namespace App\Http\Controllers\Api\V1\Rep;

use App\CoachReport;
use App\CustomerReport;
use App\Helpers\ResponseHelper;
use App\Helpers\Setting\ActiveCycleSetting;
use App\Helpers\Setting\ReportIntervalSetting;
use App\Http\Controllers\Controller;
use App\Http\Resources\RepReportResource as ReportResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $activeCycle = new ActiveCycleSetting;
        $activeCycle = $activeCycle->all();
        $visits = CustomerReport::with([
            'customer', 'customer.params', 'customer.frequency', 'customer.planner', 'user', 'coach', 'coach2',
        ])
            ->where(['user_id' => Auth::user()->id]);
        if ($activeCycle) {
            $visits = $visits->whereBetween('visit_date', [$activeCycle->start, $activeCycle->end]);

        }
        $visits = $visits->get();
        return response()->json([
            'code' => 201,
            'data' => ReportResource::collection($visits),
            'cycle' => $activeCycle,
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
            'customer' => 'required',
            'date' => 'required|date',
            'products' => 'string',
        ]);

        if ($validator->fails()) {
            return response()->json(ResponseHelper::validationErrorResponse($validator));
        }
        $interval = new ReportIntervalSetting;
        if (!$interval->isBeforeToday($request->date)) {
            return response(ResponseHelper::dateAfterTodayError());
        }
        if (!$interval->isValidDateInterval($request->date)) {
            return response(ResponseHelper::InvalidDateRange($request->date, $interval->all()));
        }
        $check = $this->getVisitByCustomerIdAndDate($request->customer, $request->date);
        if ($check) {
            return response()->json(ResponseHelper::ITEM_ALREADY_EXIST);
        }
        $user = Auth::user();
        CustomerReport::create([
            'customer_id' => $request->customer,
            'user_id' => $user->id,
            'visit_date' => $request->date,
            'visit_type'  =>  $request->visit_type,
            'dual_with' => $request->dual_with,
            'coach2_id' => $request->coach2_id,
            'comment' => $request->comment,
            'products' => $request->products,
            'general_feedback' => $request->general_feedback,
        ]);

        if ($request->dual_with) {
            $this->createCoachReport($user->id, $request->dual_with, $request->date, $request->customer);
        }

        if ($request->coach2_id) {
            $this->createCoachReport($user->id, $request->coach2_id, $request->date, $request->customer);
        }

        return response()->json([
            'code' => 201,
            'data' => 'New visit added successfully',
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
        if (!is_numeric($id)) {
            return response()->json(ResponseHelper::BAD_REQUEST_INPUT);
        }
        $visit = $this->getVisitById($id);
        if (!$visit) {
            return response()->json(ResponseHelper::INVALID_ID);
        }
        return response()->json([
            'code' => 201,
            'data' => new ReportResource($visit),
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

        if (!is_numeric($id)) {
            return response()->json(ResponseHelper::BAD_REQUEST_INPUT);
        }

        $validator = Validator::make($request->all(), [
            'date' => 'required|date',
            'products' => 'string',
        ]);

        if ($validator->fails()) {
            return response()->json(ResponseHelper::validationErrorResponse($validator));
        }
        $visit = $this->getVisitById($id);

        if (!$visit) {
            return response()->json(ResponseHelper::INVALID_ID);
        }
        $user = Auth::user();
        if($request->dual_with) {
          $this->handleEditVisitCoach($visit,'dual_with',$user->id,$request->dual_with, $visit->visit_date,$visit->customer_id);
        }
        if($request->coach2_id) {

          $this->handleEditVisitCoach($visit,'coach2_id',$user->id,$request->coach2_id, $visit->visit_date,$visit->customer_id);
        }
        $visit->dual_with = $request->dual_with;
        $visit->visit_type  =  $request->visit_type;
        $visit->coach2_id = $request->coach2_id;
        $visit->comment = $request->comment;
        $visit->products = $request->products;
        $visit->general_feedback = $request->general_feedback;
        $visit->save();
        return response()->json([
            'code' => 201,
            'data' => 'visit updated successfully',
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
        CustomerReport::destroy($id);
        return response([
            'code' => 200,
            'message' => 'Report removed',
        ], 200);
    }

    /**
     * get visit by customer Id and date
     *
     * @param integer $id
     * @param string $date
     * @return CustomerReport|Null
     */
    private function getVisitByCustomerIdAndDate(int $id, string $date)
    {
        $visit = CustomerReport::where([
            'customer_id' => $id,
            'visit_date' => $date,
            'user_id' => Auth::user()->id,
        ])->first();
        return $visit;
    }

    /**
     * get visit by id
     *
     * @param integer $id
     * @return CustomerReport|Null
     */
    private function getVisitById(int $id)
    {
        $visit = CustomerReport::where([
            'id' => $id,
            'user_id' => Auth::user()->id,
        ])->first();
        return $visit;
    }

    /**
     * create coach report
     *
     *
     * @param int $user [user id]
     * @param int $coach [coach id]
     * @param string $date [visit date]
     * @param int $customer [customer id]
     */
    private function createCoachReport( $user,$coach, $date, $customer)
    {
        $check = CoachReport::where([
            'rep_id' => $user,
            'coach_id' => $coach,
            'visit_date' => $date,
            'customer_id' => $customer,
        ])->first();
        if (!$check) {
            CoachReport::create([
                'rep_id' => $user,
                'coach_id' => $coach,
                'visit_date' => $date,
                'customer_id' => $customer,
                'data' => '',
            ]);
        }
    }

    /**
     * handle coach report for edited visit
     *
     *
     * @param CustomerReport $visit
     * @param string $type
     * @param int $user [user id]
     * @param int $coach [coach id]
     * @param string $date [visit date]
     * @param int $customer [customer id]
     */
    private function handleEditVisitCoach($visit,$type ,$user, $coach, $date, $customer)
    {
      $coach_check = CoachReport::where([
        'rep_id'  =>  $user,
        'coach_id' => $visit->$type,
        'visit_date'  =>  $date,
        'customer_id' =>  $customer
      ])->first();
      if(!$coach_check) {
        $this->createCoachReport($user, $coach, $date, $customer);
      } else if($visit->$type && !$coach) {
        $coach_check->delete();
      } else {
        if($visit->$type !== $coach) {
          $coach_check->delete();
        }
        $this->createCoachReport($user, $coach, $date, $customer);
      }




    }
}
