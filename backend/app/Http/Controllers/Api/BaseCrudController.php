<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

abstract class BaseCrudController extends Controller
{
    protected string $model;

    protected array $with = [];

    protected array $searchable = [];

    protected array $storeRules = [];

    protected array $updateRules = [];

    public function index(Request $request): JsonResponse
    {
        $query = ($this->model)::query()->with($this->with);

        if ($request->filled('search') && count($this->searchable) > 0) {
            $search = '%' . $request->string('search')->trim() . '%';

            $query->where(function ($query) use ($search) {
                foreach ($this->searchable as $column) {
                    $query->orWhere($column, 'like', $search);
                }
            });
        }

        $perPage = min(max((int) $request->integer('per_page', 100), 1), 100);

        return response()->json($query->orderByDesc('id')->paginate($perPage));
    }

    public function store(Request $request): JsonResponse
    {
        $record = ($this->model)::create($request->validate($this->storeRules));

        return response()->json($record->load($this->with), 201);
    }

    public function show(int|string $id): JsonResponse
    {
        return response()->json(($this->model)::with($this->with)->findOrFail($id));
    }

    public function update(Request $request, int|string $id): JsonResponse
    {
        $record = ($this->model)::findOrFail($id);

        $record->update($request->validate($this->updateRules));

        return response()->json($record->load($this->with));
    }

    public function destroy(int|string $id): JsonResponse
    {
        ($this->model)::findOrFail($id)->delete();

        return response()->json(status: 204);
    }
}
