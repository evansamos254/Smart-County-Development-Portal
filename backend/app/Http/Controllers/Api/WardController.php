<?php

namespace App\Http\Controllers\Api;

use App\Models\Subcounty;
use App\Models\Ward;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WardController extends BaseCrudController
{
    private const LOCKED_SUBCOUNTIES = ['Nambale', 'Budalangi', 'Butula', 'Funyula', 'Matayos', 'Teso North', 'Teso South'];

    protected string $model = Ward::class;

    protected array $with = ['subcounty', 'sublocations', 'projects'];

    protected array $searchable = ['name'];

    protected array $storeRules = [
        'name' => ['required', 'string', 'max:255'],
        'subcounty_id' => ['required', 'integer', 'exists:subcounties,id'],
    ];

    protected array $updateRules = [
        'name' => ['sometimes', 'required', 'string', 'max:255'],
        'subcounty_id' => ['sometimes', 'required', 'integer', 'exists:subcounties,id'],
    ];

    public function store(Request $request): JsonResponse
    {
        $payload = $request->validate($this->storeRules);
        $subcounty = Subcounty::query()->findOrFail($payload['subcounty_id']);

        if ($this->isLockedSubcounty($subcounty->name)) {
            return response()->json(['message' => "{$subcounty->name} wards are fixed and cannot be added from the portal."], 403);
        }

        $record = Ward::query()->create($payload);

        return response()->json($record->load($this->with), 201);
    }

    public function update(Request $request, int|string $id): JsonResponse
    {
        $record = Ward::query()->with('subcounty')->findOrFail($id);
        $payload = $request->validate($this->updateRules);
        $targetSubcountyId = $payload['subcounty_id'] ?? $record->subcounty_id;
        $targetSubcounty = Subcounty::query()->findOrFail($targetSubcountyId);

        if ($this->isLockedSubcounty($record->subcounty?->name) || $this->isLockedSubcounty($targetSubcounty->name)) {
            return response()->json(['message' => 'Fixed subcounty wards cannot be edited from the portal.'], 403);
        }

        $record->update($payload);

        return response()->json($record->load($this->with));
    }

    public function destroy(int|string $id): JsonResponse
    {
        $record = Ward::query()->with('subcounty')->findOrFail($id);

        if ($this->isLockedSubcounty($record->subcounty?->name)) {
            return response()->json(['message' => 'Fixed subcounty wards cannot be deleted from the portal.'], 403);
        }

        $record->delete();

        return response()->json(status: 204);
    }

    private function isLockedSubcounty(?string $name): bool
    {
        return in_array($name, self::LOCKED_SUBCOUNTIES, true);
    }
}
