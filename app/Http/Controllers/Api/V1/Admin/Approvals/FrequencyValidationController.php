<?php

namespace App\Http\Controllers\Api\V1\Admin\Approvals;

use App\CustomerFrequency;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\Validation\FrequencyValidationResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class FrequencyValidationController extends Controller
{
    /**
     * get all frequency validation requests
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $requests = CustomerFrequency::with(['customer', 'user'])
            ->whereNotIn('state', ['approved', 'rejected'])->where('submitted', true)->get();

        return response([
            "code" => 200,
            "data" => FrequencyValidationResource::collection($requests),
            "message" => "Frequency requests list loaded",
        ]);
    }

    /**
     * update frequency validation requests state
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
      $validator = Validator::make($request->all(),[
        'ids' =>  'required|json',
        'state' =>  Rule::in(['approved', 'rejected'])
      ], [
        'ids.required'  =>  'Requests ids is missing',
        'ids.json'      =>  'Requests ids must be a valid json format',
        'state.in'      =>  'Requests state must be either approved or rejected'
      ]);

      if($validator->fails()) {
        return response(ResponseHelper::validationErrorResponse($validator));
      }

      $state = $request->state;
      $ids = json_decode($request->ids);
      $user = Auth::user();
      if($state === 'approved') {
        $this->approveRequests($ids, $user);
      } else {
        $this->rejectRequests($ids, $user);
      }

      return response([
        'code'  =>  200,
        'message' =>  "Requests $state"
      ]);
    }

    /**
     * approve requests
     *
     * @param array $ids [requests ids]
     * @param User $user [admin]
     * @return void
     */
    private function approveRequests(array $ids, $user)
    {
      DB::table('customer_frequencies as cf')
      ->crossJoin('customer_frequencies as c', 'cf.id' ,'=', 'c.id')
      ->whereIn('cf.id', $ids)
      ->update([
        'cf.current'      => DB::raw('c.next'),
        'cf.state'        => 'approved by '.$user->id,
        'cf.approved_by'  =>  $user->id,
        'cf.next'         =>  0,
        'cf.submitted'    =>  false
      ]);
    }

    /**
     * reject requests
     *
     * @param array $ids [requests ids]
     * @param User $user [admin]
     * @return void
     */
    private function rejectRequests(array $ids, $user)
    {
      DB::table('customer_frequencies')
      ->whereIn('id', $ids)
      ->update([
        'state' =>  'rejected by '.$user->name,
        'approved_by' =>  $user->id,
        'submitted'   =>  false
      ]);
    }
}
