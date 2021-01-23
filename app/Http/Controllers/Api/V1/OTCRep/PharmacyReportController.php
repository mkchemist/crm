<?php

namespace App\Http\Controllers\Api\V1\OTCRep;

use App\Helpers\CycleHelper;
use App\Helpers\ResponseHelper;
use App\Helpers\Setting\ActiveCycleSetting;
use App\Http\Controllers\Controller;
use App\Http\Resources\OTCRep\PharmacyReportResource;
use App\OTCPharmacyReport;
use App\PharmacyReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class PharmacyReportController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

      $user = Auth::user();
      $reports = OTCPharmacyReport::with(['user', 'pharmacy'])->where('user_id', $user->id);
      $reports = CycleHelper::getCycleData($reports, 'visit_date');
      $reports = $reports->get();
      return response([
        'code'  =>  200,
        'data'  =>  PharmacyReportResource::collection($reports)
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
      $validator = Validator::make($request->all(),[
        'pharmacy'          => 'required',
        'date'              =>  'required|date',
        'general_feedback'  =>  'required',
        'products'          =>  'required|json'
      ]);
      if($validator->fails()) {
        return response(ResponseHelper::validationErrorResponse($validator));
      }
      $user = Auth::user();
      $products = json_decode($request->products);
      foreach($products as $product) {
        OTCPharmacyReport::create([
          'user_id'     =>  $user->id,
          'pharmacy_id' =>  $request->pharmacy,
          'visit_date'  =>  $request->date,
          'type'        =>  'regular',
          'general_feedback'  =>  $request->general_feedback,
          'product'           =>  $product->name,
          'rate'              =>  $product->rate,
          'stock'             =>  $product->stock,
          'order'             =>  $product->order,
          'distributor'       =>  $product->dist,
          'competitor1'       =>  $product->competitors[0]->name,
          'competitor1_rate'  =>  $product->competitors[0]->rate,
          'competitor1_stock'  =>  $product->competitors[0]->stock,
          'competitor2'        => isset($product->competitors[1]) ? $product->competitors[1]->name : null,
          'competitor2_rate'        => isset($product->competitors[1]) ? $product->competitors[1]->rate : null,
          'competitor2_stock'        => isset($product->competitors[1]) ? $product->competitors[1]->stock : null,
          'competitor3'        => isset($product->competitors[2]) ? $product->competitors[2]->name : null,
          'competitor3_rate'        => isset($product->competitors[2]) ? $product->competitors[2]->rate : null,
          'competitor3_stock'        => isset($product->competitors[2]) ? $product->competitors[2]->stock : null,
        ]);
      }
      return response([
        'code'  =>  200,
        'message' =>  'Report added'
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
        //
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
}
