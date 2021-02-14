<?php

namespace App\Helpers\Setting;

use App\Setting;
use stdClass;

class ProductFactoryPriceSetting extends Manager {

    protected $name = "product_factory_price";

    protected $group = "product_control";

    public function __construct()
    {
      $this->fetch();
    }


    public function update()
    {
      Setting::updateOrCreate([
        'name'  =>  $this->name,
        'group' =>  $this->group
      ],[
        'content' =>  $this->data
      ]);
    }


    public function fetch()
    {
      $setting = Setting::where([
        'name'  =>  $this->name,
        'group' =>  $this->group
      ])->first();
      if($setting && $setting->content) {
        $this->data =json_decode($setting->content);
      } else {
        $this->data = new stdClass;
      }
    }
}
