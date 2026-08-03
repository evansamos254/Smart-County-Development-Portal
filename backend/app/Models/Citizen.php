<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Citizen extends Model
{
    use HasFactory;

    protected $table = 'citizens';

    public const UPDATED_AT = null;

    protected $fillable = ['full_name', 'sex', 'phone_number', 'village_id'];

    public function village(): BelongsTo
    {
        return $this->belongsTo(Village::class);
    }
}
