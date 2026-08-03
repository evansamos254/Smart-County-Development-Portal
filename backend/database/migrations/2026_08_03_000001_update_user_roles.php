<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('users')) {
            return;
        }

        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY role VARCHAR(64) NOT NULL DEFAULT 'Governor'");
        }

        DB::table('users')->where('role', 'Administrator')->update(['role' => 'System Administrator']);
        DB::table('users')->whereIn('role', ['Planner', 'Viewer'])->update(['role' => 'Governor']);
        DB::table('users')->where('role', 'Field Officer')->update(['role' => 'Clerk / Secretary']);

        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY role ENUM('System Administrator', 'Governor', 'Clerk / Secretary') NOT NULL DEFAULT 'Governor'");
        }
    }

    public function down(): void
    {
        if (!Schema::hasTable('users')) {
            return;
        }

        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY role VARCHAR(64) NOT NULL DEFAULT 'Viewer'");
        }

        DB::table('users')->where('role', 'System Administrator')->update(['role' => 'Administrator']);
        DB::table('users')->where('role', 'Governor')->update(['role' => 'Viewer']);
        DB::table('users')->where('role', 'Clerk / Secretary')->update(['role' => 'Field Officer']);

        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY role ENUM('Administrator', 'Planner', 'Field Officer', 'Viewer') NOT NULL DEFAULT 'Viewer'");
        }
    }
};
