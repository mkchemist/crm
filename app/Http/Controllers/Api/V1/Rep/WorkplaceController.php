<?php

namespace App\Http\Controllers\Api\V1\Rep;

use App\Http\Controllers\Controller;
use App\Workplace;
use App\Http\Resources\RepWorkplaceResource as WorkplaceResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Helpers\ResponseHelper;
use App\Helpers\Traits\UserWithAssignment;

class WorkplaceController extends Controller
{
  use UserWithAssignment;
  /**
     * current auth user
     *
     * @var User
     */
    public $user;

    /**
     * CustomerController constructor
     *
     *
     */
    public function __construct()
    {
      $this->middleware(function($request, $next) {
        $this->user= Auth::user();
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
    $workplaces = Workplace::with(['departs','reports','plans'])->where([
      'state' =>  'approved'
    ]);
    $workplaces = $this->getQueryWithAssignment($this->user, $workplaces);

    $workplaces = $workplaces->orderBy('name', 'asc')->get();
    return response()->json([
      'code'  =>  201,
      'data'  =>  WorkplaceResource::collection($workplaces)
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
    $user = Auth::user();
    /**
     * validate incoming data
     */
    $validator = Validator::make($request->all(),[
      'name'  =>  'required',
      'brick' =>  'required',
      'type'  =>  'required',
      'address' => 'required'
    ]);
    // if validation error
    // return response with code 203
    // and validation errors
    if($validator->fails()) {
      return response()->json(ResponseHelper::validationErrorResponse($validator));
    }
    $check = $this->getWorkplace([
      'name'  =>  $request->name,
      'brick' =>  $request->brick,
      'type'  =>  $request->type
      ]);
    // if hospital is already exists
    if($check) {
      return response()->json(ResponseHelper::ITEM_ALREADY_EXIST);
    }

    $data = $request->all();
    $data["state"] = "New Added by $user->name";
    $hospital = Workplace::create($data);
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
      return response()->json(ResponseHelper::BAD_REQUEST_INPUT);
    }
    $workplace = Workplace::with(['reports', 'reports.customer'])->where([
      'id'    =>  $id
    ]);
    $workplace = $this->getQueryWithAssignment($this->user, $workplace);
    $workplace = $workplace->first();

    if (!$workplace) {
      return response()->json(ResponseHelper::INVALID_ID);
    }

    return response()->json([
      'code'  =>  201,
      'data'  =>  new WorkplaceResource($workplace),
      'reports' =>  $workplace->reports->groupBy('visit_date'),
      'plans'   =>  $workplace->plans
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
      'name'  =>  'required|string',
      'type'  =>  'required|string',
      'brick' =>  'required|string',
      'address' =>  'required|string'
    ]);
    if($validator->fails()) {
      return response()->json(ResponseHelper::validationErrorResponse($validator));
    }
    if (!is_numeric($id)) {
      return response()->json(ResponseHelper::BAD_REQUEST_INPUT);
    }
    $workplace = Workplace::where([
      'id'    =>  $id
    ]);
    $workplace = $this->getQueryWithAssignment($this->user, $workplace);
    $workplace = $workplace->first();

    if (!$workplace) {
      return response()->json(ResponseHelper::INVALID_ID);
    }

    $workplace->type = $request->type;
    $workplace->address = $request->address;
    $workplace->phone = $request->phone;
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
