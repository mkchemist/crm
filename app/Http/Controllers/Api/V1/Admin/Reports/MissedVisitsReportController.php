<?php

namespace App\Http\Controllers\Api\V1\Admin\Reports;

use App\Helpers\Setting\ActiveCycleSetting;
use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MissedVisitsReportController extends Controller
{
    public function index()
    {
        $user = request()->user;
        $activeCycle = new ActiveCycleSetting;
        $active = $activeCycle->all();
        $today = date('20y-m-d');

        $reports = DB::table('planners AS plan')
            ->select(
                'customer.name as Customer',
                'customer.specialty as Specialty',
                'customer.area as Area',
                'customer.brick as Brick',
                'customer.district as District',
                'customer.territory as Territory',
                'rep.name as Rep',
                'plan.user_id as user_id',
                'param.current as Parameter',
                'freq.current as Freq',
                DB::raw('count(DISTINCT plan.plan_date) AS countOfPlans'),
                DB::raw('count(DISTINCT visit.visit_date) AS countOfVisits'),
                DB::raw('count(DISTINCT plan.plan_date) - count(DISTINCT visit.visit_date) as diff')
            )->join('customers as customer', 'customer.id', '=', 'plan.customer_id')
            ->join('users as rep', 'rep.id', '=', 'plan.user_id')
            ->leftJoin('customer_parameters as param', function ($join) {
                $join->on('param.customer_id', '=', 'plan.customer_id');
                $join->on('param.user_id', '=', 'plan.user_id');
            })->leftJoin('customer_frequencies as freq', function ($join) {
            $join->on('freq.customer_id', '=', 'plan.customer_id');
            $join->on('freq.user_id', '=', 'plan.user_id');
        })->leftJoin('customer_reports AS visit', function ($join) {
            $join->on('visit.customer_id', '=', 'plan.customer_id');
            $join->on('visit.user_id', '=', 'plan.user_id');
        })->groupBy('Rep', 'user_id', 'Customer', 'Specialty', 'Parameter', 'Freq', 'Area', 'Brick', 'District', 'Territory')
            ->having('diff', '!=', 0);
        $userData = null;
        if ($user !== null) {
            $userData = User::find($user);
            if ($userData) {
                $relations = json_decode($userData->user_relations);
                $reports->whereIn('plan.user_id', $relations->reps);
            }
        }

        $reports = $reports->whereBetween('plan.plan_date', [$active->start, $today])->get();
        return response([
            'code' => 200,
            'data' => $reports,

        ]);
    }
}
