<?php

namespace App\Http\Controllers\Api\V1\OTCManager;

use App\Helpers\CycleHelper;
use App\Helpers\Setting\ActiveCycleSetting;
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
        $active = new ActiveCycleSetting;
        $active = $active->all();
        $start = $active->start;
        $end = $active->end;
        if(request()->start) {
          $start = request()->start;
        }
        if(request()->end) {
          $end = request()->end;
        }
        $reports = OTCPharmacyReport::with(['user', 'pharmacy']);
        $reports = $this->getRelatedUserData($reports);
        $reports = CycleHelper::getCycleData($reports, 'visit_date',[$start, $end]);
        /* $reports = $reports->get(); */
        $reports = $reports->paginate(1000);
   /*      $reports->data = PharmacyReportResource::collection($reports->data); */
        return PharmacyReportResource::collection($reports);
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
