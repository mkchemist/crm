<?php

namespace App\Http\Controllers\Api\V1;

use App\CustomerRequest;
use App\Helpers\ResponseHelper;
use App\Helpers\Setting\ProductFactoryPriceSetting;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\CustomerRequest\CustomerRequestService;

class RequestController extends Controller
{
    /**
     * current Auth user
     *
     * @var User
     */
    protected $user;

    protected $service;

    public function __construct()
    {
      $this->middleware(function($request, $next) {
        $this->user = Auth::user();
        $this->service = new CustomerRequestService($this->user);
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
      return $this->service->readAll();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      /* $requestService = new CustomerRequestService($this->user); */
      return $this->service->storeRequest($request);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $request = CustomerRequest::with([
          'customer','user','pharmacy_1',
          'pharmacy_2','pharmacy_3','pharmacy_4',
          'customer.params'
        ])
        ->whereNotIn('state', ['canceled', 'changed'])->get();

        if(!count($request)) {
          return response(ResponseHelper::INVALID_ID);
        }

        $priceList = new ProductFactoryPriceSetting;

        return response([
          'code'  =>  200,
          'data'  =>  $request,
          'priceList' =>  $priceList->all()
        ]);
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
        return $this->service->update($request, $id);
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

    /**
     * update request state
     *
     * @param \Illuminate\Http\Request
     * @return \Illuminate\Http\Response
     */
    public function updateState(Request $request)
    {

    }


    public function analysis($search)
    {
      return $this->service->analysisCost($search);
    }

    /**
     * Cancel Request
     *
     *
     * @param string $serial
     * @return \Illuminate\Http\Response
     */
    public function cancelRequest(string $serial)
    {
      return $this->service->handleRequestCancel($serial);
    }

    /**
     * submit Request
     *
     *
     * @param string $serial
     * @return \Illuminate\Http\Response
     */
    public function submitRequest(string $serial)
    {
      return $this->service->handleRequestSubmit($serial);
    }

    /**
     * approve Request
     *
     *
     * @param string $serial
     * @return \Illuminate\Http\Response
     */
    public function approveRequest(Request $request)
    {
      return $this->service->handleRequestApproval($request);
    }

    /**
     * sharing in the given request
     *
     * @param \Illuminate\Http\Request $request
     * @param string $serial
     * @return \Illuminate\Http\Response
     */
    public function sharing(Request $request,string $serial)
    {
      return $this->service->shareIn($request, $serial);
    }


    /**
     * read shared requests
     *
     *
     */
    public function readShared()
    {
      return $this->service->readShared();
    }


    public function setCost(Request $request)
    {
      return $this->service->setRequestCost($request);
    }
}
