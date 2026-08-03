<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ward extends Model
{
    use HasFactory;

    protected $table = 'ward';

    public const UPDATED_AT = null;

    protected $fillable = ['name', 'subcounty_id'];

    public function subcounty(): BelongsTo
    {
        return $this->belongsTo(Subcounty::class);
    }

    public function sublocations(): HasMany
    {
        return $this->hasMany(Sublocation::class);
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }
}
