<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOtcPlannersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('otc_planners', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->unsigned();
            $table->bigInteger('pharmacy_id')->unsigned()->nullable();
            $table->date('plan_date');
            $table->string('type');
            $table->string('title');
            $table->boolean('submitted')->default(false);
            $table->boolean('approved')->default(false);
            $table->bigInteger('approved_by')->unsigned()->nullable();
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('approved_by')->references('id')->on('users');
            $table->foreign('pharmacy_id')->references('id')->on('pharmacies');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('otc_planners');
    }
}
