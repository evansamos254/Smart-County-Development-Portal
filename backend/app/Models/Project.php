<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory;

    protected $table = 'projects';

    protected $fillable = [
        'serial_number',
        'department',
        'name',
        'description',
        'status',
        'priority',
        'ward_id',
        'start_date',
        'due_date',
        'completion_date',
        'progress',
        'budget',
        'contract_sum',
        'contract_variation',
        'actual_cost',
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
    ];

    protected $casts = [
        'start_date' => 'date:Y-m-d',
        'due_date' => 'date:Y-m-d',
        'completion_date' => 'date:Y-m-d',
        'advertisement_date' => 'date:Y-m-d',
        'evaluation_date' => 'date:Y-m-d',
        'awarding_date' => 'date:Y-m-d',
        'site_handover_date' => 'date:Y-m-d',
        'expected_start_date' => 'date:Y-m-d',
        'sss_date' => 'date:Y-m-d',
        'progress' => 'integer',
        'budget' => 'decimal:2',
        'contract_sum' => 'decimal:2',
        'contract_variation' => 'decimal:2',
        'actual_cost' => 'decimal:2',
        'vote_balance' => 'decimal:2',
        'is_carry_over' => 'boolean',
        'is_emergency' => 'boolean',
    ];

    public function ward(): BelongsTo
    {
        return $this->belongsTo(Ward::class);
    }

    public function updates(): HasMany
    {
        return $this->hasMany(ProjectUpdate::class);
    }
}
