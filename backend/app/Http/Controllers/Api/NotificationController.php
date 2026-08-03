<?php

namespace App\Http\Controllers\Api;

use App\Models\Notification;
use Illuminate\Http\JsonResponse;

class NotificationController extends BaseCrudController
{
    protected string $model = Notification::class;

    protected array $searchable = ['title', 'message', 'type'];

    protected array $storeRules = [
        'title' => ['required', 'string', 'max:255'],
        'message' => ['required', 'string'],
        'type' => ['required', 'in:Project,Citizen,System,Finance'],
        'read_at' => ['nullable', 'date'],
    ];

    protected array $updateRules = [
        'title' => ['sometimes', 'required', 'string', 'max:255'],
        'message' => ['sometimes', 'required', 'string'],
        'type' => ['sometimes', 'required', 'in:Project,Citizen,System,Finance'],
        'read_at' => ['nullable', 'date'],
    ];

    public function markRead(Notification $notification): JsonResponse
    {
        $notification->forceFill(['read_at' => now()])->save();

        return response()->json($notification);
    }

    public function markAllRead(): JsonResponse
    {
        Notification::query()->whereNull('read_at')->update(['read_at' => now()]);

        return response()->json(['marked_read' => true]);
    }
}
