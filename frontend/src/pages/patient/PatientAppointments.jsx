import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Stethoscope, Building2, MapPin, FileText, Plus } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const statusConfig = {
  pending:   { cls: "text-bg-warning",  label: "Pending"   },
  accepted:  { cls: "text-bg-success",  label: "Confirmed" },
  cancelled: { cls: "text-bg-danger",   label: "Cancelled" },
  completed: { cls: "text-bg-primary",  label: "Completed" },
};

const tabs = ["all", "pending", "accepted", "completed", "cancelled"];

export default function PatientAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [activeTab,    setActiveTab]    = useState("all");
  const [cancellingId, setCancellingId] = useState(null);

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

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    setCancellingId(id);
    try {
      await api.put(`/patient/appointments/${id}/cancel`);
      setAppointments((prev) =>
        prev.map((a) => a.id === id ? { ...a, status: "cancelled" } : a)
      );
    } catch {
      setError("Failed to cancel appointment.");
    } finally {
      setCancellingId(null);
    }
  };

  const filtered = activeTab === "all"
    ? appointments
    : appointments.filter((a) => a.status === activeTab);

  const countOf = (tab) => tab === "all"
    ? appointments.length
    : appointments.filter((a) => a.status === tab).length;

  return (
    <div>

      {/* ── Header ── */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h4 fw-bold mb-0">My Appointments</h1>
          <p className="text-secondary small mb-0">
            {appointments.length} appointment{appointments.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link to="/doctors" className="btn btn-primary btn-sm d-flex align-items-center gap-1">
          <Plus size={15} /> Book New
        </Link>
      </div>

      {/* ── Error ── */}
      {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

      {/* ── Tabs ── */}
      <div className="d-flex gap-2 flex-wrap mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`btn btn-sm ${activeTab === tab ? "btn-primary" : "btn-outline-secondary"}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className={`badge ms-1 ${activeTab === tab ? "text-bg-light text-primary" : "text-bg-secondary"}`}>
              {countOf(tab)}
            </span>
          </button>
        ))}
      </div>

      {/* ── Loading ── */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="text-secondary mt-3 small">Loading appointments...</p>
        </div>

      /* ── Empty ── */
      ) : filtered.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center text-secondary py-5">
            <Calendar size={40} className="mb-3 text-primary opacity-50" />
            <p className="mb-2 fw-medium">
              {activeTab === "all" ? "No appointments yet." : `No ${activeTab} appointments.`}
            </p>
            {activeTab === "all" && (
              <Link to="/doctors" className="btn btn-outline-primary btn-sm">
                Find a Doctor
              </Link>
            )}
          </div>
        </div>

      /* ── List ── */
      ) : (
        <div className="d-flex flex-column gap-3">
          {filtered.map((appt) => {
            const profile = appt.doctor?.doctor_profile;
            const status  = statusConfig[appt.status] ?? { cls: "text-bg-secondary", label: appt.status };
            return (
              <div className="card border-0 shadow-sm card-hover" key={appt.id}>
                <div className="card-body p-3">
                  <div className="d-flex align-items-start justify-content-between gap-3">

                    {/* ── Avatar ── */}
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

                    {/* ── Info ── */}
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                        <span className="fw-bold">Dr. {appt.doctor?.name}</span>
                        <span className={`badge ${status.cls}`} style={{ fontSize: "0.65rem" }}>
                          {status.label}
                        </span>
                      </div>

                      {profile?.specialty && (
                        <span className="badge text-bg-primary bg-opacity-10 mb-2" style={{ fontSize: "0.65rem" }}>
                          {profile.specialty}
                        </span>
                      )}

                      {/* Date & Time */}
                      <div className="d-flex flex-wrap gap-3 mb-2">
                        <span className="text-secondary small d-flex align-items-center gap-1">
                          <Calendar size={13} className="text-primary" />
                          {new Date(appt.appointment_date + "T00:00:00").toLocaleDateString("en-GB", {
                            weekday: "short", day: "2-digit", month: "short", year: "numeric",
                          })}
                        </span>
                        <span className="text-secondary small d-flex align-items-center gap-1">
                          <Clock size={13} className="text-primary" />
                          {appt.appointment_time?.slice(0, 5)}
                        </span>
                      </div>

                      {/* Clinic / City */}
                      <div className="d-flex flex-wrap gap-3">
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

                      {/* Notes */}
                      {appt.notes && (
                        <p className="text-secondary small mb-0 mt-2 d-flex align-items-start gap-1">
                          <FileText size={12} className="text-primary mt-1 flex-shrink-0" />
                          {appt.notes}
                        </p>
                      )}
                    </div>

                    {/* ── Cancel Button ── */}
                    <div className="flex-shrink-0">
                      {(appt.status === "pending" || appt.status === "accepted") && (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleCancel(appt.id)}
                          disabled={cancellingId === appt.id}
                        >
                          {cancellingId === appt.id ? (
                            <span className="spinner-border spinner-border-sm" />
                          ) : (
                            "Cancel"
                          )}
                        </button>
                      )}
                    </div>

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