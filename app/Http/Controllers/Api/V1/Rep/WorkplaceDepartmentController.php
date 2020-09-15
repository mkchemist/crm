<?php

namespace App\Http\Controllers\Api\V1\Rep;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\WorkplaceDepartment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class WorkplaceDepartmentController extends Controller
{
  public function getWorkplaceDepartment($id)
  {
    $departs = WorkplaceDepartment::where('workplace_id', function($query) use($id){
      $query->from('workplaces')
        ->select('id')
        ->where('area', Auth::user()->area)
        ->where('id', $id)
        ->first();
    })->get();
    if(count($departs) === 0) {
      return response()->json(ResponseHelper::EMPTY_RESPONSE);
    }
    return response()->json([
      'code'  =>  201,
      'data'  =>  $departs
    ]);
  }

  /**
   * create new workplace department
   *
   * @param Request $request
   * @return void
   */
  public function store(Request $request)
  {
    $validator= Validator::make($request->all(), [
      'workplace_id' => 'required',
      'name'         => 'required'
    ]);
    if($validator->fails()) {
      return response()->json(ResponseHelper::validationErrorResponse($validator));
    }
    $check = WorkplaceDepartment::where([
      'workplace_id'  =>  $request->workplace_id,
      'name'          =>  $request->name
    ])->first();

    if($check) {
      return response()->json(ResponseHelper::ITEM_ALREADY_EXIST);
    }
    WorkplaceDepartment::create($request->all());
    return response()->json([
      'code'  =>  201,
      'data'  =>  'Department added successfully'
    ]);
  }

  /**
   * update department
   *
   * @param Request $request
   * @param int $id
   * @return void
   */
  public function update(Request $request, int $id)
  {
    if(!ResponseHelper::isNumeric($id)) {
      return response()->json(ResponseHelper::BAD_REQUEST_INPUT);
    }
    $department = WorkplaceDepartment::find($id);
    if(!$department) {
      return response()->json(ResponseHelper::INVALID_ID);
    }
    $department->head = $request->head;
    $department->save();
    return response()->json([
      'code'  =>  201,
      'data'  =>  'Department edit successfully'
    ]);
  }
}
