<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCustomerValidationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('customer_validations', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->unsigned();
            $table->bigInteger('customer_id')->unsigned();
            $table->bigInteger('workplace_id')->unsigned()->nullable();
            $table->string('title')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->foreign('customer_id')->references('id')->on('customers');
            $table->foreign('workplace_id')->references('id')->on('workplaces');
            $table->foreign('user_id')->references('id')->on('users');
            $table->boolean('approved')->default(false);
            $table->bigInteger('approved_by')->unsigned()->nullable();
            $table->foreign('approved_by')->references('id')->on('users');
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
        Schema::dropIfExists('customer_validations');
    }
}
