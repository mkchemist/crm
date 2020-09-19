<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWorkplacePlannersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('workplace_planners', function (Blueprint $table) {
          $table->id();
          $table->bigInteger('workplace_id')->unsigned();
          $table->bigInteger('user_id')->unsigned();
          $table->date('plan_date');
          $table->string('state')->default('requested');
          $table->string('approved_by')->nullable();
          $table->timestamps();
          $table->foreign('workplace_id')->references('id')->on('workplaces')->onDelete('cascade');
          $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('workplace_planners');
    }
}
