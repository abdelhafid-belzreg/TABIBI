<?php


namespace App\Http\Controllers;

use App\Models\Availability;
use App\Models\DoctorProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; // ✅ make sure this is imported

class DoctorController extends Controller
{
    // Get all doctors (public)
    public function index(Request $request)
    {
        $query = User::where('role', 'doctor')
            ->with(['doctorProfile', 'availabilities']) // ✅ include availabilities
            ->whereHas('doctorProfile', fn($q) => $q->where('status', 'approved'));

        return response()->json($query->get());
    }

    // Get single doctor (public)
    public function show($id)
    {
        $doctor = User::where('role', 'doctor')
            ->with(['doctorProfile', 'availabilities'])
            ->findOrFail($id);

        return response()->json($doctor);
    }

    // Get doctor profile (authenticated doctor)
    public function getProfile(Request $request)
    {
        $user    = $request->user();
        $profile = $user->doctorProfile;

        return response()->json([
            'full_name'        => $user->name,
            'phone'            => $user->phone,
            'specialty'        => $profile?->specialty,
            'bio'              => $profile?->bio,
            'qualifications'   => $profile?->qualifications,
            'consultation_fee' => $profile?->consultation_fee,
            'clinic_name'      => $profile?->clinic_name,
            'city'             => $profile?->city,
            'location'         => $profile?->location,
        ]);
    }

    // Update doctor profile (authenticated doctor)
    public function updateProfile(Request $request)
    {
        $request->validate([
            'full_name'        => 'required|string|max:255',
            'phone'            => 'nullable|string',
            'specialty'        => 'nullable|string',
            'bio'              => 'nullable|string',
            'qualifications'   => 'nullable|string',
            'consultation_fee' => 'nullable|numeric|min:0',
            'clinic_name'      => 'nullable|string',
            'city'             => 'nullable|string',
            'location'         => 'nullable|string',
        ]);

        $user = $request->user();
        $user->update([
            'name'  => $request->full_name,
            'phone' => $request->phone,
        ]);

        DoctorProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'specialty'        => $request->specialty,
                'bio'              => $request->bio,
                'qualifications'   => $request->qualifications,
                'consultation_fee' => $request->consultation_fee,
                'clinic_name'      => $request->clinic_name,
                'city'             => $request->city,
                'location'         => $request->location,
            ]
        );

        return response()->json(['message' => 'Profile updated successfully!']);
    }

    // Get availability slots
    public function getAvailability(Request $request)
    {
        $slots = Availability::where('doctor_id', $request->user()->id)->get();
        return response()->json($slots);
    }

    // Add availability slot
    public function addAvailability(Request $request)
    {
        $request->validate([
            'day_of_week' => 'required|integer|min:0|max:6',
            'start_time'  => 'required|date_format:H:i',
            'end_time'    => 'required|date_format:H:i|after:start_time',
        ]);

        $slot = Availability::create([
            'doctor_id'   => $request->user()->id,
            'day_of_week' => $request->day_of_week,
            'start_time'  => $request->start_time,
            'end_time'    => $request->end_time,
        ]);

        return response()->json($slot, 201);
    }

    // Delete availability slot
    public function deleteAvailability(Request $request, $id)
    {
        $slot = Availability::where('id', $id)
            ->where('doctor_id', $request->user()->id)
            ->firstOrFail();

        $slot->delete();

        return response()->json(['message' => 'Slot deleted successfully!']);
    }

    // Get doctor availability (public)
    public function getPublicAvailability($id)
    {
        $slots = Availability::where('doctor_id', $id)
                    ->orderBy('day_of_week')
                    ->get();
        return response()->json($slots);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password'     => 'required|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect.'], 422);
        }

        $user->update(['password' => Hash::make($request->new_password)]);
        $user->tokens()->delete();

        return response()->json(['message' => 'Password changed successfully.']);
    }

    public function deleteAccount(Request $request)
    {
        $request->validate(['password' => 'required']);

        $user = $request->user();

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Incorrect password.'], 422);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'Account deleted successfully.']);
    }
}