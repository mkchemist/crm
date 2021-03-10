<?php

namespace App\Http\Controllers\Api\V1;

use App\CustomerReport;
use App\Helpers\ResponseHelper;
use App\Helpers\Setting\ReportIntervalSetting;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CustomerSingleVisitController extends Controller
{
    /**
     * Auth user
     *
     * @var User
     */
    protected $user;

    /**
     * report interval
     *
     * @var ReportIntervalSetting
     */
    protected $interval;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = Auth::user();
            $this->interval = new ReportIntervalSetting;
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
        $list = CustomerReport::with([
            'customer' => function ($query) {
                $query->select(
                    'name', 'specialty', 'area', 'brick', 'district',
                    'address', 'territory', 'id'
                );
            }
            , 'user' => function ($query) {
                $query->select('name', 'line', 'role', 'id', 'user_relations');
            },
            'customer.params' => function ($query) {
                $query->select('current', 'customer_id', 'user_id');
            },
        ])
            ->whereIn('user_id', $this->subOrdinate())
        /*  ->whereBetween('visit_date', [$this->cycle->start, $this->cycle->end]) */
            ->get([
                'comment', 'user_id', 'customer_id', 'visit_date', 'products',
                'general_feedback', 'id',
            ]);

        return response([
            'code' => 200,
            'data' => $list,
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
        $validator = Validator::make($request->all(), [
            'customer_id' => 'required|numeric',
            'date' => 'required|date',
            'products' => 'required|json',
        ]);
        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }

        if (!$this->interval->isValidDateInterval($request->date)) {
            return response(ResponseHelper::InvalidDateRange(
                $request->date, $this->interval->all()
            ));
        }

        $report = $this->isExists($request->customer_id, $request->date);

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

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $report = CustomerReport::with(['customer', 'user'])
            ->where('user_id', $this->user->id)
            ->where('id', $id)->first();

        return response([
            'code' => 200,
            'data' => $report,
        ], 200);
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
            'products' => 'required|json',
        ]);
        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }
        if (!$this->interval->isValidDateInterval($request->date)) {
            return response(ResponseHelper::InvalidDateRange(
                $request->date, $this->interval->all()
            ));
        }
        $report = $this->isExists($request->date, null, $id);

        if (!$report) {
            return response(ResponseHelper::INVALID_ID);
        }
        $report->products = $request->products;
        $report->comment = $request->comment;
        $report->general_feedback = $request->feedback;
        if ($this->interval->canEditReportDate()) {
            $report->visit_date = $request->date;
        }
        $report->save();

        return response([
          'code'  =>  200,
          'message' =>  'Report Updated'
        ], 200);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $report = $this->isExists(null, null, $id);
        if(!$report) {
          return response(ResponseHelper::INVALID_ID);
        }
        $report->delete();
        return response([
          'code'  =>  200,
          'message' =>  'Report Deleted'
        ], 200);
    }

    /**
     * check if the report exists
     *
     * @param string $date [report date]
     * @param int $customer [customer id]
     * @param int $id [report id]
     * @return CustomerReport|Null
     */
    private function isExists( $date = null, $customer = null,  $id = null)
    {
        $report = CustomerReport::where([
            'user_id' => $this->user->id,
        ]);
        if($date) {
          $report  = $report->where('visit_date', $date);
        }
        if ($customer) {
            $report = $report->where('customer_id', $customer);
        }
        if ($id) {
            $report = $report->where('id', $id);
        }
        $report = $report->first();

        return $report;
    }

    /**
     * get current user sub-ordinate
     *
     * @return array
     */
    private function subOrdinate():array
    {
      $users = [$this->user->id];
      $relations = json_decode($this->user->user_relations);
      switch ($this->user->role) {
        case 'rm':
          $users = array_merge($users, $relations->am, $relations->dm);
          break;
        case 'am' :
          $users = array_merge($users, $relations->dm);
          break;
        default:
          break;
      }
      return $users;
    }
}
