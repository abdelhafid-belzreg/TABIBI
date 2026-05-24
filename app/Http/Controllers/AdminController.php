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

    // ─── Reports Data ─────────────────────────────────────────

    public function getReportsData(Request $request)
    {
        $appointments = Appointment::with(['doctor:id,name', 'patient:id,name'])->get();

        // Appointments by status
        $byStatus = [
            'pending'   => $appointments->where('status', 'pending')->count(),
            'accepted'  => $appointments->where('status', 'accepted')->count(),
            'completed' => $appointments->where('status', 'completed')->count(),
            'cancelled' => $appointments->where('status', 'cancelled')->count(),
        ];

        // Appointments per doctor
        $byDoctor = [];
        foreach ($appointments->groupBy('doctor_id') as $doctorId => $group) {
            $doctor = $group->first()->doctor;
            if ($doctor) {
                $byDoctor[] = [
                    'name'  => 'Dr. ' . $doctor->name,
                    'count' => $group->count(),
                ];
            }
        }
        rsort($byDoctor);

        // Appointments per day of week
        $dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        $byDay = array_fill(0, 7, 0);
        foreach ($appointments as $a) {
            $dayIndex = (new \DateTime($a->appointment_date))->format('w');
            $byDay[(int)$dayIndex]++;
        }
        $byDay = array_combine($dayNames, $byDay);

        // Appointments in last 7 days
        $last7Days = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $last7Days[] = [
                'date'  => now()->subDays($i)->format('D d'),
                'count' => $appointments->where('appointment_date', $date)->count(),
            ];
        }

        // Revenue (completed * consultation_fee approximation)
        $totalRevenue = 0;
        $completed = $appointments->where('status', 'completed');
        foreach ($completed as $appt) {
            $doctorProfile = $appt->doctor?->doctorProfile;
            if ($doctorProfile && $doctorProfile->consultation_fee) {
                $totalRevenue += $doctorProfile->consultation_fee;
            }
        }

        // Completion rate
        $total = $appointments->count();
        $completedCount = $byStatus['completed'];
        $cancelledCount = $byStatus['cancelled'];

        return response()->json([
            'total_appointments'     => $total,
            'appointments_by_status' => $byStatus,
            'appointments_by_doctor' => $byDoctor,
            'appointments_by_day'    => $byDay,
            'last_7_days'            => $last7Days,
            'total_revenue'          => $totalRevenue,
            'completion_rate'        => $total > 0 ? round(($completedCount / $total) * 100, 1) : 0,
            'cancellation_rate'      => $total > 0 ? round(($cancelledCount / $total) * 100, 1) : 0,
        ]);
    }
}