<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhoneNumber extends Model
{
    use HasFactory;

    protected $table = 'phone_numbers';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'first_name',
        'surname',
        'phone',
        'address_1',
        'address_2',
        'city',
        'state',
        'postcode',
    ];
}
