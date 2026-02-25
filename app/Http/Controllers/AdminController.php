<?php


namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Specialty;
use App\Models\Appointment;
use App\Models\DoctorProfile;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // ─── Stats ───────────────────────────────────────────────

    public function stats(Request $request)
    {
        return response()->json([
            'total_users'        => User::count(),
            'total_doctors'      => User::where('role', 'doctor')->count(),
            'total_patients'     => User::where('role', 'patient')->count(),
            'total_appointments' => Appointment::count(),
            'pending_doctors'    => User::where('role', 'doctor')
                                        ->whereHas('doctorProfile', fn($q) => $q->where('status', 'pending'))
                                        ->count(),
            'total_specialties'  => Specialty::count(),
            'appointments_by_status' => [
                'pending'   => Appointment::where('status', 'pending')->count(),
                'accepted'  => Appointment::where('status', 'accepted')->count(),
                'completed' => Appointment::where('status', 'completed')->count(),
                'cancelled' => Appointment::where('status', 'cancelled')->count(),
            ],
        ]);
    }

    // ─── Users ───────────────────────────────────────────────

    public function getUsers(Request $request)
    {
        // ✅ Load all profiles for view modal
        $users = User::with(['doctorProfile', 'patientProfile'])
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($users);
    }

    public function deleteUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Prevent deleting yourself
        if ((int)$user->id === (int)$request->user()->id) {
            return response()->json(['message' => 'You cannot delete yourself.'], 403);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully.']);
    }

    // ─── Doctor Validation ───────────────────────────────────

    public function getPendingDoctors(Request $request)
    {
        // ✅ Return raw with doctorProfile relation (consistent with frontend)
        $doctors = User::where('role', 'doctor')
            ->with('doctorProfile')
            ->get();

        return response()->json($doctors);
    }

    public function updateDoctorStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $doctor = User::where('role', 'doctor')->findOrFail($id);

        DoctorProfile::updateOrCreate(
            ['user_id' => $doctor->id],
            ['status'  => $request->status]
        );

        return response()->json(['message' => 'Doctor status updated successfully.']);
    }

    // ─── Specialties ─────────────────────────────────────────

    public function getSpecialties(Request $request)
    {
        return response()->json(Specialty::orderBy('name')->get());
    }

    public function addSpecialty(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:specialties,name',
        ]);

        $specialty = Specialty::create(['name' => $request->name]);
        return response()->json($specialty, 201);
    }

    public function deleteSpecialty(Request $request, $id)
    {
        $specialty = Specialty::findOrFail($id);
        $specialty->delete();
        return response()->json(['message' => 'Specialty deleted successfully.']);
    }

    // ─── Appointments (Reports) ───────────────────────────────

    public function getAppointments(Request $request)
    {
        $appointments = Appointment::with([
            'doctor:id,name',
            'patient:id,name',
        ])
        ->orderBy('appointment_date', 'desc')
        ->get();

        return response()->json($appointments);
    }
}