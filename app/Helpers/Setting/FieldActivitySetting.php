<?php

namespace App\Helpers\Setting;

use App\Setting;

class FieldActivitySetting extends Manager
{

    protected $name = 'field_activity_types';

    protected $group = 'report_control';

    public function __construct()
    {
      $this->fetch();
    }
    /**
     * update non field activity setting
     *
     * @return void
     */
    public function update()
    {
      Setting::updateOrCreate([
        'name'    =>  $this->name,
        'group'   =>  $this->group
      ],[
        'content' =>  $this->data,
      ]);
    }

    /**
     * get non field activity setting
     *
     * @return void
     */
    public function fetch()
    {
      $setting = Setting::where([
        'name'  =>  $this->name,
        'group' =>  $this->group
      ])->first();
      if($setting && $setting->content) {
        $this->data = json_decode($setting->content);
      } else {
        $this->data = [];
      }
    }
}
