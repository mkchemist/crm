<?php

namespace App\Http\Controllers\Api\V1;

use App\Customer;
use App\Helpers\Setting\ActiveCycleSetting;
use App\Helpers\Setting\CyclesSetting;
use App\Helpers\Setting\LineSetting;
use App\Helpers\Setting\ReportIntervalSetting;
use App\Helpers\Traits\UserWithAssignment;
use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Support\Facades\Auth;

class ApplicationSetting extends Controller
{
    use UserWithAssignment;

    public function index()
    {
        $activeCycle = new ActiveCycleSetting;
        $cycles = new CyclesSetting;
        $reportInterval = new ReportIntervalSetting;
        $lines = new LineSetting;
        $user = Auth::user();
        if ($user->role !== "admin") {
            $userLine = $this->getUserLine($lines->all(), $user);
        } else {
            $userLine = $lines->all();
        }
        return response([
            'code' => 200,
            'data' => [
                'cycles' => $cycles->all(),
                'activeCycle' => $activeCycle->all(),
                'reportInterval' => $reportInterval->all(),
                'canEditReportDate' => $reportInterval->canEditDate,
                'line' => $userLine,
            ],
        ]);
    }

    /**
     * get user lines
     *
     * @param array $lines
     * @param User $user
     * @return array
     */
    public function getUserLine($lines, $user)
    {
        $userLine = json_decode($user->line);
        $line = [];
        foreach ($lines as $key => $val) {
            if (in_array($val->name, $userLine)) {
                $line[] = $val;
            }
        }
        return $line;
    }

    /**
     * get usr locations list
     *
     * @return \Illuminate\Http\Response
     */
    public function locations()
    {
        $user = Auth::user();
        $locations = Customer::select('brick', 'area', 'district', 'territory', 'region');
        $locations = $this->getQueryWithAssignment($user, $locations)
            ->distinct()->get();

        return response([
            'code' => 200,
            'data' => $locations,
        ]);
    }

    /**
     *
     * get user relations
     *
     */
    public function relations()
    {
        $user = Auth::user();
        if ($user->role === "admin" || $user->role === "accountant") {
            $users = User::where('active', true)
                ->whereNotIn('role', ['admin', 'accountant'])->get();
            return response([
                'code' => 200,
                'data' => $users->groupBy('role'),
            ]);
        }
        $relations = json_decode($user->user_relations);
        $reps = $relations->reps ?? [];
        $dm = $relations->dm ?? [];
        $am = $relations->am ?? [];
        $rm = $relations->rm ?? [];
        $marketing = $relations->marketing ?? [];
        $users = array_merge(
            $reps,
            $dm,
            $am,
            $rm,
            $marketing
        );

        $data = User::whereIn('id', $users)->get();

        return response([
            'code' => 200,
            'data' => $data->groupBy('role'),
        ]);
    }

    /**
     * get line products
     *
     * @return \Illuminate\Http\Response
     */
    public function lineProducts()
    {
        $user = Auth::user();
        $lines = new LineSetting;
        $lines = $lines->all();
        $userLines = json_decode($user->line);
        $data = [];
        foreach ($lines as $line) {
            if (in_array($user->role, ['admin', 'accountant'])) {
                $data = array_merge($data, $line->products);
            } else if (in_array($line->name, $userLines)) {
                $data = array_merge($data, $line->products);
            }
        }

        return response([
            'code' => 200,
            'data' => $data,
        ]);
    }


}
