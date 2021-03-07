<?php

namespace App\Http\Controllers\Api\V1\OTCManager;

use App\Helpers\CycleHelper;
use App\Helpers\Traits\CustomData;
use App\Http\Controllers\Controller;
use App\Http\Resources\OTCRep\PharmacyReportResource;
use App\OTCPharmacyReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PharmacyReportController extends Controller
{

    use CustomData;

    protected $user;


    public function __construct()
    {
      $this->middleware(function($request, $next) {
        $this->use = Auth::user();

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
        $reports = OTCPharmacyReport::with(['user', 'pharmacy']);
        $reports = $this->getRelatedUserData($reports);
        //$reports = CycleHelper::getCycleData($reports, 'visit_date');
        $reports = $reports->get([
          'id','name','type',
          'key_person', 'address', 'brick','area',
          'district', 'territory'
        ]);

        return response([
          'code'  =>  200,
          'data'  =>   PharmacyReportResource::collection($reports)
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
        //
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
