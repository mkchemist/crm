<?php

namespace App\Http\Controllers\Api\V1\OTCRep;

use App\Helpers\CycleHelper;
use App\Helpers\ResponseHelper;
use App\Helpers\Setting\ReportIntervalSetting;
use App\Helpers\Traits\UserWithAssignment;
use App\Http\Controllers\Controller;
use App\Http\Resources\OTCRep\PharmacyReportResource;
use App\OTCPharmacyReport;
use App\Pharmacy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PharmacyReportController extends Controller
{

    use UserWithAssignment;

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

        $user = Auth::user();
        $reports = OTCPharmacyReport::with(['user', 'pharmacy'])->where('user_id', $user->id);
        if(request()->start && request()->end) {
          $reports = $reports->whereBetween('visit_date', [request()->start, request()->end]);
        } else {

          $reports = CycleHelper::getCycleData($reports, 'visit_date');
        }
        $reports = $reports->get();
        return response([
            'code' => 200,
            'data' => PharmacyReportResource::collection($reports),
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
            'pharmacy' => 'required',
            'date' => 'required|date',
            'products' => 'required|json',
        ]);
        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }
        $user = Auth::user();
        $products = json_decode($request->products);
        foreach ($products as $product) {
            OTCPharmacyReport::create([
                'user_id' => $user->id,
                'pharmacy_id' => $request->pharmacy,
                'visit_date' => $request->date,
                'type' => $request->type,
                'product_type' => $product->product_type,
                'general_feedback' => $request->general_feedback ?? '',
                'product' => $product->name,
                'rate' => $product->rate,
                'stock' => $product->stock,
                'order' => $product->order,
                'distributor' => $product->dist,
                'competitor1' => $product->competitors[0]->name,
                'competitor1_rate' => $product->competitors[0]->rate,
                'competitor1_stock' => $product->competitors[0]->stock,
                'competitor1_type' => $product->competitors[0]->type,
                'competitor2' => isset($product->competitors[1]) ? $product->competitors[1]->name : null,
                'competitor2_rate' => isset($product->competitors[1]) ? $product->competitors[1]->rate : null,
                'competitor2_stock' => isset($product->competitors[1]) ? $product->competitors[1]->stock : 0,
                'competitor2_type' => isset($product->competitors[1]) ? $product->competitors[1]->type : null,
                'competitor3' => isset($product->competitors[2]) ? $product->competitors[2]->name : null,
                'competitor3_rate' => isset($product->competitors[2]) ? $product->competitors[2]->rate : null,
                'competitor3_stock' => isset($product->competitors[2]) ? $product->competitors[2]->stock : 0,
                'competitor3_type' => isset($product->competitors[2]) ? $product->competitors[2]->type : null,
                'comment' => $request->comment ?? '',
            ]);
        }
        return response([
            'code' => 200,
            'message' => 'Report added',
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
            return response(ResponseHelper::BAD_REQUEST_INPUT);
        }

        $report = OTCPharmacyReport::with(['pharmacy'])->where([
            'user_id' => $this->user->id,
            'id' => $id,
        ])->first();

        if (!$report) {
            return response(ResponseHelper::INVALID_ID);
        }

        return response([
            'code' => 200,
            'data' => $report,
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
            'visit_date' => 'required|date',
            'product' => 'required|string',
            'rate' => 'required|string',
            'competitor1' => 'required|string',
            'competitor1_rate' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }

        if (!is_numeric($id)) {
            return response(ResponseHelper::BAD_REQUEST_INPUT);
        }

        $report = OTCPharmacyReport::where([
            'user_id' => $this->user->id,
            'id' => $id,
        ])->first();

        if (!$report) {
            return response(ResponseHelper::INVALID_ID);
        }

        $reportInterval = new ReportIntervalSetting;
        if ($reportInterval->canEditReportDate()) {
            $report->visit_date = $request->visit_date;
        }
        $report->product = $request->product;
        $report->stock = $request->stock;
        $report->rate = $request->rate;
        $report->order = $request->order;
        $report->product_type = $request->product_type;
        $report->distributor = $request->dist;
        $report->competitor1 = $request->competitor1;
        $report->competitor1_rate = $request->competitor1_rate;
        $report->competitor1_stock = $request->competitor1_stock;
        $report->competitor1_type = $request->competitor1_type;
        $report->competitor2 = (integer) $request->competitor2 ? $request->competitor2 : null;
        $report->competitor2_rate = (integer) $request->competitor2_rate ? $request->competitor2_rate : null;
        $report->competitor2_stock = (integer) $request->competitor2_stock ? $request->competitor2_stock : 0;
        $report->competitor2_type = (integer) $request->competitor2_type ? $request->competitor2_type : null;
        $report->competitor3 = (integer) $request->competitor3 ? $request->competitor3 : null;
        $report->competitor3_rate = (integer) $request->competitor3_rate ? $request->competitor3_rate : null;
        $report->competitor3_stock = (integer) $request->competitor3_stock ? $request->competitor3_stock : 0;
        $report->competitor3_type = (integer) $request->competitor3_type ? $request->competitor3_type : null;
        if ($request->comment) {
            $report->comment = $request->comment;
        }
        $report->save();
        return response([
            'code' => 200,
            'date' => $report,
            'message' => 'Report Updated',
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
        $report = OTCPharmacyReport::where([
            'id' => $id,
            'user_id' => $this->user->id,
        ])->delete();

        return response([
            'code' => 200,
            'message' => 'Report deleted',
        ]);
    }

    public function coverageReport()
    {
      $coverage = DB::table('pharmacies as p')
      ->select(
        'u.name as rep',
        'p.brick AS brick',
        DB::raw('COUNT(DISTINCT r.visit_date) as coverage')
      )->join('otc_pharmacy_reports as r','r.pharmacy_id', '=', 'p.id')
      ->join('users as u','u.id','=','r.user_id')
      ->where('r.user_id', $this->user->id)
      ->where('r.type','regular');
      $coverage=$coverage->groupBy('rep','brick')->get();
      return response([
        'data'  =>  $coverage,
        'code'  =>  200
      ]);
    }
}
