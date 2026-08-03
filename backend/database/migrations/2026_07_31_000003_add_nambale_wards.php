<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $wards = [
        'Bukhayo Central',
        'Bukhayo East',
        'Bukhayo North/Walatsi',
        'Nambale Township',
    ];

    public function up(): void
    {
        if (! Schema::hasTable('subcounties') || ! Schema::hasTable('ward')) {
            return;
        }

        $nambaleId = DB::table('subcounties')->where('name', 'Nambale')->value('id');

        if ($nambaleId === null) {
            $nambaleId = DB::table('subcounties')->insertGetId(['name' => 'Nambale']);
        }

        foreach ($this->wards as $wardName) {
            $exists = DB::table('ward')
                ->where('subcounty_id', $nambaleId)
                ->where('name', $wardName)
                ->exists();

            if (! $exists) {
                DB::table('ward')->insert([
                    'name' => $wardName,
                    'subcounty_id' => $nambaleId,
                ]);
            }
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('subcounties') || ! Schema::hasTable('ward')) {
            return;
        }

        $nambaleId = DB::table('subcounties')->where('name', 'Nambale')->value('id');

        if ($nambaleId === null) {
            return;
        }

        DB::table('ward')
            ->where('subcounty_id', $nambaleId)
            ->whereIn('name', $this->wards)
            ->whereNotIn('id', DB::table('projects')->select('ward_id'))
            ->whereNotIn('id', DB::table('sublocation')->select('ward_id'))
            ->delete();
    }
};
