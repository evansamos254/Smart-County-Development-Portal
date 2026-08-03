<?php

namespace App\Http\Controllers\Api;

use App\Models\Project;

class ProjectController extends BaseCrudController
{
    protected string $model = Project::class;

    protected array $with = ['ward.subcounty', 'updates'];

    protected array $searchable = ['name', 'description', 'status', 'priority'];

    protected array $storeRules = [
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
        'actual_cost' => ['nullable', 'numeric', 'min:0'],
    ];

    protected array $updateRules = [
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
        'actual_cost' => ['nullable', 'numeric', 'min:0'],
    ];
}
