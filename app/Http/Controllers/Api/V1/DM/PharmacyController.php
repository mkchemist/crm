<?php

namespace App\Http\Controllers\Api\V1\DM;

use App\Helpers\ResponseHelper;
use App\Helpers\Traits\UserWithAssignment;
use App\Http\Controllers\Controller;
use App\Pharmacy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PharmacyController extends Controller
{
  use UserWithAssignment;

  public $user;


  public function __construct()
  {
    $this->middleware(function($request, $next) {
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
      $pharmacies = Pharmacy::with(['report'])->where('state', 'approved');
      $pharmacies = $this->getQueryWithAssignment($this->user, $pharmacies);
      $pharmacies = $pharmacies->get();
      return response([
        'code'  =>  201,
        'data'  =>  $pharmacies
      ], 201);
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
        if(!is_numeric($id)) {
          return response(ResponseHelper::BAD_REQUEST_INPUT);
        }
        $pharmacy = Pharmacy::with(['report', 'report.user'])->where([
          'id'  =>  $id,
          'state' => 'approved'
        ]);
        $pharmacy = $this->getQueryWithAssignment($this->user, $pharmacy);
        $pharmacy = $pharmacy->first();

        if(!$pharmacy)  {
          return response(ResponseHelper::INVALID_ID);
        }

        return response([
          'code'  =>  200,
          'data'  =>  $pharmacy
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
