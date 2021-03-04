<?php

namespace App\Helpers\Traits;

use App\User;

trait UserWithAssignment {


  protected $bricks = [];

  protected $specialties = [];

  protected $area = [];

  protected $district = [];

  protected $territory = [];

  protected $region = [];

  protected function isUserHasAssignment(User $user)
  {
    $this->bricks = $this->jsonToArray($user->assigned_brick);
    $this->specialties = $this->jsonToArray($user->assigned_specialties);
    $this->area = $this->jsonToArray($user->area);
    $this->district = $this->jsonToArray($user->district);
    $this->territory = $this->jsonToArray($user->territory);
    $this->region = $this->jsonToArray($user->region);
    if(count($this->bricks)) {
      return true;
    } else if(count($this->specialties)) {
      return true;
    }
    return false;

  }

  protected function getQueryWithAssignment($user, $query, $withSpecialty= false, $table=null)
  {
    if($table) {
      $table = $table.".";
    } else {
      $table = "";
    }
    $this->isUserHasAssignment($user);
    if($this->area[0] !== 'all') {
      $query->whereIn($table.'area', $this->area);
    }
    if($this->district[0] !== 'all') {
      $query->whereIn($table.'district', $this->district);
    }
    if($this->territory[0] !== 'all') {
      $query->whereIn($table.'territory', $this->territory);
    }
    if($this->region[0] !== 'all') {
      $query->whereIn($table.'region', $this->region);
    }
    if(count($this->bricks)) {
      $query->whereIn($table.'brick', $this->bricks);
    }
    if($withSpecialty) {
      if(count($this->specialties)) {
        $query->whereIn('specialty', $this->specialties);
      }
    }
    return $query;
  }


  private function isValidJsonAssignment($item)
  {
    if(is_string($item)) {
      $json = json_decode($item);
      if(is_object($json) || is_array($json)) {
        return true;
      }
      return false;
    }
    return false;
  }

  private function jsonToArray($item)
  {
    if($this->isValidJsonAssignment($item)) {
      return json_decode($item);
    } else {
      return [];
    }
  }

}
