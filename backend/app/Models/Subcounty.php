<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subcounty extends Model
{
    use HasFactory;

    protected $table = 'subcounties';

    public const UPDATED_AT = null;

    protected $fillable = ['name'];

    public function wards()
    {
        return $this->hasMany(Ward::class);
    }
}
