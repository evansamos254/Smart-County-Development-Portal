<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $wards = [
        "Agenga'",
        'Bwiri',
        'Namboboto Nambuku',
        'Nangina',
    ];

    public function up(): void
    {
        if (! Schema::hasTable('subcounties') || ! Schema::hasTable('ward')) {
            return;
        }

        $funyulaId = DB::table('subcounties')->where('name', 'Funyula')->value('id');

        if ($funyulaId === null) {
            $funyulaId = DB::table('subcounties')->insertGetId(['name' => 'Funyula']);
        }

        $agengaExists = DB::table('ward')
            ->where('subcounty_id', $funyulaId)
            ->where('name', "Agenga'")
            ->exists();

        if (! $agengaExists) {
            $demoWardId = DB::table('ward')
                ->where('subcounty_id', $funyulaId)
                ->where('name', 'Harbor Ward')
                ->value('id');

            if ($demoWardId !== null) {
                DB::table('ward')->where('id', $demoWardId)->update(['name' => "Agenga'"]);
            } else {
                DB::table('ward')->insert([
                    'name' => "Agenga'",
                    'subcounty_id' => $funyulaId,
                ]);
            }
        }

        foreach (array_slice($this->wards, 1) as $wardName) {
            $exists = DB::table('ward')
                ->where('subcounty_id', $funyulaId)
                ->where('name', $wardName)
                ->exists();

            if (! $exists) {
                DB::table('ward')->insert([
                    'name' => $wardName,
                    'subcounty_id' => $funyulaId,
                ]);
            }
        }

        DB::table('ward')
            ->where('subcounty_id', $funyulaId)
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

        $funyulaId = DB::table('subcounties')->where('name', 'Funyula')->value('id');

        if ($funyulaId === null) {
            return;
        }

        DB::table('ward')
            ->where('subcounty_id', $funyulaId)
            ->whereIn('name', $this->wards)
            ->whereNotIn('id', DB::table('projects')->select('ward_id'))
            ->whereNotIn('id', DB::table('sublocation')->select('ward_id'))
            ->delete();
    }
};
