<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('status', ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED'])->default('PLANNED');
            $table->enum('priority', ['LOW', 'MEDIUM', 'HIGH'])->default('MEDIUM');
            $table->unsignedInteger('ward_id');
            $table->date('start_date')->nullable();
            $table->date('due_date')->nullable();
            $table->date('completion_date')->nullable();
            $table->integer('progress')->default(0);
            $table->decimal('budget', 12, 2)->default(0);
            $table->decimal('actual_cost', 12, 2)->default(0);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->foreign('ward_id', 'projects_ward_fk')
                ->references('id')
                ->on('ward')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
        });

        Schema::create('project_updates', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('project_id');
            $table->string('title')->nullable();
            $table->text('update_text');
            $table->integer('progress');
            $table->enum('status', ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED']);
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('project_id', 'project_updates_project_fk')
                ->references('id')
                ->on('projects')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_updates');
        Schema::dropIfExists('projects');
    }
};
