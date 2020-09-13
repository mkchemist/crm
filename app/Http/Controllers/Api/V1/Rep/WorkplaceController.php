<?php

namespace App\Http\Controllers\Api\V1\Rep;

use App\Http\Controllers\Controller;
use App\Workplace;
use App\Http\Resources\RepWorkplaceResource as WorkplaceResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class WorkplaceController extends Controller
{
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index()
  {
    $workplaces = Workplace::where([
      'area'  =>  Auth::user()->area
    ])->orderBy('name', 'asc')->get();
    return response()->json([
      'code'  =>  201,
      //'data'  =>  WorkplaceResource::collection($workplaces)
      'data'  =>  $workplaces
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
    /**
     * validate incoming data
     */
    $validator = Validator::make($request->all(),[
      'name'  =>  'required',
      'brick' =>  'required',
      'type'  =>  'required'
    ]);
    // if validation error
    // return response with code 203
    // and validation errors
    if($validator->fails()) {
      return response()->json([
        'code'  =>  400,
        'data'  =>  $validator->errors()
      ]);
    }
    $check = $this->getWorkplace([
      'name'  =>  $request->name,
      'brick' =>  $request->brick,
      'type'  =>  $request->type
      ]);
    // if hospital is already exists
    if($check) {
      return response()->json([
        'code'  =>  203,
        'data'  =>  [
          'errors'=> sprintf("Hospital %s is already exists", $request->name)
        ]
      ],203);
    }
    $hospital = Workplace::create(array_merge($request->all(),[
      'area'      =>  Auth::user()->area,
      'district'  =>  Auth::user()->district,
      'territory' =>  Auth::user()->territory,
      'region'    =>  Auth::user()->region
    ]));
    return response()->json([
      'code'  =>  201,
      'data'  =>  $hospital
    ],201);
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
      return response()->json([
        'code'  =>  400,
        'data'  =>  [
          'errors'  =>  [
            'Bad Request Input',
            'Id must be numeric (alphabetic is not allowed)'
          ]
        ]
      ]);
    }
    $workplace = Workplace::where([
      'area'  =>  Auth::user()->area,
      'id'    =>  $id
    ])->first();

    if (!$workplace) {
      return response()->json([
        'code'  =>  301,
        'data'  =>  [
          'errors' => [
            'Invalid hospital Id'
          ]
        ]
      ]);
    }

    return response()->json([
      'code'  =>  201,
      'data'  =>  new WorkplaceResource($workplace)
    ], 201);
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
      'name'  =>  'required',
      'type'  =>  'required',
      'brick' =>  'required'
    ]);
    if($validator->fails()) {
      return response()->json([
        'code'  =>  400,
        'data' => $validator->errors()
      ]);
    }
    if (!is_numeric($id)) {
      return response()->json([
        'code'  =>  400,
        'data'  =>  [
          'errors'  =>  [
            'Bad Request Input',
            'Id must be numeric (alphabetic is not allowed)'
          ]
        ]
      ]);
    }
    $workplace = Workplace::where([
      'area'  =>  Auth::user()->area,
      'id'    =>  $id
    ])->first();

    if (!$workplace) {
      return response()->json([
        'code'  =>  301,
        'data'  =>  [
          'errors' => [
            'Invalid hospital Id'
          ]
        ]
      ]);
    }

    $workplace->type = $request->type;
    $workplace->address = $request->address;
    $workplace->brick = $request->brick;
    $workplace->save();
    return response() ->json([
      'code'  =>  201,
      'data'  =>  sprintf('Hospital %s updated successfully', $workplace->name)
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

  /**
   * get workplace by the given conditions
   *
   * @param array $condition
   * @return Workplace|null
   */
  private function getWorkplace(array $condition)
  {
    $workplace = Workplace::where($condition)->first();
    return $workplace;
  }
}
