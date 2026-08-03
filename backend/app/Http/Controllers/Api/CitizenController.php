<?php

namespace App\Http\Controllers\Api;

use App\Models\Citizen;

class CitizenController extends BaseCrudController
{
    protected string $model = Citizen::class;

    protected array $with = ['village.sublocation.ward.subcounty'];

    protected array $searchable = ['full_name', 'phone_number'];

    protected array $storeRules = [
        'full_name' => ['required', 'string', 'max:255'],
        'sex' => ['required', 'in:MALE,FEMALE,OTHER'],
        'phone_number' => ['nullable', 'string', 'max:20'],
        'village_id' => ['required', 'integer', 'exists:villages,id'],
    ];

    protected array $updateRules = [
        'full_name' => ['sometimes', 'required', 'string', 'max:255'],
        'sex' => ['sometimes', 'required', 'in:MALE,FEMALE,OTHER'],
        'phone_number' => ['nullable', 'string', 'max:20'],
        'village_id' => ['sometimes', 'required', 'integer', 'exists:villages,id'],
    ];
}
