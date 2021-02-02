<?php

namespace App\Http\Controllers\Api\V1;

use App\CoachReport;
use App\Helpers\CycleHelper;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CoachReportModuleController extends Controller
{


    protected $user;


    public function __construct()
    {
      $this->middleware(function($request, $next) {
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
      $reps = $this->coachReps();
      $reports = CoachReport::with('coach','rep','customer')
      ->whereIn('rep_id', $reps);
      if(request()->coach) {
        $reports = $reports->where('coach_id', request()->coach);
      }
      $reports = CycleHelper::getCycleData($reports,'visit_date');
      $reports = $reports->get();

      return response([
        'code'  =>  200,
        'data'  =>  $reports->groupBy(['visit_date','coach.name','rep.name']),
        'reps'  =>  $reps,
        "coach" =>  request()->coach ?? null,
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


    private function coachReps() {
      $relations = json_decode($this->user->user_relations);
      return  $relations->reps;
    }
}
