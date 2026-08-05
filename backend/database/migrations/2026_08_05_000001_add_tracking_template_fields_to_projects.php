<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->string('serial_number', 50)->nullable()->after('id');
            $table->string('department')->nullable()->default('Public Works, Roads and Transport')->after('serial_number');
            $table->decimal('contract_sum', 12, 2)->default(0)->after('budget');
            $table->decimal('contract_variation', 12, 2)->default(0)->after('contract_sum');
            $table->decimal('vote_balance', 12, 2)->default(0)->after('actual_cost');
            $table->string('contractor')->nullable()->after('vote_balance');
            $table->string('financial_year', 50)->nullable()->after('contractor');
            $table->string('flagship_type', 50)->nullable()->default('non flagship')->after('financial_year');
            $table->string('procurement_type', 50)->nullable()->default('procurable')->after('flagship_type');
            $table->string('directorate')->nullable()->after('procurement_type');
            $table->string('source_of_funds')->nullable()->after('directorate');
            $table->string('funded_from', 50)->nullable()->after('source_of_funds');
            $table->date('advertisement_date')->nullable()->after('funded_from');
            $table->date('evaluation_date')->nullable()->after('advertisement_date');
            $table->date('awarding_date')->nullable()->after('evaluation_date');
            $table->date('site_handover_date')->nullable()->after('awarding_date');
            $table->date('expected_start_date')->nullable()->after('site_handover_date');
            $table->date('sss_date')->nullable()->after('expected_start_date');
            $table->boolean('is_carry_over')->default(false)->after('sss_date');
            $table->boolean('is_emergency')->default(false)->after('is_carry_over');
            $table->text('remarks')->nullable()->after('is_emergency');
            $table->string('ward_hq_project', 50)->nullable()->after('remarks');
        });

        DB::statement('UPDATE projects SET contract_sum = budget WHERE contract_sum = 0');
        DB::statement('UPDATE projects SET vote_balance = GREATEST(budget - actual_cost, 0) WHERE vote_balance = 0');
        DB::statement('UPDATE projects SET sss_date = due_date WHERE sss_date IS NULL AND due_date IS NOT NULL');
        DB::statement('UPDATE projects SET expected_start_date = start_date WHERE expected_start_date IS NULL AND start_date IS NOT NULL');
        DB::statement("UPDATE projects SET serial_number = id WHERE serial_number IS NULL OR serial_number = ''");
        DB::statement("UPDATE projects SET financial_year = 'FY2026/2027' WHERE financial_year IS NULL OR financial_year = ''");
        DB::statement("UPDATE projects SET directorate = 'Roads' WHERE directorate IS NULL OR directorate = ''");
        DB::statement("UPDATE projects SET source_of_funds = 'GOK' WHERE source_of_funds IS NULL OR source_of_funds = ''");
        DB::statement("UPDATE projects SET funded_from = 'both' WHERE funded_from IS NULL OR funded_from = ''");
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn([
                'serial_number',
                'department',
                'contract_sum',
                'contract_variation',
                'vote_balance',
                'contractor',
                'financial_year',
                'flagship_type',
                'procurement_type',
                'directorate',
                'source_of_funds',
                'funded_from',
                'advertisement_date',
                'evaluation_date',
                'awarding_date',
                'site_handover_date',
                'expected_start_date',
                'sss_date',
                'is_carry_over',
                'is_emergency',
                'remarks',
                'ward_hq_project',
            ]);
        });
    }
};
