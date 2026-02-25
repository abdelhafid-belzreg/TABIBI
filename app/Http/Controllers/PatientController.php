<?php

namespace App\Http\Controllers;

use App\Models\PatientProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; // ✅ add this

class PatientController extends Controller
{
    // Get patient profile
    public function getProfile(Request $request)
    {
        $profile = PatientProfile::where('user_id', $request->user()->id)
            ->with('user') // ✅ include user
            ->firstOrFail();

        return response()->json($profile);
    }

    // Update patient profile
    public function updateProfile(Request $request)
    {
        $request->validate([
            'phone'          => 'nullable|string|max:20',
            'date_of_birth'  => 'nullable|date',
            'medical_notes'  => 'nullable|string',
        ]);

        $user = $request->user();

        // ✅ Update phone on user table
        if ($request->has('phone')) {
            $user->update(['phone' => $request->phone]);
        }

        // ✅ Update patient_profile table
        PatientProfile::where('user_id', $user->id)->update([
            'date_of_birth' => $request->date_of_birth,
            'medical_notes' => $request->medical_notes,
        ]);

        return response()->json(['message' => 'Profile updated successfully!']);
    }

    // Change password
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password'          => 'required',
            'new_password'              => 'required|min:8|confirmed',
        ]);

        $user = $request->user();

        // ✅ Use Hash facade directly (no backslash needed)
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect.',
            ], 422);
        }

        // ✅ Update password
        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        // ✅ Revoke all tokens so user is logged out everywhere
        $user->tokens()->delete();

        return response()->json(['message' => 'Password changed successfully.']);
    }

    public function deleteAccount(Request $request)
    {
        $request->validate([
            'password' => 'required',
        ]);

        $user = $request->user();

        // ✅ Verify password before deleting
        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Incorrect password.'], 422);
        }

        // ✅ Revoke all tokens first
        $user->tokens()->delete();

        // ✅ Delete the user (cascades to profiles via DB)
        $user->delete();

        return response()->json(['message' => 'Account deleted successfully.']);
    }
}