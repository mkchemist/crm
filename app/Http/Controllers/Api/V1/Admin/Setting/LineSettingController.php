<?php

namespace App\Http\Controllers\Api\V1\Admin\Setting;

use App\Helpers\Setting\LineSetting;
use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;

class LineSettingController extends Controller
{
    /**
     * get all lines
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $lines = new LineSetting;
      $users =  User::whereJsonContains('line', ['Line 3'])->get();
      return response([
        'code'  =>  200,
        'data'  =>  $lines->all(),
        'users' =>  $users
      ]);
    }

    /**
     * store or update lines data
     *
     * @param \Illuminate\Http\Request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      $id = $request->id;
      $lines = new LineSetting;
      $data = json_decode($request->lines);
      foreach($data as $item) {
        $item->products = json_decode($item->products);
        $item->specialties = json_decode($item->specialties);
      }
      $lines->save($data);
      $newLines = $lines->all();
      $users = User::whereJsonContains('line', [$request->line])
      ->update(['assigned_specialties' => json_encode($newLines[$id]->specialties)]);
      return response([
        'code'  =>  200,
        'message' =>  'Lines updated',
        'users'   =>  $users,
        'lines'   =>  $newLines
      ]);
    }

    public function show($id)
    {
      $lines = new LineSetting;
      $data = $lines->all();
      return response([
        'code'  =>  200,
        'data'  =>  $data[$id]
      ]);
    }

    public function destroy($id) {
      $lines = new LineSetting;
      $data = $lines->all();
      unset($data[$id]);
      $lines->save($data);
      return response([
      'code'  =>200,
      'data' => $data
      ]);
    }
}
