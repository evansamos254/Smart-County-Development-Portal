<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends BaseCrudController
{
    protected string $model = User::class;

    protected array $searchable = ['name', 'email', 'role', 'status'];

    protected array $storeRules = [
        'name' => ['required', 'string', 'max:255'],
        'email' => ['required', 'email', 'max:255', 'unique:users,email'],
        'password' => ['nullable', 'string', 'min:8'],
        'role' => ['required', 'in:System Administrator,Governor,Clerk / Secretary'],
        'status' => ['required', 'in:Active,Invited,Suspended'],
        'last_active_at' => ['nullable', 'date'],
    ];

    protected array $updateRules = [
        'name' => ['sometimes', 'required', 'string', 'max:255'],
        'email' => ['sometimes', 'required', 'email', 'max:255'],
        'password' => ['nullable', 'string', 'min:8'],
        'role' => ['sometimes', 'required', 'in:System Administrator,Governor,Clerk / Secretary'],
        'status' => ['sometimes', 'required', 'in:Active,Invited,Suspended'],
        'last_active_at' => ['nullable', 'date'],
    ];

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate($this->storeRules);
        $data['password'] = Hash::make($data['password'] ?? bin2hex(random_bytes(16)));

        $user = User::create($data);

        return response()->json($user, 201);
    }

    public function update(Request $request, int|string $id): JsonResponse
    {
        $data = $request->validate($this->updateRules);

        if (array_key_exists('password', $data) && $data['password'] !== null) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user = User::findOrFail($id);
        $user->update($data);

        return response()->json($user);
    }
}
