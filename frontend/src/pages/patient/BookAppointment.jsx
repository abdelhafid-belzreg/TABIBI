import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Stethoscope, MapPin, Calendar, Clock, Building2, ChevronLeft } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function generateTimeSlots(start, end) {
  const slots = [];
  let [h, m] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  while (h < eh || (h === eh && m < em)) {
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    m += 30;
    if (m >= 60) { h++; m = 0; }
  }
  return slots;
}

export default function BookAppointment() {
  const { doctorId } = useParams();
  const navigate     = useNavigate();
  const { user }     = useAuth();

  const [doctor,       setDoctor]       = useState(null);
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedSlots,  setBookedSlots]  = useState([]);
  const [notes,        setNotes]        = useState("");
  const [loading,      setLoading]      = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error,        setError]        = useState("");
  const [success,      setSuccess]      = useState(false);

  // Next 14 days
  const today = new Date();
  const days  = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  useEffect(() => {
    if (!doctorId) return;
    const fetchData = async () => {
      try {
        const [doctorRes, availabilityRes] = await Promise.all([
          api.get(`/doctors/${doctorId}`),
          api.get(`/doctors/${doctorId}/availability`),
        ]);
        setDoctor(doctorRes.data);
        setAvailability(availabilityRes.data);
      } catch {
        setError("Failed to load doctor information.");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchData();
  }, [doctorId]);

  useEffect(() => {
    if (!selectedDate || !doctorId) return;
    const fetchBooked = async () => {
      try {
        const res = await api.get(`/doctors/${doctorId}/booked-slots`, {
          params: { date: selectedDate },
        });
        setBookedSlots(res.data);
        setSelectedTime("");
      } catch {
        setBookedSlots([]);
      }
    };
    fetchBooked();
  }, [selectedDate, doctorId]);

  const availableDays  = availability.map((a) => a.day_of_week);
  const isDateAvailable = (date) => availableDays.includes(date.getDay());

  const selectedDaySlots = selectedDate
    ? availability.filter((a) => a.day_of_week === new Date(selectedDate + "T00:00:00").getDay())
    : [];

  const timeSlots = selectedDaySlots.flatMap((s) =>
    generateTimeSlots(s.start_time, s.end_time)
  );

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) return;
    setLoading(true);
    setError("");
    try {
      await api.post("/patient/appointments", {
        doctor_id:        doctorId,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        notes,
      });
      setSuccess(true);
      setTimeout(() => navigate("/patient/appointments"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Loading ──
  if (fetchLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="text-secondary mt-3 small">Loading doctor info...</p>
      </div>
    );
  }

  // ── Fatal error ──
  if (error && !doctor) {
    return (
      <div className="container py-5 text-center">
        <p className="text-danger">{error}</p>
        <button className="btn btn-outline-primary btn-sm" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  // ── Success ──
  if (success) {
    return (
      <div className="container py-5 text-center" style={{ maxWidth: 480 }}>
        <div
          className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-3"
          style={{ width: 64, height: 64 }}
        >
          <span style={{ fontSize: "2rem" }}>✅</span>
        </div>
        <h5 className="fw-bold mb-1">Appointment Booked!</h5>
        <p className="text-secondary small mb-0">
          Your appointment is pending doctor confirmation. Redirecting...
        </p>
      </div>
    );
  }

  const profile = doctor?.doctor_profile;

  return (
    <div className="container py-4" style={{ maxWidth: 680 }}>

      {/* ── Back ── */}
      <button
        className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 mb-3"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft size={15} /> Back
      </button>

      <h1 className="h4 fw-bold mb-4">Book Appointment</h1>

      {/* ── Error ── */}
      {error && (
        <div className="alert alert-danger py-2 small mb-3">{error}</div>
      )}

      {/* ── Doctor Card ── */}
      {doctor && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body d-flex align-items-center gap-3">
            <div
              className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: 56, height: 56 }}
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={doctor.name}
                  className="rounded-circle"
                  style={{ width: 56, height: 56, objectFit: "cover" }}
                />
              ) : (
                <Stethoscope className="text-primary" size={24} />
              )}
            </div>
            <div className="flex-grow-1">
              <div className="fw-bold">Dr. {doctor.name}</div>
              <div className="text-secondary small d-flex flex-wrap gap-2 mt-1">
                {profile?.specialty && (
                  <span className="badge text-bg-primary bg-opacity-10 text-primary">
                    {profile.specialty}
                  </span>
                )}
                {profile?.consultation_fee && (
                  <span className="badge bg-success bg-opacity-10 text-success">
                    {profile.consultation_fee} MAD / visit
                  </span>
                )}
              </div>
              <div className="d-flex flex-column gap-1 mt-2">
                {profile?.clinic_name && (
                  <span className="text-secondary small d-flex align-items-center gap-1">
                    <Building2 size={12} className="text-primary" /> {profile.clinic_name}
                  </span>
                )}
                {profile?.city && (
                  <span className="text-secondary small d-flex align-items-center gap-1">
                    <MapPin size={12} className="text-primary" /> {profile.city}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Step indicator ── */}
      <div className="d-flex align-items-center gap-2 mb-4">
        {["Date", "Time", "Confirm"].map((step, i) => {
          const done =
            (i === 0 && selectedDate) ||
            (i === 1 && selectedTime) ||
            (i === 2 && false);
          const active =
            (i === 0 && !selectedDate) ||
            (i === 1 && selectedDate && !selectedTime) ||
            (i === 2 && selectedDate && selectedTime);
          return (
            <div key={step} className="d-flex align-items-center gap-2">
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center fw-bold`}
                style={{
                  width: 28, height: 28, fontSize: "0.75rem",
                  background: done ? "var(--bs-success)" : active ? "var(--bs-primary)" : "var(--bs-border-color)",
                  color: done || active ? "#fff" : "var(--bs-secondary)",
                }}
              >
                {done ? "✓" : i + 1}
              </div>
              <span className="small fw-medium">{step}</span>
              {i < 2 && <div className="flex-grow-1 border-top" style={{ width: 32 }} />}
            </div>
          );
        })}
      </div>

      {/* ── Select Date ── */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-body-secondary d-flex align-items-center gap-2 py-2">
          <Calendar size={15} className="text-primary" />
          <strong className="small">Select Date</strong>
        </div>
        <div className="card-body">
          {availability.length === 0 ? (
            <p className="text-secondary small mb-0">This doctor has no available slots yet.</p>
          ) : (
            <div className="d-flex flex-wrap gap-2">
              {days.map((date) => {
                const dateStr  = date.toISOString().slice(0, 10);
                const available = isDateAvailable(date);
                const isSelected = selectedDate === dateStr;
                return (
                  <button
                    key={dateStr}
                    type="button"
                    disabled={!available}
                    onClick={() => { setSelectedDate(dateStr); setSelectedTime(""); }}
                    className={`btn btn-sm ${
                      isSelected   ? "btn-primary"          :
                      available    ? "btn-outline-primary"  :
                                     "btn-outline-secondary opacity-50"
                    }`}
                  >
                    <span className="d-block fw-semibold" style={{ fontSize: "0.7rem" }}>
                      {dayNames[date.getDay()].slice(0, 3)}
                    </span>
                    <span style={{ fontSize: "0.75rem" }}>
                      {date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Select Time ── */}
      {selectedDate && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-body-secondary d-flex align-items-center gap-2 py-2">
            <Clock size={15} className="text-primary" />
            <strong className="small">
              Select Time — {dayNames[new Date(selectedDate + "T00:00:00").getDay()]},{" "}
              {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-GB", {
                day: "2-digit", month: "long", year: "numeric",
              })}
            </strong>
          </div>
          <div className="card-body">
            {timeSlots.length === 0 ? (
              <p className="text-secondary small mb-0">No slots available for this day.</p>
            ) : (
              <div className="d-flex flex-wrap gap-2">
                {timeSlots.map((t) => {
                  const isBooked = bookedSlots.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      disabled={isBooked}
                      onClick={() => setSelectedTime(t)}
                      className={`btn btn-sm ${
                        isBooked
                          ? "btn-outline-secondary opacity-50 text-decoration-line-through"
                          : selectedTime === t
                            ? "btn-primary"
                            : "btn-outline-primary"
                      }`}
                      title={isBooked ? "Already booked" : ""}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Notes & Confirm ── */}
      {selectedTime && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-body-secondary d-flex align-items-center gap-2 py-2">
            <strong className="small">Additional Notes</strong>
          </div>
          <div className="card-body">
            <textarea
              className="form-control mb-3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe your symptoms or reason for visit..."
              rows={3}
            />
            <button
              className="btn btn-primary w-100"
              onClick={handleBook}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Booking...
                </>
              ) : (
                // ✅ profile?.consultation_fee instead of doctor?.consultation_fee
                `Confirm Booking — ${profile?.consultation_fee ?? ""} MAD`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}