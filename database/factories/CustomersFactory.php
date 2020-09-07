<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Customer;
use Faker\Generator as Faker;

$factory->define(Customer::class, function (Faker $faker) {
    $specialties = ['Gyna','Ortho','Ped','Physo','IM','GP','Derma','Uro','Optha','Ent','Chest','Dent'];
    $bricks = ['Brick1','Brick2','Brick3','Brick4','Brick5','Brick6','Brick7'];
    $areas = ['fayoum','sub giza1','sub giza2', 'maadi', 'dar el salam', 'helwan', 'haram', 'fasel'];
    $titles = ['Assistant','Specialist','MD','Prof'];
    return [
      'name'  =>  $faker->name,
      'specialty' =>  $specialties[rand(0, count($specialties)-1)],
      'title'     =>  $titles[rand(0, count($titles)-1)],
      'phone'     =>  $faker->phoneNumber,
      'address'   =>  $faker->address,
      'brick'     =>  $bricks[rand(0, count($bricks) -1)],
      'area'      =>  $areas[rand(0, count($areas)-1)],
      'district'  =>  'giza1',
      'territory' =>  'giza',
      'region'    =>  'cairo'
    ];
});
