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

        DB::table('users')->delete();

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
                'region'    =>  'all',
                'line'      =>  'all'
            ],
            [
                'name'      =>  'R001',
                'username'  =>  'r001',
                'email'     =>  'r001@user.com',
                'password'  =>  Hash::make(123456),
                'role'      =>  'rep',
                'area'      =>  'sub giza1',
                'district'  =>  'giza1',
                'territory' =>  'giza',
                'region'    =>  'cairo',
                'line'      =>  'line1'
            ],
            [
                'name'      =>  'R002',
                'username'  =>  'r002',
                'email'     =>  'r002@user.com',
                'password'  =>  Hash::make(123456),
                'role'      =>  'rep',
                'area'      =>  'sub giza1',
                'district'  =>  'giza1',
                'territory' =>  'giza',
                'region'    =>  'cairo',
                'line'      =>  'line2'
            ],
            [
                'name'      =>  'dm001',
                'username'  =>  'dm001',
                'email'     =>  'dm001@dm.com',
                'password'  =>  Hash::make(123456),
                'role'      =>  'dm',
                'area'      =>  'all',
                'district'  =>  'giza1',
                'territory' =>  'giza',
                'region'    =>  'cairo',
                'line'      =>  'line1'
            ]
        ]);
    }
}
