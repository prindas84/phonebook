<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PhoneNumberController;

Route::get('/', [PhoneNumberController::class, 'index'])
    ->name('phone_numbers.index');

Route::get('/record/create', [PhoneNumberController::class, 'create'])
    ->name('phone_numbers.create');

Route::post('/record/store', [PhoneNumberController::class, 'store'])
    ->name('phone_numbers.store');

Route::get('/record/{phoneNumber}', [PhoneNumberController::class, 'show'])
    ->name('phone_numbers.show');

Route::put('/record/{phoneNumber}', [PhoneNumberController::class, 'update'])
    ->name('phone_numbers.update');

Route::delete('/record/{phoneNumber}', [PhoneNumberController::class, 'destroy'])
    ->name('phone_numbers.destroy');