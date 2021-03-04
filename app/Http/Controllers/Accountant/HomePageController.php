<?php

namespace App\Http\Controllers\Accountant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class HomePageController extends Controller
{
    public function __construct()
    {

    }


    public function index()
    {
      return view('pages.accountant.index');
    }
}
