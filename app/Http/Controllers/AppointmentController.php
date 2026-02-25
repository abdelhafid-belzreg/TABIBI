<?php


namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    // Patient: book appointment
    public function store(Request $request)
    {
        $request->validate([
            'doctor_id'        => 'required|exists:users,id',
            'appointment_date' => 'required|date|after_or_equal:today',
            'appointment_time' => 'required|date_format:H:i',
            'notes'            => 'nullable|string',
        ]);

        $appointment = Appointment::create([
            'doctor_id'        => $request->doctor_id,
            'patient_id'       => $request->user()->id,
            'appointment_date' => $request->appointment_date,
            'appointment_time' => $request->appointment_time,
            'status'           => 'pending',
            'notes'            => $request->notes,
        ]);

        return response()->json($appointment, 201);
    }

    // Patient: get my appointments
    public function patientAppointments(Request $request)
    {
        $appointments = Appointment::where('patient_id', $request->user()->id)
            ->with(['doctor:id,name', 'doctor.doctorProfile'])
            ->orderBy('appointment_date', 'desc')
            ->get();

        return response()->json($appointments);
    }

    // Doctor: get my appointments
    public function doctorAppointments(Request $request)
    {
        $appointments = Appointment::where('doctor_id', $request->user()->id)
            ->with(['patient']) // ✅ eager load patient
            ->orderBy('appointment_date', 'desc')
            ->orderBy('appointment_time', 'desc')
            ->get();

        return response()->json($appointments);
    }

    // Doctor: update appointment status
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:accepted,cancelled,completed',
        ]);

        $appointment = Appointment::where('id', $id)
            ->where('doctor_id', $request->user()->id)
            ->firstOrFail();

        $appointment->update(['status' => $request->status]);

        return response()->json(['message' => 'Status updated successfully!']);
    }

    // Patient: cancel appointment
    public function cancel(Request $request, $id)
    {
        $appointment = Appointment::where('id', $id)
            ->where('patient_id', $request->user()->id)
            ->firstOrFail();

        if (!in_array($appointment->status, ['pending', 'accepted'])) {
            return response()->json(['message' => 'This appointment cannot be cancelled.'], 422);
        }

        $appointment->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Appointment cancelled.']);
    }
}