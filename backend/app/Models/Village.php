<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Village extends Model
{
    use HasFactory;

    protected $table = 'villages';

    public const UPDATED_AT = null;

    protected $fillable = ['name', 'sublocation_id'];

    public function sublocation(): BelongsTo
    {
        return $this->belongsTo(Sublocation::class);
    }

    public function citizens(): HasMany
    {
        return $this->hasMany(Citizen::class);
    }
}
