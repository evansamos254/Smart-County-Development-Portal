<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subcounties', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->unique('subcounties_name_key');
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('ward', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->unsignedInteger('subcounty_id');
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['name', 'subcounty_id'], 'ward_name_subcounty_key');
            $table->foreign('subcounty_id', 'ward_subcounty_fk')
                ->references('id')
                ->on('subcounties')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
        });

        Schema::create('sublocation', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->unsignedInteger('ward_id');
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['name', 'ward_id'], 'sublocation_name_ward_key');
            $table->foreign('ward_id', 'sublocation_ward_fk')
                ->references('id')
                ->on('ward')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
        });

        Schema::create('villages', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->unsignedInteger('sublocation_id');
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['name', 'sublocation_id'], 'villages_name_sublocation_key');
            $table->foreign('sublocation_id', 'villages_sublocation_fk')
                ->references('id')
                ->on('sublocation')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('villages');
        Schema::dropIfExists('sublocation');
        Schema::dropIfExists('ward');
        Schema::dropIfExists('subcounties');
    }
};
