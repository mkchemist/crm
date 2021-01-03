<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCoach2ToCustomerReports extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('customer_reports', function (Blueprint $table) {
            $table->bigInteger('coach2_id')->unsigned()->nullable()->after('dual_with');
            $table->foreign('coach2_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('customer_reports', function (Blueprint $table) {
            //
        });
    }
}
