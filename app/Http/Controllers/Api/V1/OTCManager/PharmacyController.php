<?php

namespace App\Http\Controllers\Api\V1\OTCManager;

use App\Customer;
use App\Helpers\Traits\UserWithAssignment;
use App\Http\Controllers\Controller;
use App\Pharmacy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PharmacyController extends Controller
{
    use UserWithAssignment;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $user = Auth::user();
      $pharmacies = Pharmacy::query();
      $pharmacies = $this->getQueryWithAssignment($user,$pharmacies);
      $pharmacies = $pharmacies->get([
        'id','name','type',
        'key_person', 'address', 'brick','area',
        'district', 'territory'
      ]);
      return response([
        'code'  =>  200,
        'data'  => $pharmacies
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

      if(!is_numeric($id)) {
        return response([
          'code'  =>  204,
          'message' => 'Pharmacy ID must be a number'
        ]);
      }

      $user = Auth::user();
      $pharmacy = Pharmacy::with('otcReport')->where('id', $id);
      $pharmacy = $this->getQueryWithAssignment($user, $pharmacy);
      $pharmacy = $pharmacy->first();

      if(!$pharmacy) {
        return response([
          'code'  =>  204,
          'message' =>  'Pharmacy ID is not valid or you don\'t have a pharmacy list'
        ]);
      }

      return response([
          'code'  =>  200,
          'data'  =>  $pharmacy,
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
