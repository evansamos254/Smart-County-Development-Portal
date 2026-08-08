<?php

namespace App\Http\Controllers\Api;

use App\Models\Project;

class ProjectController extends BaseCrudController
{
    protected string $model = Project::class;

    protected array $with = ['ward.subcounty', 'updates'];

    protected array $searchable = [
        'serial_number',
        'department',
        'name',
        'description',
        'status',
        'priority',
        'contractor',
        'financial_year',
        'directorate',
        'source_of_funds',
        'funded_from',
        'remarks',
        'ward_hq_project',
    ];

    protected array $storeRules = [
        'serial_number' => ['nullable', 'string', 'max:50'],
        'department' => ['nullable', 'string', 'max:255'],
        'name' => ['required', 'string', 'max:255'],
        'description' => ['nullable', 'string'],
        'status' => ['required', 'in:PLANNED,IN_PROGRESS,COMPLETED,ON_HOLD,CANCELLED'],
        'priority' => ['required', 'in:LOW,MEDIUM,HIGH'],
        'ward_id' => ['required', 'integer', 'exists:ward,id'],
        'start_date' => ['nullable', 'date'],
        'due_date' => ['nullable', 'date'],
        'completion_date' => ['nullable', 'date'],
        'progress' => ['required', 'integer', 'min:0', 'max:100'],
        'budget' => ['nullable', 'numeric', 'min:0'],
        'contract_sum' => ['nullable', 'numeric', 'min:0'],
        'contract_variation' => ['nullable', 'numeric', 'min:0'],
        'actual_cost' => ['nullable', 'numeric', 'min:0'],
        'vote_balance' => ['nullable', 'numeric', 'min:0'],
        'contractor' => ['nullable', 'string', 'max:255'],
        'financial_year' => ['nullable', 'string', 'max:50'],
        'flagship_type' => ['nullable', 'string', 'max:50'],
        'procurement_type' => ['nullable', 'string', 'max:50'],
        'directorate' => ['nullable', 'string', 'max:255'],
        'source_of_funds' => ['nullable', 'string', 'max:255'],
        'funded_from' => ['nullable', 'string', 'max:50'],
        'advertisement_date' => ['nullable', 'date'],
        'evaluation_date' => ['nullable', 'date'],
        'awarding_date' => ['nullable', 'date'],
        'site_handover_date' => ['nullable', 'date'],
        'expected_start_date' => ['nullable', 'date'],
        'sss_date' => ['nullable', 'date'],
        'is_carry_over' => ['nullable', 'boolean'],
        'is_emergency' => ['nullable', 'boolean'],
        'remarks' => ['nullable', 'string'],
        'ward_hq_project' => ['nullable', 'string', 'max:50'],
    ];

    protected array $updateRules = [
        'serial_number' => ['nullable', 'string', 'max:50'],
        'department' => ['nullable', 'string', 'max:255'],
        'name' => ['sometimes', 'required', 'string', 'max:255'],
        'description' => ['nullable', 'string'],
        'status' => ['sometimes', 'required', 'in:PLANNED,IN_PROGRESS,COMPLETED,ON_HOLD,CANCELLED'],
        'priority' => ['sometimes', 'required', 'in:LOW,MEDIUM,HIGH'],
        'ward_id' => ['sometimes', 'required', 'integer', 'exists:ward,id'],
        'start_date' => ['nullable', 'date'],
        'due_date' => ['nullable', 'date'],
        'completion_date' => ['nullable', 'date'],
        'progress' => ['sometimes', 'required', 'integer', 'min:0', 'max:100'],
        'budget' => ['nullable', 'numeric', 'min:0'],
        'contract_sum' => ['nullable', 'numeric', 'min:0'],
        'contract_variation' => ['nullable', 'numeric', 'min:0'],
        'actual_cost' => ['nullable', 'numeric', 'min:0'],
        'vote_balance' => ['nullable', 'numeric', 'min:0'],
        'contractor' => ['nullable', 'string', 'max:255'],
        'financial_year' => ['nullable', 'string', 'max:50'],
        'flagship_type' => ['nullable', 'string', 'max:50'],
        'procurement_type' => ['nullable', 'string', 'max:50'],
        'directorate' => ['nullable', 'string', 'max:255'],
        'source_of_funds' => ['nullable', 'string', 'max:255'],
        'funded_from' => ['nullable', 'string', 'max:50'],
        'advertisement_date' => ['nullable', 'date'],
        'evaluation_date' => ['nullable', 'date'],
        'awarding_date' => ['nullable', 'date'],
        'site_handover_date' => ['nullable', 'date'],
        'expected_start_date' => ['nullable', 'date'],
        'sss_date' => ['nullable', 'date'],
        'is_carry_over' => ['nullable', 'boolean'],
        'is_emergency' => ['nullable', 'boolean'],
        'remarks' => ['nullable', 'string'],
        'ward_hq_project' => ['nullable', 'string', 'max:50'],
    ];
}
