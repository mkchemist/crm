<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCreatedByToCustomers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->bigInteger('added_by')->unsigned()->nullable()->after('state');
            $table->foreign('added_by')->references('id')->on('users');
        });
        Schema::table('pharmacies', function (Blueprint $table) {
            $table->bigInteger('added_by')->unsigned()->nullable()->after('state');
            $table->foreign('added_by')->references('id')->on('users');
        });
        Schema::table('workplaces', function (Blueprint $table) {
            $table->bigInteger('added_by')->unsigned()->nullable()->after('state');
            $table->foreign('added_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('customers', function (Blueprint $table) {
            //
        });
    }
}
