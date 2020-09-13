<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Pharmacy;
use Faker\Generator as Faker;

$factory->define(Pharmacy::class, function (Faker $faker) {
  $bricks = ['Brick1','Brick2','Brick3','Brick4','Brick5','Brick6','Brick7'];
  $areas = ['fayoum','sub giza1','sub giza2', 'maadi', 'dar el salam', 'helwan', 'haram', 'fasel'];
  $types = ['Private', 'Chain' ,'Tender', 'Company'];
  return [
    'name'  =>  $faker->name,
    'type'      =>  $types[rand(0, count($types)-1)],
    'key_person'=>  $faker->name,
    'address'   =>  $faker->address,
    'brick'     =>  $bricks[rand(0, count($bricks) -1)],
    'area'      =>  $areas[rand(0, count($areas)-1)],
    'district'  =>  'giza1',
    'territory' =>  'giza',
    'region'    =>  'cairo'
  ];
});
