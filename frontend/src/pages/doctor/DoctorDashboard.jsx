import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar, Clock, Users, User,
  CheckCircle, XCircle, Plus,
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const statusConfig = {
  pending:   { cls: "text-bg-warning", label: "Pending"   },
  accepted:  { cls: "text-bg-success", label: "Confirmed" },
  cancelled: { cls: "text-bg-danger",  label: "Cancelled" },
  completed: { cls: "text-bg-primary", label: "Completed" },
};

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!user) return;
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/doctor/appointments");
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
      label: "Today",
      value: appointments.filter((a) => a.appointment_date === today).length,
      icon:  Calendar,
      color: "text-primary",
      bg:    "bg-primary",
    },
    {
      label: "Pending",
      value: appointments.filter((a) => a.status === "pending").length,
      icon:  Clock,
      color: "text-warning",
      bg:    "bg-warning",
    },
    {
      label: "Confirmed",
      value: appointments.filter((a) => a.status === "accepted").length,
      icon:  CheckCircle,
      color: "text-success",
      bg:    "bg-success",
    },
    {
      label: "Total",
      value: appointments.length,
      icon:  Users,
      color: "text-info",
      bg:    "bg-info",
    },
  ];

  // Show only upcoming (pending + accepted), sorted by date
  const upcoming = appointments
    .filter((a) => a.status === "pending" || a.status === "accepted")
    .sort((a, b) => a.appointment_date.localeCompare(b.appointment_date))
    .slice(0, 5);

  return (
    <div>

      {/* ── Welcome ── */}
      <div className="mb-4">
        <h1 className="h4 fw-bold mb-0">Welcome, Dr. {user?.name || "Doctor"}! 👋</h1>
        <p className="text-secondary small mb-0">Here's your schedule overview</p>
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
                  <s.icon size={20} className={s.color} />
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
        <h2 className="h5 fw-semibold mb-0">Upcoming Appointments</h2>
        <Link
          to="/doctor/appointments"
          className="btn btn-primary btn-sm d-flex align-items-center gap-1"
        >
          <Plus size={14} /> View All
        </Link>
      </div>

      {/* ── Error ── */}
      {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

      {/* ── Loading ── */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="text-secondary mt-2 small">Loading...</p>
        </div>

      /* ── Empty ── */
      ) : upcoming.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center text-secondary py-5">
            <Calendar size={40} className="mb-3 text-primary opacity-50" />
            <p className="fw-medium mb-0">No upcoming appointments.</p>
          </div>
        </div>

      /* ── List ── */
      ) : (
        <div className="d-flex flex-column gap-3">
          {upcoming.map((appt) => {
            const status   = statusConfig[appt.status] ?? { cls: "text-bg-secondary", label: appt.status };
            const isToday  = appt.appointment_date === today;
            return (
              <div className="card border-0 shadow-sm card-hover" key={appt.id}>
                <div className="card-body p-3">
                  <div className="d-flex align-items-start gap-3">

                    {/* Avatar */}
                    <div
                      className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: 44, height: 44 }}
                    >
                      <User size={20} className="text-success" />
                    </div>

                    {/* Info */}
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                        <span className="fw-bold small">
                          {appt.patient?.name || "Patient"}
                        </span>
                        <span className={`badge ${status.cls}`} style={{ fontSize: "0.65rem" }}>
                          {status.label}
                        </span>
                        {isToday && (
                          <span className="badge text-bg-info" style={{ fontSize: "0.65rem" }}>
                            Today
                          </span>
                        )}
                      </div>

                      <div className="d-flex flex-wrap gap-3 mb-1">
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
                      </div>

                      {appt.notes && (
                        <p className="text-secondary small mb-0">
                          📝 {appt.notes}
                        </p>
                      )}
                    </div>

                    {/* Quick actions */}
                    {appt.status === "pending" && (
                      <div className="d-flex gap-1 flex-shrink-0">
                        <button
                          className="btn btn-outline-success btn-sm d-flex align-items-center gap-1"
                          onClick={async () => {
                            await api.patch(`/doctor/appointments/${appt.id}/status`, { status: "accepted" });
                            setAppointments((prev) =>
                              prev.map((a) => a.id === appt.id ? { ...a, status: "accepted" } : a)
                            );
                          }}
                        >
                          <CheckCircle size={13} />
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                          onClick={async () => {
                            await api.patch(`/doctor/appointments/${appt.id}/status`, { status: "cancelled" });
                            setAppointments((prev) =>
                              prev.map((a) => a.id === appt.id ? { ...a, status: "cancelled" } : a)
                            );
                          }}
                        >
                          <XCircle size={13} />
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}