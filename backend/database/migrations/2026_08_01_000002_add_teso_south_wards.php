<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $wards = [
        'Amukura Central',
        'Amukura East',
        'Amukura West',
        'Angorom',
        'Chakol North',
        'Chakol South',
    ];

    public function up(): void
    {
        if (! Schema::hasTable('subcounties') || ! Schema::hasTable('ward')) {
            return;
        }

        $tesoSouthId = DB::table('subcounties')->where('name', 'Teso South')->value('id');

        if ($tesoSouthId === null) {
            $tesoSouthId = DB::table('subcounties')->insertGetId(['name' => 'Teso South']);
        }

        $this->renameOrInsert($tesoSouthId, 'Market Ward', 'Amukura Central');
        $this->renameOrInsert($tesoSouthId, 'Railway Ward', 'Amukura East');

        foreach (array_slice($this->wards, 2) as $wardName) {
            $exists = DB::table('ward')
                ->where('subcounty_id', $tesoSouthId)
                ->where('name', $wardName)
                ->exists();

            if (! $exists) {
                DB::table('ward')->insert([
                    'name' => $wardName,
                    'subcounty_id' => $tesoSouthId,
                ]);
            }
        }

        DB::table('ward')
            ->where('subcounty_id', $tesoSouthId)
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

        $tesoSouthId = DB::table('subcounties')->where('name', 'Teso South')->value('id');

        if ($tesoSouthId === null) {
            return;
        }

        DB::table('ward')
            ->where('subcounty_id', $tesoSouthId)
            ->whereIn('name', $this->wards)
            ->whereNotIn('id', DB::table('projects')->select('ward_id'))
            ->whereNotIn('id', DB::table('sublocation')->select('ward_id'))
            ->delete();
    }

    private function renameOrInsert(int $subcountyId, string $oldName, string $newName): void
    {
        $exists = DB::table('ward')
            ->where('subcounty_id', $subcountyId)
            ->where('name', $newName)
            ->exists();

        if ($exists) {
            return;
        }

        $demoWardId = DB::table('ward')
            ->where('subcounty_id', $subcountyId)
            ->where('name', $oldName)
            ->value('id');

        if ($demoWardId !== null) {
            DB::table('ward')->where('id', $demoWardId)->update(['name' => $newName]);
            return;
        }

        DB::table('ward')->insert([
            'name' => $newName,
            'subcounty_id' => $subcountyId,
        ]);
    }
};
