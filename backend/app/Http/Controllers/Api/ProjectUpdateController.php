<?php

namespace App\Http\Controllers\Api;

use App\Models\Project;
use App\Models\ProjectUpdate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProjectUpdateController extends BaseCrudController
{
    protected string $model = ProjectUpdate::class;

    protected array $with = ['project.ward'];

    protected array $searchable = ['title', 'update_text', 'status'];

    protected array $storeRules = [
        'project_id' => ['required', 'integer', 'exists:projects,id'],
        'title' => ['nullable', 'string', 'max:255'],
        'update_text' => ['required', 'string'],
        'progress' => ['required', 'integer', 'min:0', 'max:100'],
        'status' => ['required', 'in:PLANNED,IN_PROGRESS,COMPLETED,ON_HOLD,CANCELLED'],
    ];

    protected array $updateRules = [
        'project_id' => ['sometimes', 'required', 'integer', 'exists:projects,id'],
        'title' => ['nullable', 'string', 'max:255'],
        'update_text' => ['sometimes', 'required', 'string'],
        'progress' => ['sometimes', 'required', 'integer', 'min:0', 'max:100'],
        'status' => ['sometimes', 'required', 'in:PLANNED,IN_PROGRESS,COMPLETED,ON_HOLD,CANCELLED'],
    ];

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate($this->storeRules);

        return DB::transaction(function () use ($data) {
            $update = ProjectUpdate::create($data);

            $this->syncProjectProgress($update);

            return response()->json($update->load($this->with), 201);
        });
    }

    public function update(Request $request, int|string $id): JsonResponse
    {
        $update = ProjectUpdate::findOrFail($id);
        $update->update($request->validate($this->updateRules));

        $this->syncProjectProgress($update);

        return response()->json($update->load($this->with));
    }

    private function syncProjectProgress(ProjectUpdate $update): void
    {
        $project = Project::findOrFail($update->project_id);

        $project->progress = $update->progress;
        $project->status = $update->status;

        if ($update->status === 'COMPLETED' && $project->completion_date === null) {
            $project->completion_date = now()->toDateString();
        }

        $project->save();
    }
}
