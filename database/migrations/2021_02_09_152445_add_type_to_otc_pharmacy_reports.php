<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTypeToOtcPharmacyReports extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('otc_pharmacy_reports', function (Blueprint $table) {
            $table->string('product_type')->nullable()->after('rate');
            $table->string('competitor1_type')->nullable()->after('competitor1_rate');
            $table->string('competitor2_type')->nullable()->after('competitor2_rate');
            $table->string('competitor3_type')->nullable()->after('competitor3_rate');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('otc_pharmacy_reports', function (Blueprint $table) {
            //
        });
    }
}
