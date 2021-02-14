<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCustomerRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('customer_requests', function (Blueprint $table) {
            $table->id();
            $table->string('serial');
            $table->bigInteger('user_id')->unsigned();
            $table->bigInteger('customer_id')->unsigned();
            $table->string('type');
            $table->integer('cost')->default(0);
            $table->integer('quantity')->default(1);
            $table->string('product')->nullable();
            $table->integer('rx')->default(1);
            $table->integer('rx_months')->default(1);
            $table->bigInteger('pharmacy1')->unsigned()->nullable();
            $table->bigInteger('pharmacy2')->unsigned()->nullable();
            $table->bigInteger('pharmacy3')->unsigned()->nullable();
            $table->bigInteger('pharmacy4')->unsigned()->nullable();
            $table->date('query_date')->nullable();
            $table->date('apply_date')->nullable();
            $table->longText('comment')->nullable();
            $table->longText('others')->nullable();
            $table->string('state')->default('pending');
            $table->boolean('am_approval')->default(false);
            $table->date('am_approval_date')->default(Date("20y-m-d"));
            $table->boolean('rm_approval')->default(false);
            $table->date('rm_approval_date')->default(Date("20y-m-d"));
            $table->longText('reject_due')->nullable();
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->onDelete(NULL);
            $table->foreign('pharmacy1')->references('id')->on('pharmacies')->onDelete(NULL);
            $table->foreign('pharmacy2')->references('id')->on('pharmacies')->onDelete(NULL);
            $table->foreign('pharmacy3')->references('id')->on('pharmacies')->onDelete(NULL);
            $table->foreign('pharmacy4')->references('id')->on('pharmacies')->onDelete(NULL);
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete(NULL);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('customer_requests');
    }
}
