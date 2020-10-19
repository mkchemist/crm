<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCustomersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('specialty');
            $table->bigInteger('workplace_id')->unsigned()->nullable();
            $table->string('title')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('brick');
            $table->string('area');
            $table->string('district');
            $table->string('territory');
            $table->string('region');
            $table->string('state')->default('new');
            $table->boolean('approved')->default(false);
            $table->bigInteger('approved_by')->unsigned()->nullable();
            $table->timestamps();
            $table->foreign('workplace_id')->references('id')->on('workplaces');
            $table->foreign('approved_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('customers');
    }
}
