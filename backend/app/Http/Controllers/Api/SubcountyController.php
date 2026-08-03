<?php

namespace App\Http\Controllers\Api;

use App\Models\Subcounty;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubcountyController extends BaseCrudController
{
    protected string $model = Subcounty::class;

    protected array $with = ['wards'];

    protected array $searchable = ['name'];

    protected array $storeRules = [
        'name' => ['required', 'string', 'max:255', 'unique:subcounties,name'],
    ];

    protected array $updateRules = [
        'name' => ['sometimes', 'required', 'string', 'max:255'],
    ];

    public function store(Request $request): JsonResponse
    {
        return response()->json(['message' => 'Subcounties are fixed and cannot be added from the portal.'], 403);
    }

    public function update(Request $request, int|string $id): JsonResponse
    {
        return response()->json(['message' => 'Subcounties are fixed and cannot be edited from the portal.'], 403);
    }

    public function destroy(int|string $id): JsonResponse
    {
        return response()->json(['message' => 'Subcounties are fixed and cannot be deleted from the portal.'], 403);
    }
}
