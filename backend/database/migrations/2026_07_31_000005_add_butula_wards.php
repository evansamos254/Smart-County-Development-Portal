<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $wards = [
        'Elugulu',
        'Kingandole',
        'Marachi Central',
        'Marachi East',
        'Marachi North',
        'Marachi West',
    ];

    public function up(): void
    {
        if (! Schema::hasTable('subcounties') || ! Schema::hasTable('ward')) {
            return;
        }

        $butulaId = DB::table('subcounties')->where('name', 'Butula')->value('id');

        if ($butulaId === null) {
            $butulaId = DB::table('subcounties')->insertGetId(['name' => 'Butula']);
        }

        foreach ($this->wards as $wardName) {
            $exists = DB::table('ward')
                ->where('subcounty_id', $butulaId)
                ->where('name', $wardName)
                ->exists();

            if (! $exists) {
                DB::table('ward')->insert([
                    'name' => $wardName,
                    'subcounty_id' => $butulaId,
                ]);
            }
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('subcounties') || ! Schema::hasTable('ward')) {
            return;
        }

        $butulaId = DB::table('subcounties')->where('name', 'Butula')->value('id');

        if ($butulaId === null) {
            return;
        }

        DB::table('ward')
            ->where('subcounty_id', $butulaId)
            ->whereIn('name', $this->wards)
            ->whereNotIn('id', DB::table('projects')->select('ward_id'))
            ->whereNotIn('id', DB::table('sublocation')->select('ward_id'))
            ->delete();
    }
};
