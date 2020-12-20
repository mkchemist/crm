<?php

namespace App\Http\Controllers\Api\V1\Rep;

use App\CustomerReport;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\PharmacyReport;
use App\Planner;
use App\WorkplacePlanner;
use App\WorkplaceReport;

class OtherRepsController extends Controller
{
    /**
     * get other reps customer plans
     *
     * @param int $id [customer id]
     * @return \Illuminate\Http\Response
     */
    public function customerPlans(int $id)
    {
      $data = $this->getCustomerCollection(Planner::class, $id)
      ->orderBy('plan_date')->get();
      return response([
        'code'  =>  200,
        'data'  =>  $data
      ]);
    }

    /**
     *  get other reps customer reports
     *
     * @param int $id
     * @return \IIlluminate\Http\Response
     */
    public function customerReports(int $id)
    {
      $data = $this->getCustomerCollection(CustomerReport::class, $id)->get();
      return response([
        'code'  =>  200,
        'data'  =>  $data
      ]);
    }

    /**
     * get workplace plans by the given id
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function workplacePlans(int $id)
    {
      $data = $this->getCustomerCollection(WorkplacePlanner::class, $id, 'workplace_id')
      ->orderBy('plan_date')
      ->get();

      return response([
        'code'  =>  200,
        'data'  =>  $data
      ]);
    }

    /**
     * get workplace reports by the given id
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function workplaceReports(int $id)
    {
      $data = $this->getCustomerCollection(WorkplaceReport::class, $id,'workplace_id')
      ->with('customer')
      ->orderBy('visit_date')
      ->get();

      return response([
        'code'  =>  200,
        'data'  =>  $data->groupBy('visit_date')
      ]);
    }

    /**
     * get pharmacy reports by the given id
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function pharmacyReports(int $id)
    {
      $data = $this->getCustomerCollection(PharmacyReport::class, $id,'pharmacy_id')
      ->orderBy('visit_date')
      ->get();

      return response([
        'code'  =>  200,
        'data'  =>  $data
      ]);
    }

    /**
     * get customer collection for the given model
     *
     * @param string $model
     * @param int $id [ customer id ]
     */
    private function getCustomerCollection(string $model, int $id, string $name = 'customer_id')
    {
      return $model::with('user')->where($name, $id);
    }


}
