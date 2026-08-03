<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Setting::query()->pluck('value', 'key'));
    }

    public function update(Request $request, Setting $setting): JsonResponse
    {
        $data = $request->validate([
            'value' => ['required'],
        ]);

        $setting->update($data);

        return response()->json($setting);
    }

    public function bulkUpdate(Request $request): JsonResponse
    {
        $data = $request->validate([
            'settings' => ['required', 'array'],
            'settings.*' => ['required'],
        ]);

        foreach ($data['settings'] as $key => $value) {
            Setting::query()->updateOrCreate(['key' => $key], ['value' => $value]);
        }

        return response()->json(Setting::query()->pluck('value', 'key'));
    }
}
