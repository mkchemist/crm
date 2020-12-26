<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityReportResource;
use App\NonFieldActivityReport;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ActivityReportController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $type = request()->type;
      $user = Auth::user();
      $reports = NonFieldActivityReport::with(['user'])->where(['type'=>$type]);
      $reports = $this->getUserReports($user, $reports);
      $reports = $reports->orderBy('start','asc')->orderBy('end','asc')->get();
      return response([
        'code'  =>  200,
        'data'  =>  ActivityReportResource::collection($reports),
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
          'type'    =>  'required',
          'from'    =>  'required',
          'to'      =>  'required',
          'content' =>  'required'
        ]);
        if($validator->fails()) {
          return response(ResponseHelper::validationErrorResponse($validator));
        }
        $user = Auth::user();
        /** check if already exists */
        $isExists = $this->checkIfExists($user->id, $request->from, $request->to, $request->type);
        if($isExists) {
          return response(ResponseHelper::ITEM_ALREADY_EXIST);
        }

        NonFieldActivityReport::create([
          'user_id' =>  $user->id,
          'start'   =>  $request->from,
          'end'     =>  $request->to,
          'type'    =>  $request->type,
          'content' =>  $request->content,
          'comment' => $request->comment
        ]);

        return response([
          'code'  =>  200,
          'message' =>  'Report submitted'
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

    /**
     * check if report already exists
     *
     * @param int $user [user id]
     * @param string $from [starting date]
     * @param string $to [ending date]
     * @param string $type [activity type]
     */
    private function checkIfExists(int $user, string $from, string $to, string $type)
    {
      $report  = NonFieldActivityReport::where([
        'start'    =>  $from,
        'end'      =>  $to,
        'type'    =>  $type,
        'user_id' =>  $user
      ])->first();
      return $report;
    }

    /**
     * get user related reports
     *
     *
     * @param User $user
     * @param NonFieldActivityReport $model
     * @return NonFieldActivityReport
     */
    private function getUserReports(User $user, $model)
    {
      switch ($user->role) {
        case 'dm':
          $relations = json_decode($user->user_relations);
          $users = $relations->reps;
          $users[] = $user->id;
          return $model->whereIn('user_id', $users);
        default:
         return $model->where(['user_id'=> $user->id]);
      }
    }
}
