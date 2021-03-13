<?php

namespace App\Http\Controllers\Api\V1\Admin\Approvals;

use App\Customer;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class NewCustomerValidationController extends Controller
{

  /**
   * get all new customers that need to be validate
   *
   * @return \Illuminate\Http\Response
   */
    public function getNewCustomers()
    {
        $customers = Customer::with([
          'addedBy' => function($query) {
            $query->select('id', 'name', 'line');
          }
        ])->where('state', '!=', 'approved')
        ->get();
          $customers = $customers->makeHidden(['created_at','updated_at','workplace_id']);
        return response([
      "code"  =>  200,
      "data"  =>  $customers
    ], 200);
    }

    /**
     * approve new customers
     *
     * @param \Illuminate\Http\Request
     * @return \Illuminate\Http\Response
     */
    public function approveNewCustomers(Request $request)
    {
        $validator = Validator::make($request->all(), [
          'state' => [
            'required',
            Rule::in(['approved','rejected'])
          ],
          'ids' => 'required|json'
        ], [
          "state.in"  =>  "Request state must be either approved or rejected",
          "state.required"  =>  ":attribute is missing",
          "ids.required"    =>  "Customers ids is missing",
          "ids.json"         =>  "Customer ids must be a valid json format"
        ]);
        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }
        $ids = json_decode($request->ids);
        $user = Auth::user();
        if($request->state === "approved") {
          $state = "approved";
        } else {
          $state = "rejected";
        }
        Customer::whereIn('id', $ids)->update([
          "state"       =>  $state,
          "approved"    =>  true,
          "approved_by" =>  $user->id
        ]);
        return response([
          'code'    =>  200,
          "message" =>  "Requests $state"
        ]);

    }

    /**
     * delete rejected customers
     *
     * @return \Illuminate\Http\Response
     */
    public function deleteRejected()
    {
      Customer::where([
        'state' =>  'rejected',
        'approved'  =>  true
      ])->delete();

      return response([
        'code'  =>  200,
        'message' =>  'Deleting all rejected customers'
      ]);
    }
}
