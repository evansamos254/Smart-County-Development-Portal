<?php

namespace App\Http\Controllers\Api;

use App\Models\Sublocation;

class SublocationController extends BaseCrudController
{
    protected string $model = Sublocation::class;

    protected array $with = ['ward.subcounty', 'villages'];

    protected array $searchable = ['name'];

    protected array $storeRules = [
        'name' => ['required', 'string', 'max:255'],
        'ward_id' => ['required', 'integer', 'exists:ward,id'],
    ];

    protected array $updateRules = [
        'name' => ['sometimes', 'required', 'string', 'max:255'],
        'ward_id' => ['sometimes', 'required', 'integer', 'exists:ward,id'],
    ];
}
