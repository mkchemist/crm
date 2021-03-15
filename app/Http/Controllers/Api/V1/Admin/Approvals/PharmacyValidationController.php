<?php

namespace App\Http\Controllers\Api\V1\Admin\Approvals;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Pharmacy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class PharmacyValidationController extends Controller
{
    /**
     * get all pharmacy validation requests
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $requests = Pharmacy::with([
          'addedBy' => function($query) {
            $query->select('name', 'line', 'id');
          }
        ])
        ->whereNotIn('state', ['approved'])->get();

        return response([
            'code' => 200,
            'data' => $requests,
            'message' => 'Pharmacy validation list loaded',
        ], 200);
    }

    /**
     * handle requests approval or rejection
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
            'ids.required' => 'Requests IDs is missing',
            'ids.json' => 'Requests IDs must be a valid json format',
            'state.in' => 'Request state must be either approved or rejected',
        ]);

        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }
        $ids = json_decode($request->ids);
        $state = $request->state;
        $user = Auth::user()->id;

        if ($state === "approved") {
            $this->approveRequests($ids, $user);
        } else {
            $this->rejectAndDeleteRequests($ids);
        }

        return response([
            'code' => 200,
            'message' => "Requests $state",
        ], 200);
    }

    /**
     * approve incoming requests
     *
     * @param array $ids [requests ids]
     * @param int $user [Admin id]
     * @return void
     */
    private function approveRequests(array $ids, int $user)
    {
        DB::table('pharmacies as p')
            ->crossJoin('pharmacies as pj', 'p.id', '=', 'pj.id')
            ->whereIn('p.id', $ids)
            ->update([
                'p.state' => 'approved',
                'p.approved' => true,
                'p.approved_by' => $user,
                "p.added_by"    =>  $user
            ]);
    }

    /**
     * reject incoming requests and delete record from DB
     *
     * @param array $ids [requests ids]
     * @return void
     */
    private function rejectAndDeleteRequests(array $ids)
    {
        DB::table('pharmacies')->whereIn('id', $ids)->delete();
    }

}
