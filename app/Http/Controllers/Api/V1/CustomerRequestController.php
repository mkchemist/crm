<?php

namespace App\Http\Controllers\Api\V1;

use App\CustomerRequest;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CustomerRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = Auth::user();
        $requests = CustomerRequest::with(['customer', 'user']);
        $requests = $this->getUserRelatedRequests($user, $requests);
        $requests = $requests->orderBy('query_date')->get();

        return response([
          'code'  =>  200,
          'data'  =>  $requests
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
          'customer_id' =>  'required|integer',
          'type'        =>  'required|string',
          'apply_date'  =>  'required|date'
        ]);
        if($validator->fails()) {
          return response(ResponseHelper::validationErrorResponse($validator));
        }
        $user = Auth::user();

        CustomerRequest::create([
          'user_id' =>  $user->id,
          'customer_id' =>  $request->customer_id,
          'type'        =>  $request->type,
          'comment'     =>  $request->comment,
          'state'       =>  'pending',
          'quantity'    =>  $request->quantity,
          'price'       =>  $request->price,
          'query_date'  =>  date('20y-m-d'),
          'apply_date'  =>  $request->apply_date
        ]);
        return response([
          'code'  =>  200,
          'message' =>  'Request sent'
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
        $validator = Validator::make($request->all(),[
          'apply_date' => 'required|date',
          'type'      =>  'required|string'
        ]);

        if($validator->fails()) {
          return response(ResponseHelper::validationErrorResponse($validator));
        }
        $user = Auth::user();
        $requestReport = CustomerRequest::where([
          'id'  =>  $id,
          'user_id' =>  $user->id
        ])->first();
        if(!$requestReport) {
          return response(ResponseHelper::INVALID_ID);
        }
        if($requestReport->state === 'approved') {
          return response([
            'code'  =>  400,
            'data'  =>  [
              'errors' => [
                'Cannot update approved requests'
              ]
            ]
          ]);
        }
        $requestReport->update([
          'type'  =>  $request->type,
          'apply_date'  =>  $request->apply_date,
          'price' =>  $request->price,
          'quantity'  =>  $request->quantity
        ]);
        return response([
          'code'  =>  200,
          'message' =>  'Request updated'
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
        $user = Auth::user();
        $request = CustomerRequest::where([
            'id'  =>$id,
            'user_id' =>  $user->id
        ])->first();
        if($request->state === 'approved') {
          return response([
            'code'  =>  400,
            'data'  =>  [
              'errors' => [
                'Cannot update approved requests'
              ]
            ]
          ]);
        }
        $request->delete();
        return response([
          'code'  =>  200,
          'message' =>  'Request deleted'
        ]);
    }

    /**
     * get related user requests data
     *
     * @param User $user
     * @param $model
     * @return $model
     */
    private function getUserRelatedRequests($user, $model)
    {
      switch ($user->role) {
        case 'dm':
         $relations = json_decode($user->user_relations);
         $reps = $relations->reps;
         return $model->whereIn('user_id', $reps);
        default:
          return $model->where(['user_id' => $user->id]);
      }
    }
}
