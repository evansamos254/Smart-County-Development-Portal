<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $wards = [
        'Angurai East',
        'Angurai North',
        'Angurai South',
        'Malaba Central',
        'Malaba North',
        'Malaba South',
    ];

    public function up(): void
    {
        if (! Schema::hasTable('subcounties') || ! Schema::hasTable('ward')) {
            return;
        }

        $tesoNorthId = DB::table('subcounties')->where('name', 'Teso North')->value('id');

        if ($tesoNorthId === null) {
            $tesoNorthId = DB::table('subcounties')->insertGetId(['name' => 'Teso North']);
        }

        $anguraiEastExists = DB::table('ward')
            ->where('subcounty_id', $tesoNorthId)
            ->where('name', 'Angurai East')
            ->exists();

        if (! $anguraiEastExists) {
            $demoWardId = DB::table('ward')
                ->where('subcounty_id', $tesoNorthId)
                ->where('name', 'Green Valley Ward')
                ->value('id');

            if ($demoWardId !== null) {
                DB::table('ward')->where('id', $demoWardId)->update(['name' => 'Angurai East']);
            } else {
                DB::table('ward')->insert([
                    'name' => 'Angurai East',
                    'subcounty_id' => $tesoNorthId,
                ]);
            }
        }

        foreach (array_slice($this->wards, 1) as $wardName) {
            $exists = DB::table('ward')
                ->where('subcounty_id', $tesoNorthId)
                ->where('name', $wardName)
                ->exists();

            if (! $exists) {
                DB::table('ward')->insert([
                    'name' => $wardName,
                    'subcounty_id' => $tesoNorthId,
                ]);
            }
        }

        DB::table('ward')
            ->where('subcounty_id', $tesoNorthId)
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

        $tesoNorthId = DB::table('subcounties')->where('name', 'Teso North')->value('id');

        if ($tesoNorthId === null) {
            return;
        }

        DB::table('ward')
            ->where('subcounty_id', $tesoNorthId)
            ->whereIn('name', $this->wards)
            ->whereNotIn('id', DB::table('projects')->select('ward_id'))
            ->whereNotIn('id', DB::table('sublocation')->select('ward_id'))
            ->delete();
    }
};
