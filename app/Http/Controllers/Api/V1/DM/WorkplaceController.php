<?php

namespace App\Http\Controllers\Api\V1\DM;

use App\Helpers\ResponseHelper;
use App\Helpers\Traits\UserWithAssignment;
use App\Http\Controllers\Controller;
use App\Workplace;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Whoops\Handler\XmlResponseHandler;

class WorkplaceController extends Controller
{
    use UserWithAssignment;

    public $user;


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
      $workplaces = Workplace::where('state', 'approved');
      $workplaces = $this->getQueryWithAssignment($this->user, $workplaces);
      $workplaces = $workplaces->get();
      return response([
        'code'  =>  201,
        'data'  =>  $workplaces,
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
      if(!is_numeric($id)) {
        return response(ResponseHelper::BAD_REQUEST_INPUT,200);
      }
      $workplace = Workplace::with('departs')->where([
        'id'  =>  $id,
      ]);
      $workplace = $this->getQueryWithAssignment($this->user, $workplace);
      $workplace = $workplace->first();

      if(!$workplace) {
        return response(ResponseHelper::INVALID_ID, 200);
      }

      return response([
        'code'  =>  200,
        'data' =>  $workplace
      ], 200);
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
