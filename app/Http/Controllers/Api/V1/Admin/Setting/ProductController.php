<?php

namespace App\Http\Controllers\Api\V1\Admin\setting;

use App\Helpers\ResponseHelper;
use App\Helpers\Setting\ProductFactoryPriceSetting;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function index()
    {
        $products = new ProductFactoryPriceSetting();

        return response([
            'code' => 200,
            'data' => $products->all(),
        ]);
    }

    /**
     * update product factory price
     *
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
      $validator = Validator::make($request->all(), [
        'data'  =>  'required|json'
      ]);
        if($validator->fails()) {
          return response(ResponseHelper::validationErrorResponse($validator));
        }
      $productSetting = new ProductFactoryPriceSetting();
      $productSetting->save($request->data);
      return response([
        'code'  =>  200,
        'message' =>  'Setting saved successfully'
      ]);
    }
}
