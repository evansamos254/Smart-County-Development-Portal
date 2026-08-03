<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Citizen;
use App\Models\Project;
use App\Models\Ward;
use Illuminate\Http\JsonResponse;

class ReportController extends Controller
{
    public function analytics(): JsonResponse
    {
        return response()->json([
            'projects_by_status' => Project::query()
                ->selectRaw('status, COUNT(*) as total')
                ->groupBy('status')
                ->pluck('total', 'status'),
            'projects_by_priority' => Project::query()
                ->selectRaw('priority, COUNT(*) as total')
                ->groupBy('priority')
                ->pluck('total', 'priority'),
            'citizens_by_sex' => Citizen::query()
                ->selectRaw('sex, COUNT(*) as total')
                ->groupBy('sex')
                ->pluck('total', 'sex'),
            'projects_by_ward' => Ward::query()
                ->withCount('projects')
                ->orderByDesc('projects_count')
                ->get(['id', 'name']),
            'budget_by_status' => Project::query()
                ->selectRaw('status, SUM(budget) as allocated, SUM(actual_cost) as actual_cost')
                ->groupBy('status')
                ->get(),
        ]);
    }
}
