<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
    'name',
    'email',
    'username',
    'password',
    'role',
    'line',
    'area',
    'district',
    'territory',
    'region'
  ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
    'password', 'remember_token',
  ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
    'email_verified_at' => 'datetime',
  ];

  public function coach() {
    return $this->hasMany("App\CoachReport","coach_id", "id");
  }

  public function coach_rep() {
    return $this->hasMany("App\CoachReport", "rep_id", "id");
  }

  public function customer_validation() {
    return $this->hasMany("App\CustomerValidation");
  }

  public function coach_report() {
    return $this->hasMany("App\CoachReport","coach_id", "id");
  }

  public function coach_report_rep() {
    return $this->hasMany("App\CoachReport","rep_id", "id");
  }
}
