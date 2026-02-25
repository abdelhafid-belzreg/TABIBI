<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DoctorProfile extends Model
{
    protected $fillable = [
        'user_id',
        'specialty',
        'bio',
        'qualifications',
        'consultation_fee',
        'clinic_name',
        'city',
        'location',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}