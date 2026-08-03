<?php

use App\Http\Controllers\Api\CitizenController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ProjectUpdateController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\SubcountyController;
use App\Http\Controllers\Api\SublocationController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\VillageController;
use App\Http\Controllers\Api\WardController;
use Illuminate\Support\Facades\Route;

Route::get('dashboard/summary', [DashboardController::class, 'summary']);
Route::get('reports/analytics', [ReportController::class, 'analytics']);

Route::apiResource('subcounties', SubcountyController::class);
Route::apiResource('wards', WardController::class);
Route::apiResource('sublocations', SublocationController::class);
Route::apiResource('villages', VillageController::class);
Route::apiResource('citizens', CitizenController::class);
Route::apiResource('projects', ProjectController::class);
Route::apiResource('project-updates', ProjectUpdateController::class);
Route::apiResource('users', UserController::class);
Route::apiResource('notifications', NotificationController::class);

Route::get('settings', [SettingController::class, 'index']);
Route::put('settings', [SettingController::class, 'bulkUpdate']);
Route::put('settings/{setting:key}', [SettingController::class, 'update']);

Route::post('notifications/{notification}/read', [NotificationController::class, 'markRead']);
Route::post('notifications/read-all', [NotificationController::class, 'markAllRead']);
