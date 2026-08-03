<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('citizens', function (Blueprint $table) {
            $table->increments('id');
            $table->string('full_name');
            $table->enum('sex', ['MALE', 'FEMALE', 'OTHER']);
            $table->string('phone_number', 20)->nullable();
            $table->unsignedInteger('village_id');
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('village_id', 'citizens_village_fk')
                ->references('id')
                ->on('villages')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('citizens');
    }
};
