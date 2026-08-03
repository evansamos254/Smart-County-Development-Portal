<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $wards = [
        'Bukhayo West',
        'Burumba',
        'Busibwabo',
        'Matayos South',
        'Mayenje',
    ];

    public function up(): void
    {
        if (! Schema::hasTable('subcounties') || ! Schema::hasTable('ward')) {
            return;
        }

        $matayosId = DB::table('subcounties')->where('name', 'Matayos')->value('id');

        if ($matayosId === null) {
            $matayosId = DB::table('subcounties')->insertGetId(['name' => 'Matayos']);
        }

        $bukhayoWestExists = DB::table('ward')
            ->where('subcounty_id', $matayosId)
            ->where('name', 'Bukhayo West')
            ->exists();

        if (! $bukhayoWestExists) {
            $demoWardId = DB::table('ward')
                ->where('subcounty_id', $matayosId)
                ->where('name', 'Hilltop Ward')
                ->value('id');

            if ($demoWardId !== null) {
                DB::table('ward')->where('id', $demoWardId)->update(['name' => 'Bukhayo West']);
            } else {
                DB::table('ward')->insert([
                    'name' => 'Bukhayo West',
                    'subcounty_id' => $matayosId,
                ]);
            }
        }

        foreach (array_slice($this->wards, 1) as $wardName) {
            $exists = DB::table('ward')
                ->where('subcounty_id', $matayosId)
                ->where('name', $wardName)
                ->exists();

            if (! $exists) {
                DB::table('ward')->insert([
                    'name' => $wardName,
                    'subcounty_id' => $matayosId,
                ]);
            }
        }

        DB::table('ward')
            ->where('subcounty_id', $matayosId)
            ->whereNotIn('name', $this->wards)
            ->whereNotIn('id', DB::table('projects')->select('ward_id'))
            ->whereNotIn('id', DB::table('sublocation')->select('ward_id'))
            ->delete();
    }

    public function down(): void
    {
        if (! Schema::hasTable('subcounties') || ! Schema::hasTable('ward')) {
            return;
        }

        $matayosId = DB::table('subcounties')->where('name', 'Matayos')->value('id');

        if ($matayosId === null) {
            return;
        }

        DB::table('ward')
            ->where('subcounty_id', $matayosId)
            ->whereIn('name', $this->wards)
            ->whereNotIn('id', DB::table('projects')->select('ward_id'))
            ->whereNotIn('id', DB::table('sublocation')->select('ward_id'))
            ->delete();
    }
};
