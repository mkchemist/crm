<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $cycles = [
            [
                "name" => "Cycle 1",
                "start" => date("20y-01-01"),
                "end" => date("20y-02-15"),
            ],
            [
                "name" => "Cycle 2",
                "start" => date("20y-02-16"),
                "end" => date("20y-03-31"),
            ],
            [
                "name" => "Cycle 3",
                "start" => date("20y-04-01"),
                "end" => date("20y-05-15"),
            ],
            [
                "name" => "Cycle 4",
                "start" => date("20y-05-16"),
                "end" => date("20y-06-30"),
            ],
            [
                "name" => "Cycle 5",
                "start" => date("20y-07-01"),
                "end" => date("20y-08-15"),
            ],
            [
                "name" => "Cycle 6",
                "start" => date("20y-08-16"),
                "end" => date("20y-09-30"),
            ],
            [
                "name" => "Cycle 7",
                "start" => date("20y-10-01"),
                "end" => date("20y-11-15"),
            ],
            [
                "name" => "Cycle 8",
                "start" => date("20y-11-16"),
                "end" => date("20y-12-31"),
            ],
        ];

        DB::table('settings')->insert([
            [
                "name" => "report_interval",
                "group" => "report",
                "content" => 1,
            ],
            [
                "name" => "cycles",
                "group" => "cycle_control",
                "content" => json_encode($cycles),
            ],
        ]);
    }
}
