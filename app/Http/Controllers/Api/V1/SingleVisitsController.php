<?php

namespace App\Http\Controllers\Api\V1;

use App\CustomerReport;
use App\Helpers\ResponseHelper;
use App\Helpers\Setting\ActiveCycleSetting;
use App\Helpers\Setting\ReportIntervalSetting;
use App\Http\Controllers\Controller;
use App\PharmacyReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SingleVisitsController extends Controller
{

    /**
     * current auth user
     *
     * @var User
     */
    protected $user;

    /**
     * SingleVisitController constructor
     *
     */
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = Auth::user();
            $this->cycle = (new ActiveCycleSetting)->all();
            return $next($request);
        });
    }

    /**
     * get user sub-ordinate
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

    /**
     * read all reports
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $type = request()->collection_type;

      if($type) {
        return $this->singlePharmacyCollection();
      } else {
        return $this->singlePMCollection();
      }
    }


    private function singlePMCollection()
    {
      $list = CustomerReport::with([
        'customer' => function($query) {
          $query->select(
            'name', 'specialty','area', 'brick', 'district',
            'address','territory','id'
          );
        }
        ,'user' => function($query) {
          $query->select('name', 'line', 'role','id', 'user_relations');
        },
        'customer.params' => function($query) {
          $query->select('current','customer_id', 'user_id');
        }
      ])
      ->whereIn('user_id', $this->subOrdinate())
     /*  ->whereBetween('visit_date', [$this->cycle->start, $this->cycle->end]) */
      ->get([
        'comment','user_id','customer_id','visit_date','products',
        'general_feedback','id'
      ]);

      return response([
        'code'  =>  200,
        'data' => $list
      ], 200);
    }


    private function singlePharmacyCollection()
    {

    }



    /**
     * show request
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show(int $id)
    {
      if(request()->collection_type) {
        $report = PharmacyReport::with(['pharmacy', 'user'])
        ->where('id', $id)->first();
      } else {
        $report = CustomerReport::with(['customer', 'user'])
        ->where('id', $id)->first();
      }

      return response([
        "code"  =>  200,
        'data'  =>  $report
      ]);
    }

    /**
     * update single visit
     *
     * @param \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function updatePMSingleVisit(Request $request, int $id)
    {
      return response($request->all());
    }

    /**
     * add pm single visit
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
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
            return response(ResponseHelper::InvalidDateRange(
              $request->date, $reportInterval->all()
            ));
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

    /**
     * add pharmacy single visit
     *
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function pharmacySingleVisit(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pharmacy_id' => 'required|int',
            'date' => 'required|date',
            'products' => 'required|json',
            'feedback' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }

        $reportInterval = new ReportIntervalSetting;

        if (!$reportInterval->isValidDateInterval($request->date)) {
            return response(ResponseHelper::InvalidDateRange($request->date, $reportInterval->all()));
        }

        $report = PharmacyReport::where([
            'user_id' => $this->user->id,
            'pharmacy_id' => $request->pharmacy_id,
            'visit_date' => $request->date,
        ])->first();
        if ($report) {
            return response(ResponseHelper::ITEM_ALREADY_EXIST);
        }

        PharmacyReport::create([
            'pharmacy_id' => $request->pharmacy_id,
            'visit_date' => $request->date,
            'user_id' => $this->user->id,
            'products' => $request->products,
            'general_feedback' => $request->feedback,
        ]);
        return response([
            'code' => 200,
            'message' => 'Report Added Successfully',
        ]);
    }

    /**
     * edit pharmacy single visit
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function editSinglePharmacyVisit(Request $request, int $id)
    {
        $validator = Validator::make($request->all(), [
            'general_feedback' => 'required|string',
            'products' => 'required|json',
            'visit_date' => 'required|date',
        ]);
        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }

        $user = Auth::user();
        PharmacyReport::updateOrCreate([
            'id' => $id,
            'user_id' => $user->id,
        ], [
            'visit_date' => $request->visit_date,
            'products' => $request->products,
            'general_feedback' => $request->general_feedback,
        ]);

        return response([
            'code' => 200,
            'message' => 'Report Updated',
        ]);
    }
}
