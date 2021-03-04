<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\Setting\ProductFactoryPriceSetting;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProductFactoryPriceController extends Controller
{
    public function index() {
      $prices = new ProductFactoryPriceSetting;

      return response([
        'code'  =>  200,
        'data'  =>  $prices->all()
      ]);
    }
}
