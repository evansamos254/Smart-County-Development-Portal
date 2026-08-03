<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('about:portal', function () {
    $this->info('Smart County Development Portal API');
})->purpose('Display portal API information');
