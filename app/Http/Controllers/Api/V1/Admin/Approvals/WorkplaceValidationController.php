<?php

namespace App\Http\Controllers\Api\V1\Admin\Approvals;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Workplace;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class WorkplaceValidationController extends Controller
{

    /**
     * get all workplace validation requests
     *
     * @return \Illuminate\Http\Response;
     */
    public function index()
    {

        $requests = Workplace::with(['added_by'])
        ->where('state', '!=', 'approved')->get();
        return response([
            'code' => 200,
            'data' => $requests,
            'message' => 'New workplace requests list loaded',
        ]);
    }

    /**
     * handle requests approval or rejection
     *
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|json',
            'state' => Rule::in(['approved', 'rejected']),
        ], [
            'ids.required' => 'Request IDs required',
            'ids.json' => 'Request IDs must be a valid json format',
            'state.in' => 'Request state must be either approved or rejected',
        ]);

        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }
        $ids = json_decode($request->ids);
        $state = $request->state;
        $user = Auth::user()->id;
        if ($state === 'approved') {
            DB::table('workplaces as w')
                ->crossJoin('workplaces as wj', 'w.id', '=', 'wj.id')
                ->whereIn('w.id', $ids)
                ->update([
                    'w.state' => 'approved',
                    'w.approved' => true,
                    'w.approved_by' => $user,
                    "w.added_by"    =>  $user
                ]);
        } else {
            DB::table('workplaces')->whereIn('id', $ids)->delete();
        }

        return response([
            'code' => 200,
            'message' => "Requests $state",
        ]);
    }
}
