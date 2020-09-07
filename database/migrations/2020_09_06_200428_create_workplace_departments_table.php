<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWorkplaceDepartmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('workplace_departments', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('workplace_id')->unsigned();
            $table->string('name');
            $table->string('head')->nullable();
            $table->foreign('workplace_id')->references('id')->on('workplaces')->onDelete('cascade');
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
        Schema::dropIfExists('workplace_departments');
    }
}
