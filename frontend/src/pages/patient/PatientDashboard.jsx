import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar, Clock, Activity, Search,
  Stethoscope, Building2, MapPin, Plus,
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const statusConfig = {
  pending:   { cls: "text-bg-warning",  label: "Pending"   },
  accepted:  { cls: "text-bg-success",  label: "Confirmed" },
  cancelled: { cls: "text-bg-danger",   label: "Cancelled" },
  completed: { cls: "text-bg-primary",  label: "Completed" },
};

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");

  useEffect(() => {
    if (!user) return;
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/patient/appointments");
        setAppointments(res.data);
      } catch {
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [user]);

  const stats = [
    {
      label: "Total",
      value: appointments.length,
      icon:  Calendar,
      color: "text-primary",
      bg:    "bg-primary",
    },
    {
      label: "Upcoming",
      value: appointments.filter((a) => a.status === "pending" || a.status === "accepted").length,
      icon:  Clock,
      color: "text-warning",
      bg:    "bg-warning",
    },
    {
      label: "Completed",
      value: appointments.filter((a) => a.status === "completed").length,
      icon:  Activity,
      color: "text-success",
      bg:    "bg-success",
    },
    {
      label: "Cancelled",
      value: appointments.filter((a) => a.status === "cancelled").length,
      icon:  Calendar,
      color: "text-danger",
      bg:    "bg-danger",
    },
  ];

  return (
    <div>

      {/* ── Welcome ── */}
      <div className="mb-4">
        <h1 className="h4 fw-bold mb-0">
          Welcome back, {user?.name || "Patient"}! 👋
        </h1>
        <p className="text-secondary small mb-0">Here's your health overview</p>
      </div>

      {/* ── Stats ── */}
      <div className="row g-3 mb-4">
        {stats.map((s) => (
          <div className="col-6 col-sm-3" key={s.label}>
            <div className="card border-0 shadow-sm card-hover h-100">
              <div className="card-body d-flex align-items-center gap-3 p-3">
                <div
                  className={`rounded-circle ${s.bg} bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0`}
                  style={{ width: 44, height: 44 }}
                >
                  <s.icon className={s.color} size={20} />
                </div>
                <div>
                  <div className="h5 fw-bold mb-0">{s.value}</div>
                  <div className="small text-secondary">{s.label}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Header ── */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="h5 fw-semibold mb-0">Recent Appointments</h2>
        <div className="d-flex gap-2">
          <Link
            to="/doctors"
            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
          >
            <Search size={14} /> Find Doctor
          </Link>
          <Link
            to="/patient/appointments"
            className="btn btn-primary btn-sm d-flex align-items-center gap-1"
          >
            <Plus size={14} /> View All
          </Link>
        </div>
      </div>

      {/* ── Error ── */}
      {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

      {/* ── Loading ── */}
      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status" />
          <p className="text-secondary small mt-2">Loading...</p>
        </div>

      /* ── Empty ── */
      ) : appointments.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center text-secondary py-5">
            <Calendar size={40} className="mb-3 text-primary opacity-50" />
            <p className="fw-medium mb-2">No appointments yet.</p>
            <Link to="/doctors" className="btn btn-outline-primary btn-sm">
              Book your first appointment
            </Link>
          </div>
        </div>

      /* ── List ── */
      ) : (
        <div className="d-flex flex-column gap-3">
          {appointments.slice(0, 5).map((appt) => {
            const profile = appt.doctor?.doctor_profile;
            const status  = statusConfig[appt.status] ?? { cls: "text-bg-secondary", label: appt.status };
            return (
              <div className="card border-0 shadow-sm card-hover" key={appt.id}>
                <div className="card-body p-3">
                  <div className="d-flex align-items-start gap-3">

                    {/* Avatar */}
                    <div
                      className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: 44, height: 44 }}
                    >
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={appt.doctor?.name}
                          className="rounded-circle"
                          style={{ width: 44, height: 44, objectFit: "cover" }}
                        />
                      ) : (
                        <Stethoscope size={20} className="text-primary" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                        <span className="fw-bold small">Dr. {appt.doctor?.name}</span>
                        <span className={`badge ${status.cls}`} style={{ fontSize: "0.65rem" }}>
                          {status.label}
                        </span>
                      </div>

                      {profile?.specialty && (
                        <span
                          className="badge text-bg-primary bg-opacity-10 mb-2"
                          style={{ fontSize: "0.65rem" }}
                        >
                          {profile.specialty}
                        </span>
                      )}

                      <div className="d-flex flex-wrap gap-3">
                        <span className="text-secondary small d-flex align-items-center gap-1">
                          <Calendar size={12} className="text-primary" />
                          {new Date(appt.appointment_date + "T00:00:00").toLocaleDateString("en-GB", {
                            weekday: "short", day: "2-digit", month: "short", year: "numeric",
                          })}
                        </span>
                        <span className="text-secondary small d-flex align-items-center gap-1">
                          <Clock size={12} className="text-primary" />
                          {appt.appointment_time?.slice(0, 5)}
                        </span>
                        {profile?.clinic_name && (
                          <span className="text-secondary small d-flex align-items-center gap-1">
                            <Building2 size={12} className="text-primary" />
                            {profile.clinic_name}
                          </span>
                        )}
                        {profile?.city && (
                          <span className="text-secondary small d-flex align-items-center gap-1">
                            <MapPin size={12} className="text-primary" />
                            {profile.city}
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}

          {/* View All link */}
          {appointments.length > 5 && (
            <Link
              to="/patient/appointments"
              className="btn btn-outline-primary btn-sm w-100"
            >
              View all {appointments.length} appointments
            </Link>
          )}
        </div>
      )}
    </div>
  );
}