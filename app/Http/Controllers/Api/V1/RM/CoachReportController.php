<?php

namespace App\Http\Controllers\Api\V1\RM;

use App\CoachReport;
use App\Helpers\Setting\ActiveCycleSetting;
use App\Http\Controllers\Controller;
use App\Http\Resources\RM\CoachReportResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CoachReportController extends Controller
{
    public function index()
    {
      $users = $this->getQueryUser();
      $activeCycle = new ActiveCycleSetting;
      $cycle = $activeCycle->all();
      $reports = CoachReport::with(['coach', 'rep', 'customer', 'customer.params', 'customer.frequency'])
      ->whereIn('coach_id', $users)
      ->whereBetween('visit_date', [$cycle->start, $cycle->end])
      ->orderBy('visit_date')
      ->get();
      return response([
        'code'  =>  200,
        'data'  => CoachReportResource::collection($reports),
        'users' =>$users
      ]);
    }

    private function getQueryUser()
    {
      $user = Auth::user();
      $users = json_decode($user->user_relations)->dm;

      if(request()->user !== "null") {
        $users = [request()->user];
      }
      return $users;
    }

    /**
     * view single coach report
     *
     * @param int $id [ coach report ID ]
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
      $user = Auth::user();
      $relations = json_decode($user->user_relations);
      $report = CoachReport::with(['coach', 'rep', 'customer', 'customer.params', 'customer.frequency'])
      ->where('id', $id)
      ->whereIn('coach_id', $relations->dm)
      ->whereIn('rep_id', $relations->reps)->first();

      return response([
        'code'  =>  200,
        'data'  =>  $report
      ]);
    }

    /**
     * get all coaching reports for
     * the given rep to evaluate rep skills
     *
     * @return \Illuminate\Http\Response
     */
    public function coachingFollowUp()
    {
      $user = Auth::user();
      $relations = json_decode($user->user_relations);
      $rep = request()->rep;
      $coach = request()->coach;
      if($rep === "null" && $coach === "null") {
        return response([
          'code'  =>  401,
          'message' =>  "You must select a rep to view all rep coaching reports"
        ]);
      }
      $reports = CoachReport::with(['coach', 'rep', 'customer', 'customer.params', 'customer.frequency']);

      if($coach !== "null") {
        $reports = $reports->where('coach_id', $coach);
      }

      if($rep !== "null") {
        $reports = $reports->where("rep_id", $rep);
      }

      $reports = $reports->orderBy('visit_date')->get();

      return response([
        'code'  =>  200,
        'data'  =>  $reports
      ]);
    }
}
