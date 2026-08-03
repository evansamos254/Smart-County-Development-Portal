<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Citizen;
use App\Models\Notification;
use App\Models\Project;
use App\Models\Subcounty;
use App\Models\Sublocation;
use App\Models\Village;
use App\Models\Ward;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function summary(): JsonResponse
    {
        $projectCount = Project::query()->count();
        $totalBudget = (float) Project::query()->sum('budget');
        $actualCost = (float) Project::query()->sum('actual_cost');
        $averageProgress = $projectCount > 0 ? round((float) Project::query()->avg('progress')) : 0;

        return response()->json([
            'counts' => [
                'citizens' => Citizen::query()->count(),
                'subcounties' => Subcounty::query()->count(),
                'wards' => Ward::query()->count(),
                'sublocations' => Sublocation::query()->count(),
                'villages' => Village::query()->count(),
                'projects' => $projectCount,
                'unread_notifications' => Notification::query()->whereNull('read_at')->count(),
            ],
            'budget' => [
                'allocated' => $totalBudget,
                'actual_cost' => $actualCost,
                'utilization_percent' => $totalBudget > 0 ? round(($actualCost / $totalBudget) * 100) : 0,
            ],
            'average_progress' => $averageProgress,
            'recent_projects' => Project::query()->with('ward')->latest()->limit(5)->get(),
        ]);
    }
}
