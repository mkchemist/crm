<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\OTCRep\PharmacyResource;
use App\Pharmacy;
use App\PharmacyFavoriteList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PharmacyFavoriteListController extends Controller
{

    /**
     * current auth user
     *
     * @var User
     */
    public $user;

    /**
     * Pharmacy Favorite list constructor
     *
     *
     */
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = Auth::user();

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
        $list = Pharmacy::whereIn('id', function ($query) {
            $query->from('pharmacy_favorite_lists')
                ->select('pharmacy_id')
                ->where('user_id', $this->user->id)->get();
        })->with('otcReport')->select(
            'id',
            'name',
            'type',
            'key_person',
            'address',
            'brick',
            'area',
            'district',
            'territory',
            'phone'
        )->paginate(1000);

        return PharmacyResource::collection($list);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
          'id' => 'required|numeric'
        ], [
          'id.required' => 'ID is missing',
          'id.numeric' => 'ID must be a number'
        ]);

        if($validator->fails()) {
          return ResponseHelper::validationErrorResponse($validator);
        }

        $isExists = PharmacyFavoriteList::where([
          'user_id' => $this->user->id,
          'pharmacy_id' => $request->id
        ])->with('pharmacy')->first();

        if($isExists) {
          return response([
            'code' => 409,
            'message' => sprintf("Pharmacy %s is already added", $isExists->pharmacy->name)
          ], 409);
        }


        PharmacyFavoriteList::create([
          'pharmacy_id' => $request->id,
          'user_id'     => $this->user->id
        ]);

        return response([
          'code'  =>  201,
          'message' =>  "Pharmacy Added to list"
        ], 201);
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
      $isExists = PharmacyFavoriteList::where([
        'user_id' => $this->user->id,
        'pharmacy_id' => $id
      ])->with('pharmacy')->first();

      if(!$isExists) {
        return response([
          'code' => 400,
          'message' => 'Item not exists'
        ], 400);
      }
      $isExists->delete();
      return response([
        'code' => 200,
        'message' => "Pharmacy removed from list"
      ], 200);
    }
}
