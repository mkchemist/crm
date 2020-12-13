<?php

namespace App\Helpers\Setting;

abstract class Manager
{
  /**
   * setting name
   *
   */
  protected $name;

  /**
   * setting group name
   *
   */
  protected $group;

  /**
   *
   * data container
   */
  protected $data;

  /**
   * update setting
   */
  abstract protected function update();

  /**
   * fetch setting from database
   */
  abstract protected function fetch();

  /**
   * get all setting
   *
   */
  public function all()
  {
    if(!$this->data) {
      $this->fetch();
    }
    return $this->data;
  }

  /**
   * set item
   */
  private function set($value)
  {
    $this->data = $value;
    return [$this->data, __CLASS__];
  }

  /**
   * get item from setting
   *
   */
  public function get(string $key)
  {
    if($this->has($key)) {
      return $this->data[$key];
    }
  }

  /**
   * check if the setting has the given item
   *
   */
  public function has(string $key)
  {
    return array_key_exists($key, $this->data);
  }

  /**
   * save setting
   *
   * @param mixed $value [setting content]
   */
  public function save($value)
  {
    self::set($value);
    $this->update();
  }


}
