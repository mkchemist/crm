<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDaySummeryToCoachReports extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('coach_reports', function (Blueprint $table) {
          $table->longText('day_summery')->after('data');
          $table->boolean('day_submitted')->default(false)->after('rep_submit');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('coach_reports', function (Blueprint $table) {
            //
        });
    }
}
