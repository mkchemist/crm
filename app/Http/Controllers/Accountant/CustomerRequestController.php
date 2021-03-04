<?php

namespace App\Http\Controllers\Accountant;

use App\CustomerRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CustomerRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $type = "pending";
        if(request()->type) {
          $type = request()->type;
        }
        $requests = CustomerRequest::with([
          'customer','customer.params','user','pharmacy_1',
          'pharmacy_2','pharmacy_3','pharmacy_4'
        ]);
        if($type !== "all") {
          $requests = $requests->where('state', $type);
        }
        $requests=$requests->get();

        return view('pages.accountant.request.index')->with([
          'requests' => $requests,
          'type'     => $type
          ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
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
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
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
