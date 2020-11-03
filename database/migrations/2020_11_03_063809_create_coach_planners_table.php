<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCoachPlannersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('coach_planners', function (Blueprint $table) {
            $table->id();
            $table->date('plan_date');
            $table->bigInteger('coach_id')->unsigned();
            $table->bigInteger('rep_id')->unsigned();
            $table->boolean('submitted')->default(false);
            $table->foreign('coach_id')->references('id')->on('users');
            $table->foreign('rep_id')->references('id')->on('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('coach_planners');
    }
}
