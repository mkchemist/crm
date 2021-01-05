<?php

namespace App\Http\Controllers\Api\V1\RM;

use App\CustomerReport;
use App\Helpers\Setting\ActiveCycleSetting;
use App\Http\Controllers\Controller;
use App\Http\Resources\RM\RepsCustomerReportResource;
use Illuminate\Support\Facades\Auth;

class CustomerReportController extends Controller
{
    /**
     * get all reps customer reports
     *
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = Auth::user();
        $relations = json_decode($user->user_relations);
        $reps = $relations->reps;
        $activeCycle = new ActiveCycleSetting;
        $cycleDates = $activeCycle->all();
        $reports = CustomerReport::with(['user', 'customer', 'customer.params', 'customer.frequency', 'coach'])
            ->whereIn('user_id', $reps)
            ->whereBetween('visit_date', [$cycleDates->start, $cycleDates->end])
            ->orderBy('id')
            ->get();
        return response([
            'code' => 200,
            'data' => RepsCustomerReportResource::collection($reports),
        ]);
    }
}
