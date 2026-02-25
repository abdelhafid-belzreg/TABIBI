<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\DoctorProfile;
use App\Models\PatientProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'email'       => 'required|email|unique:users',
            'password'    => 'required|min:6|confirmed',
            'role'        => 'required|in:patient,doctor',
            'cin'         => 'required|string|unique:users',
            'phone'       => 'nullable|string',
            'clinic_name' => 'nullable|string',
            'city'        => 'nullable|string',
            'location'    => 'nullable|string',
            'specialty'   => 'nullable|string',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role,
            'cin'      => $request->cin,
            'phone'    => $request->phone,
        ]);

        event(new Registered($user)); // ← this triggers the verification email

        if ($request->role === 'doctor') {
            DoctorProfile::create([
                'user_id'     => $user->id,
                'specialty'   => $request->specialty,
                'clinic_name' => $request->clinic_name,
                'city'        => $request->city,
                'location'    => $request->location,
                'status'      => 'pending',
            ]);
        } else {
            PatientProfile::create([
                'user_id' => $user->id,
            ]);
        }

        return response()->json(['message' => 'Account created successfully!'], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        // ✅ Check credentials FIRST before doing anything else
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // ✅ THEN revoke old tokens & create new one
        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => [
                'id'                => $user->id,
                'name'              => $user->name,
                'email'             => $user->email,
                'role'              => $user->role,
                'email_verified_at' => $user->email_verified_at, // make sure this is here
            ],
        ]);
    }

    public function logout(Request $request)
    {
        // ✅ Revoke current token (Sanctum)
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
            'role' => $request->user()->role,
        ]);
    }
}