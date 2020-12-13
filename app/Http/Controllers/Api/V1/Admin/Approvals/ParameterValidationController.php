<?php

namespace App\Http\Controllers\Api\V1\Admin\Approvals;

use App\CustomerParameter;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\Validation\ParameterValidationResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class ParameterValidationController extends Controller
{

    /**
     * get all Parameter Validation Requests
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $requests = CustomerParameter::with(['customer', 'user'])->whereNotIn('state', ['approved', 'rejected'])->get();

        return response([
            'code' => 200,
            'data' => ParameterValidationResource::collection($requests),
        ]);
    }

    /**
     * update request state
     *
     * @param \Illuminate\Http\Request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|json',
            'state' => Rule::in(['approved', 'rejected']),
        ], [
            'ids.required' => 'Requests ids is missing',
            'ids.json' => 'Requests ids must be a valid JSON format',
            'state.in' => 'Request state must be either approved or rejected',
        ]);
        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }
        $ids = json_decode($request->ids);
        $state = $request->state;
        $user = Auth::user()->id;
        if($state === "approved") {
          $this->approveRequests($ids, $user);
        } else {
          $this->rejectRequests($ids,$user);
        }
        return response([
          'code'  =>  200,
          'message' =>  "Requests $state"
        ]);
    }

    /**
     * approve requests
     *
     * @param array $ids [request ids]
     * @param int $user [user id]
     * @return void
     */
    private function approveRequests(array $ids, $user)
    {
        DB::table('customer_parameters as cp')
            ->crossJoin('customer_parameters as c', 'cp.id', '=', 'c.id')
            ->whereIn('cp.id', $ids)
            ->update([
                'cp.current' => DB::raw('c.next'),
                'cp.next'     =>  null,
                'cp.state'    =>  'approved',
                'cp.approved' =>  true,
                'cp.approved_by'  =>  $user
            ]);
    }

    /**
     * approve requests
     *
     * @param array $ids [request ids]
     * @param int $user [user id]
     * @return void
     */
    private function rejectRequests(array $ids, $user)
    {
        DB::table('customer_parameters')
            ->whereIn('id', $ids)->update([
            'next' => '',
            'state' =>  'rejected',
            'approved'  =>  true,
            'approved_by' =>  $user
        ]);

    }

}
