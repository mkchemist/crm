<?php

namespace App\Http\Controllers\Api\V1\OTCRep;

use App\Helpers\ResponseHelper;
use App\Helpers\Traits\UserWithAssignment;
use App\Http\Controllers\Controller;
use App\Http\Resources\OTCRep\PharmacyResource;
use App\Pharmacy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PharmacyController extends Controller
{
    use UserWithAssignment;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = Auth::user();
        $pharmacies = Pharmacy::with(['otcReport']);
        $pharmacies = $this->getQueryWithAssignment($user, $pharmacies)
        ->orderBy('name')->get();

        return response([
            'code' => 200,
            'data' => PharmacyResource::collection($pharmacies),

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
        $user = Auth::user();
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'type' => 'required|string',
            'address' => 'required|string',
            'brick' => 'required',
            'area' => 'required',
            'district' => 'required',
            'territory' => 'required',
            'region' => 'required',
            'phone' =>  'required'
        ]);

        if ($validator->fails()) {
            return response(ResponseHelper::validationErrorResponse($validator));
        }

        $checkIfExists = Pharmacy::where([
            'name' => $request->name,
            'type' => $request->type,
            'brick' => $request->brick,
            'area' => $request->area,
            'phone' =>  $request->phone
        ])->first();

        if ($checkIfExists) {
            return response(ResponseHelper::ITEM_ALREADY_EXIST);
        }

        $data = $request->all();
        $data['state'] = "New Add by $user->name";
        Pharmacy::create($data);

        return response([
            'code' => 200,
            'message' => 'Pharmacy Added',
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
        if (!is_numeric($id)) {
            return response(ResponseHelper::BAD_REQUEST_INPUT);
        }
        $user = Auth::user();
        $pharmacy = Pharmacy::with('otcReport')->where([
            'id' => $id,
        ]);
        $pharmacy = $this->getQueryWithAssignment($user, $pharmacy)->first();

        return response([
            'code' => 200,
            'data' => new PharmacyResource($pharmacy),
        ]);

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

        if(!is_numeric($id)) {
          return response(ResponseHelper::BAD_REQUEST_INPUT);
        }

        $validator = Validator::make($request->all(),[
          'type'  =>  'required',
          'address' =>  'required'
        ]);

        if($validator->fails()) {
          return response(ResponseHelper::validationErrorResponse($validator));
        }
        $user =Auth::user();
        $pharmacy = Pharmacy::where('id', $id);
        $pharmacy = $this->getQueryWithAssignment($user, $pharmacy)
          ->first();
        if(!$pharmacy) {
          return response(ResponseHelper::INVALID_ID);
        }

        $pharmacy->type = $request->type;
        $pharmacy->address = $request->address;
        $pharmacy->phone = $request->phone;
        $pharmacy->save();

        return response([
          'code'  =>  200,
          'message' =>  'Pharmacy Updated'
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

}
