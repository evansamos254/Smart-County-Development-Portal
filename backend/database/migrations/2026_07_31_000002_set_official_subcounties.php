<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $officialSubcounties = [
        'Teso South',
        'Teso North',
        'Matayos',
        'Funyula',
        'Butula',
        'Budalangi',
        'Nambale',
    ];

    public function up(): void
    {
        if (! Schema::hasTable('subcounties')) {
            return;
        }

        $existingIds = DB::table('subcounties')->orderBy('id')->pluck('id')->all();

        foreach ($this->officialSubcounties as $index => $name) {
            $id = $existingIds[$index] ?? null;

            if ($id !== null) {
                DB::table('subcounties')->where('id', $id)->update(['name' => $name]);
                continue;
            }

            DB::table('subcounties')->insert(['name' => $name]);
        }

        DB::table('subcounties')
            ->whereNotIn('name', $this->officialSubcounties)
            ->whereNotIn('id', DB::table('ward')->select('subcounty_id'))
            ->delete();
    }

    public function down(): void
    {
        //
    }
};
