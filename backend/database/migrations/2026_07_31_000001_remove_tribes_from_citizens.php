<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('citizens') && Schema::hasColumn('citizens', 'tribe_id')) {
            Schema::table('citizens', function (Blueprint $table) {
                $table->dropForeign('citizens_tribe_fk');
                $table->dropColumn('tribe_id');
            });
        }

        Schema::dropIfExists('tribes');
    }

    public function down(): void
    {
        if (! Schema::hasTable('tribes')) {
            Schema::create('tribes', function (Blueprint $table) {
                $table->increments('id');
                $table->string('name')->unique('tribes_name_key');
                $table->timestamp('created_at')->useCurrent();
            });
        }

        if (Schema::hasTable('citizens') && ! Schema::hasColumn('citizens', 'tribe_id')) {
            Schema::table('citizens', function (Blueprint $table) {
                $table->unsignedInteger('tribe_id')->nullable()->after('village_id');
                $table->foreign('tribe_id', 'citizens_tribe_fk')
                    ->references('id')
                    ->on('tribes')
                    ->cascadeOnUpdate()
                    ->restrictOnDelete();
            });
        }
    }
};
