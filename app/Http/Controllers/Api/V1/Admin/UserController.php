<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\User;
use Illuminate\Http\Request;

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
      ->orderBy('area', 'asc')
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
    public function store(UserRequest $user)
    {
      if($user->validated()) {
        $check = User::where([
          'name'  =>  $user->name,
          'email' =>  $user->email
        ])->first();
        if($check) {
          return response([
            'code'  =>  409,
            'data'  =>  'Item Already Exists'
          ]);
        }
        $created = User::create($user);
        return response([
          'code'  =>  '200',
          'data'  =>  $created
        ], 200);
      }
      return response([
        "code"  =>  422,
        "data"  =>  $user->errors()
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
}
