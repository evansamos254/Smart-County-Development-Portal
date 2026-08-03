<?php

namespace App\Http\Controllers\Api;

use App\Models\Village;

class VillageController extends BaseCrudController
{
    protected string $model = Village::class;

    protected array $with = ['sublocation.ward.subcounty', 'citizens'];

    protected array $searchable = ['name'];

    protected array $storeRules = [
        'name' => ['required', 'string', 'max:255'],
        'sublocation_id' => ['required', 'integer', 'exists:sublocation,id'],
    ];

    protected array $updateRules = [
        'name' => ['sometimes', 'required', 'string', 'max:255'],
        'sublocation_id' => ['sometimes', 'required', 'integer', 'exists:sublocation,id'],
    ];
}
