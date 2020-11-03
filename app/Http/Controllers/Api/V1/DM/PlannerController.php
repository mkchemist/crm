<?php

namespace App\Http\Controllers\Api\V1\DM;

use App\CoachPlanner;
use App\Http\Controllers\Controller;
use App\Http\Resources\DM\CoachPlannerResource;
use App\Http\Resources\RepPlannerResource;
use App\Planner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PlannerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $user = Auth::user();
      $repPlans = Planner::with(['customer', 'customer.frequency', 'customer.planner', 'customer.params', 'user'])
      ->whereIn('user_id', function ($query) use($user) {
        $query->select('id')->from('users')
        ->where(['district' => $user->district, 'line' => $user->line])->get();
      })->get();

      $coach = CoachPlanner::with(['rep', 'coach'])
      ->where(['coach_id' => $user->id])->get();

      return response([
        'code' => 201,
        'data' => [
          'rep'   =>  RepPlannerResource::collection($repPlans),
          'coach' =>  CoachPlannerResource::collection($coach)
        ]
      ], 201);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
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
