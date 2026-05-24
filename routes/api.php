<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\EmailVerificationController; // ← add this
use App\Http\Controllers\PasswordResetController; // ← add this
use App\Http\Controllers\ContactController;
use Illuminate\Support\Facades\Route;

// ─── Public routes ────────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::post('/email/resend', [EmailVerificationController::class, 'resend'])->middleware('throttle:6,1'); // ← move here public
Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']); // ← add this
Route::post('/reset-password',  [PasswordResetController::class, 'resetPassword']); // ← add this
Route::post('/contact', [ContactController::class, 'store']);

// Doctors list (public)
Route::get('/doctors',                   [DoctorController::class, 'index']);
Route::get('/doctors/{id}',              [DoctorController::class, 'show']);
Route::get('/doctors/{id}/availability', [DoctorController::class, 'getPublicAvailability']); // ✅ Must be here (outside auth)

// Booked slots (public — needed before login)
Route::get('/doctors/{id}/booked-slots', [AppointmentController::class, 'getBookedSlots']);

// Specialties (public)
Route::get('/specialties', [AdminController::class, 'getSpecialties']);

// ✅ Public stats for home page
Route::get('/stats', [AdminController::class, 'stats']);

// ─── Protected routes ─────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']); // ✅ must be POST
    Route::get('/user',    [AuthController::class, 'me']);

    // ─── Email Verification ───────────────────────────────────
    Route::get('/email/verify/{id}/{hash}',        [EmailVerificationController::class, 'verify'])
        ->middleware('signed')
        ->name('verification.verify')
        ->withoutMiddleware('auth:sanctum'); // ← no auth needed, link is signed

    // ─── Doctor routes ────────────────────────────────────────
    Route::get('/doctor/profile',                  [DoctorController::class, 'getProfile']);
    Route::put('/doctor/profile',                  [DoctorController::class, 'updateProfile']);
    Route::put('/doctor/password',                 [DoctorController::class, 'changePassword']);  // ✅
    Route::delete('/doctor/account',[DoctorController::class, 'deleteAccount']);   // ✅
    Route::get('/doctor/availability',             [DoctorController::class, 'getAvailability']);
    Route::post('/doctor/availability',            [DoctorController::class, 'addAvailability']);
    Route::delete('/doctor/availability/{id}',     [DoctorController::class, 'deleteAvailability']);
    Route::get('/doctor/appointments',             [AppointmentController::class, 'doctorAppointments']);
    Route::patch('/doctor/appointments/{id}/status', [AppointmentController::class, 'updateStatus']);

    // ─── Patient routes ───────────────────────────────────────
    Route::get('/patient/profile',                 [PatientController::class, 'getProfile']);
    Route::put('/patient/profile',                 [PatientController::class, 'updateProfile']);
    Route::put('/patient/password',                [PatientController::class, 'changePassword']); // ✅ new
    Route::delete('/patient/account',              [PatientController::class, 'deleteAccount']); // ✅ new
    Route::get('/patient/appointments',            [AppointmentController::class, 'patientAppointments']);
    Route::post('/patient/appointments',           [AppointmentController::class, 'store']);
    Route::put('/patient/appointments/{id}/cancel', [AppointmentController::class, 'cancel']);

    // ─── Admin routes ─────────────────────────────────────────
    Route::middleware('admin')->prefix('admin')->group(function () {
        // Stats
        Route::get('/stats',                       [AdminController::class, 'stats']);

        // Users
        Route::get('/users',                       [AdminController::class, 'getUsers']);
        Route::delete('/users/{id}',               [AdminController::class, 'deleteUser']);

        // Doctor Validation
        Route::get('/doctors/pending',             [AdminController::class, 'getPendingDoctors']);
        Route::patch('/doctors/{id}/status',       [AdminController::class, 'updateDoctorStatus']);

        // Specialties
        Route::get('/specialties',                 [AdminController::class, 'getSpecialties']);
        Route::post('/specialties',                [AdminController::class, 'addSpecialty']);
        Route::delete('/specialties/{id}',         [AdminController::class, 'deleteSpecialty']);

        // Reports
        Route::get('/appointments',                [AdminController::class, 'getAppointments']);
        Route::get('/reports',                     [AdminController::class, 'getReportsData']);
    });
});