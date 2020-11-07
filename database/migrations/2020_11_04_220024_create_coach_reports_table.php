<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCoachReportsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('coach_reports', function (Blueprint $table) {
            $table->id();
            $table->date('visit_date');
            $table->bigInteger('rep_id')->unsigned();
            $table->bigInteger('coach_id')->unsigned();
            $table->bigInteger('customer_id')->unsigned();
            $table->longText('data');
            $table->boolean('coach_submit')->default(false);
            $table->boolean('rep_submit')->default(false);
            $table->foreign('rep_id')->references('id')->on('users');
            $table->foreign('coach_id')->references('id')->on('users');
            $table->foreign('customer_id')->references('id')->on('customers');
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
        Schema::dropIfExists('coach_reports');
    }
}
