<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWorkplaceReportsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('workplace_reports', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('workplace_id')->unsigned();
            $table->bigInteger('user_id')->unsigned();
            $table->bigInteger('customer_id')->unsigned();
            $table->date('visit_date');
            $table->bigInteger('dual_with')->unsigned()->nullable();
            $table->longText('comment')->nullable();
            $table->longText('products')->nullable();
            $table->longText('general_feedback')->nullable();
            $table->foreign('workplace_id')->references('id')->on('workplaces')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
            $table->foreign('dual_with')->references('id')->on('users');
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
        Schema::dropIfExists('workplace_reports');
    }
}
