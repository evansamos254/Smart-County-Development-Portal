<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $wards = [
        'Bunyala Central',
        'Bunyala North',
        'Bunyala South',
        'Bunyala West',
    ];

    public function up(): void
    {
        if (! Schema::hasTable('subcounties') || ! Schema::hasTable('ward')) {
            return;
        }

        $budalangiId = DB::table('subcounties')->where('name', 'Budalangi')->value('id');

        if ($budalangiId === null) {
            $budalangiId = DB::table('subcounties')->insertGetId(['name' => 'Budalangi']);
        }

        foreach ($this->wards as $wardName) {
            $exists = DB::table('ward')
                ->where('subcounty_id', $budalangiId)
                ->where('name', $wardName)
                ->exists();

            if (! $exists) {
                DB::table('ward')->insert([
                    'name' => $wardName,
                    'subcounty_id' => $budalangiId,
                ]);
            }
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('subcounties') || ! Schema::hasTable('ward')) {
            return;
        }

        $budalangiId = DB::table('subcounties')->where('name', 'Budalangi')->value('id');

        if ($budalangiId === null) {
            return;
        }

        DB::table('ward')
            ->where('subcounty_id', $budalangiId)
            ->whereIn('name', $this->wards)
            ->whereNotIn('id', DB::table('projects')->select('ward_id'))
            ->whereNotIn('id', DB::table('sublocation')->select('ward_id'))
            ->delete();
    }
};
