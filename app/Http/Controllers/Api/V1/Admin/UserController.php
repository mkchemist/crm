<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $users = User::orderBy('district','asc')
      ->orderBy('name', 'asc')
      ->get();
      return response([
        'code'  =>  200,
        'data'  =>  $users
      ], 200);
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
        'name'      =>  'required',
        'email'     =>  'required|email',
        'password'  => 'required|min:4',
        'username'  =>  'required',
        'role'      =>  'required',
        'line'      =>  'required',
        'area'      =>  'required',
        'district'  =>  'required',
        'territory' =>  'required',
        'region'    =>  'required'
      ]);
      if($validator->fails()) {
        return response(ResponseHelper::validationErrorResponse($validator));
      }
      $check = $this->checkIfUserExist($request->username, $request->email);
      if($check) {
        return response(ResponseHelper::ITEM_ALREADY_EXIST);
      }
      $user = User::create([
        'name'      =>  $request->name,
        'email'     =>  $request->email,
        'username'  =>  $request->username,
        'password'  =>  Hash::make($request->password),
        'role'      =>  $request->role,
        'line'      =>  $request->line,
        'area'      =>  $request->area,
        'district'  =>  $request->district,
        'territory' =>  $request->territory,
        'region'    =>  $request->region
      ]);

      return response([
        "code"    =>  200,
        "data"    =>  $user,
        "message" =>  "User $user->name added successfully"
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


    private function checkIfUserExist(string $username, string $email)
    {
      return User::where([
        "username"  =>  $username,
        "email"     =>  $email
      ])->first();

    }
}
