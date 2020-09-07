<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            [
                'name'      =>  'Mohamed Kamal',
                'username'  =>  'admin',
                'email'     =>  'm.k_chemist@yahoo.com',
                'password'  =>  Hash::make(123456),
                'role'      =>  'admin',
                'area'      =>  'all',
                'district'  =>  'all',
                'territory' =>  'all',
                'region'    =>  'all'
            ],
            [
                'name'      =>  'R001',
                'username'  =>  'r001',
                'email'     =>  'r001@user.com',
                'password'  =>  Hash::make(123456),
                'role'      =>  'rep',
                'area'      =>  'sub giza 1',
                'district'  =>  'giza 1',
                'territory' =>  'giza',
                'region'    =>  'cairo'
            ]
        ]);
    }
}
