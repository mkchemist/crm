<?php

namespace App\Http\Controllers\Api\V1;

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
      return $this->service->readAll(request()->all(), $this->user->id);
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
}
