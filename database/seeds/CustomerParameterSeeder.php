<?php

use Illuminate\Database\Seeder;
use App\User;
use App\Customer;
use App\CustomerParameter;

class CustomerParameterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $params = ["HH","HM","HL","MH","MM","ML","LH","LM","LL","NN","XX"];
      $users = User::where('role' , 'rep')->get();
      foreach($users as $user) {
        $customers = Customer::with(['params'])->where('area', $user->area)->get();
        foreach($customers as $customer) {
          $param = CustomerParameter::create([
            "customer_id" =>  $customer->id,
            "user_id"     =>  $user->id,
            "param"       =>  $params[rand(0,count($params)-1)]
          ]);
        }
      }
    }
}
