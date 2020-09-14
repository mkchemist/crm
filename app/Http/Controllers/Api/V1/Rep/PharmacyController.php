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
    if ($validator->fails()) {
      return response()->json([
        'code'  =>  400,
        'data'  =>  $validator->errors()
      ]);
    }
    $check = $this->getPharmacy([
      'name'  =>  $request->name,
      'type'  =>  $request->type,
      'brick' =>  $request->brick
    ]);
    if ($check) {
      return response()->json([
        'code'  =>  302,
        'data'  =>  [
          'errors'  => [
            sprintf('Pharmacy %s is already exists', $check->name)
          ]
        ]
      ]);
    }
    $user = Auth::user();
    $pharmacy = Pharmacy::create(array_merge($request->all(), [
      'area'  => $user->area,
      'district'  =>  $user->district,
      'territory' =>  $user->territory,
      'region'    =>  $user->region
    ]));

    return response()->json([
      'code'  =>  201,
      'data'  =>  $pharmacy
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
    if(!is_numeric($id)) {
      return response()->json([
        'code'  =>  400,
        'data'  =>  [
          'errors'  =>  [
            'Bad Request Input',
            'Pharmacy Id must be number'
          ]
        ]
      ]);
    }
    $pharmacy = $this->getPharmacy([
      'id'  =>  $id,
      'area'  =>  Auth::user()->area
    ]);
    if(!$pharmacy) {
      return response()->json([
        'code'  =>  302,
        'data'  =>  [
          'errors'  =>  [
            'Pharmacy Id is not valid'
          ]
        ]
      ]);
    }
    return response()->json([
      'code'  =>  201,
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
    $validator = Validator::make($request->all(), [
      'type'  =>  'required',
      'brick' =>  'required'
    ]);
    if($validator->fails()) {
      return response()->json([
        'code'  =>  400,
        'data'  =>  $validator->errors()
      ]);
    }
    if(!is_numeric($id)) {
      return response()->json([
        'code'  =>  400,
        'data'  =>  [
          'errors'  =>  [
            'Bad Request Input',
            'Pharmacy Id must be number'
          ]
        ]
      ]);
    }
    $pharmacy = $this->getPharmacy([
      'id'  =>  $id,
      'area'  =>  Auth::user()->area
    ]);
    if(!$pharmacy) {
      return response()->json([
        'code'  =>  302,
        'data'  =>  [
          'errors'  =>  [
            'Pharmacy Id is not valid'
          ]
        ]
      ]);
    }
    $pharmacy->type = $request->type;
    $pharmacy->key_person = $request->key_person;
    $pharmacy->address = $request->address;
    $pharmacy->brick = $request->brick;
    $pharmacy->save();
    return response()->json([
      'code'  =>  201,
      'data'  =>  $pharmacy
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
    //
  }


  private function getPharmacy($condition)
  {
    $pharmacy = Pharmacy::where($condition)->first();
    return $pharmacy;
  }
}
