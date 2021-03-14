<?php

namespace App\Http\Controllers\Api\V1\Admin\Approvals;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\CustomerValidation;
use App\Helpers\ResponseHelper;
use App\Http\Resources\Admin\Validation\CustomerValidationResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class CustomerValidationController extends Controller
{

  /**
   *  get all customer validations
   *
   *
   * @return \Illuminate\Http\Response
   */
    public function index()
    {
        $customers = CustomerValidation::with(['customer',
        'customer.workplace' => function($query) {
          $query->select("id", "name");
        },
        'workplace' => function($query) {
          $query->select("id", "name");
        },
          'user' => function($query) {
            $query->select("id","name","line");
          }
        ])
    ->where([
      'approved' => false
    ])->get();
        return response([
      'code'  =>  200,
      'data'  =>  CustomerValidationResource::collection($customers),
    ]);
    }

    /**
     * validate the given requests
     *
     *
     * @param \Illuminate\Http\Request
     * @return \\Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
      'ids' => 'required|json',
       'state' =>Rule::in(['approved', 'rejected'])
    ], [
      'state.in'  => 'State must be either approved or rejected',
      'ids.json'  =>  'Requests ids must be a valid json format'
    ]);
        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }

        $user = Auth::user();
        $ids = json_decode($request->ids);
        if ($request->state === "approved") {
            $this->approveRequest($ids, $user->id);
        } else {
            $this->rejectRequests($ids, $user->id);
        }

        return response([
      'code'  =>  200,
      'message' =>  "Request $request->state"
    ]);
    }


    /**
     * reject requests
     *
     * @param array $ids [requests ids]
     * @param int $userId
     * @return void
     */
    private function rejectRequests(array $ids, int $userId)
    {
      CustomerValidation::whereIn('id', $ids)
      ->update([
        "approved"  =>  false,
        "approved_by" =>  $userId
      ]);
    }

    /**
     * Approve requests
     *
     * @param array $ids [requests ids]
     * @param int $userId
     * @return void
     */
    private function approveRequest(array $ids, int $userId)
    {
      DB::table('customers as c')
      ->join('customer_validations as cv', 'c.id', '=', 'cv.customer_id')
      ->whereIn('cv.id', $ids)
      ->update([
        'c.phone' => DB::raw("cv.phone"),
        'c.address' =>  DB::raw('cv.address'),
        'c.workplace_id'  =>  DB::raw('cv.workplace_id'),
        'c.title'       =>  DB::raw('cv.title'),
        "cv.approved"  =>  true,
        "cv.approved_by" =>  $userId
      ]);
    }

    public function clearRejectedRequests()
    {
      $requests = CustomerValidation::where([
        'approved' => false,
        ['approved_by', '!=', null]
      ])->delete();
      return response([
        'code'  =>  200,
        'data'  =>  $requests,
        'message' =>  "All rejected requests are deleted"
      ]);
    }
}
