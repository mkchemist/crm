<?php

namespace App\Http\Controllers\Api\V1\Rep;

use App\Http\Controllers\Controller;
use App\Pharmacy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PharmacyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $pharmacies = Pharmacy::where([
        'area'  =>  Auth::user()->area
      ])->orderBy('name', 'asc')->get();

      return response()->json([
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
      $validator = Validator::make($request->all(), [
        'name'  =>  'required',
        'type'  =>  'required',
        'brick' =>  'required'
      ]);
      if($validator->fails()) {
        return response()->json([
          'code'  =>  400,
          'data'  =>  $validator->errors()
        ]);
      }
      $pharmacy = $this->getPharmacy([
        'name'  =>  $request->name,
        'type'  =>  $request->type,
        'brick' =>  $request->brick
      ]);
      if(!$pharmacy) {
        return response()->json([
          'code'  =>  302,
          'data'  =>  [
            'errors'  => [
              sprintf('Pharmacy %s is already exists', $request->name)
            ]
          ]
        ]);
      }

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


    private function getPharmacy($condition)
    {
      $pharmacy = Pharmacy::where($condition)->first();
      return $pharmacy;
    }
}
