<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sublocation extends Model
{
    use HasFactory;

    protected $table = 'sublocation';

    public const UPDATED_AT = null;

    protected $fillable = ['name', 'ward_id'];

    public function ward(): BelongsTo
    {
        return $this->belongsTo(Ward::class);
    }

    public function villages(): HasMany
    {
        return $this->hasMany(Village::class);
    }
}
