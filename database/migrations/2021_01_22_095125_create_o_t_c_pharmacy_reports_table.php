<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOTCPharmacyReportsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('otc_pharmacy_reports', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->unsigned();
            $table->bigInteger('pharmacy_id')->unsigned()->nullable();
            $table->date('visit_date');
            $table->string('type')->default('regular');
            $table->string('product');
            $table->string('competitor1');
            $table->string('competitor1_rate');
            $table->integer('competitor1_stock')->default(0);
            $table->string('competitor2')->nullable();
            $table->string('competitor2_rate')->nullable();
            $table->integer('competitor2_stock')->default(0);
            $table->string('competitor3')->nullable();
            $table->string('competitor3_rate')->nullable();
            $table->integer('competitor3_stock')->default(0);
            $table->string('rate')->nullable();
            $table->integer('stock')->default(0);
            $table->integer('order')->default(0);
            $table->string('distributor')->nullable();
            $table->longText('comment');
            $table->longText('general_feedback');
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('pharmacy_id')->references('id')->on('pharmacies');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('o_t_c_pharmacy_reports');
    }
}
