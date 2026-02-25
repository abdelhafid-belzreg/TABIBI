import { useState, useEffect } from "react";
import {
  Calendar, Clock, Check, X, CheckCircle, User,
  Search, Filter, Phone, Mail, FileText,
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const statusConfig = {
  pending:   { cls: "text-bg-warning", label: "Pending"   },
  accepted:  { cls: "text-bg-success", label: "Confirmed" },
  cancelled: { cls: "text-bg-danger",  label: "Cancelled" },
  completed: { cls: "text-bg-primary", label: "Completed" },
};

const filterTabs = ["all", "pending", "accepted", "completed", "cancelled"];

export default function DoctorAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [filter,       setFilter]       = useState("all");
  const [search,       setSearch]       = useState("");
  const [updatingId,   setUpdatingId]   = useState(null);

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

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    setError("");
    try {
      await api.patch(`/doctor/appointments/${id}/status`, { status });
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    } catch {
      setError("Failed to update appointment status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter + search
  const visible = appointments.filter((a) => {
    const matchStatus = filter === "all" || a.status === filter;
    const q           = search.toLowerCase();
    const matchSearch = !q
      || a.patient?.name?.toLowerCase().includes(q)
      || a.patient?.email?.toLowerCase().includes(q)
      || a.appointment_date?.includes(q);
    return matchStatus && matchSearch;
  });

  // Counts per tab
  const counts = filterTabs.reduce((acc, t) => {
    acc[t] = t === "all"
      ? appointments.length
      : appointments.filter((a) => a.status === t).length;
    return acc;
  }, {});

  const today = new Date().toISOString().split("T")[0];

  return (
    <div>

      {/* ── Header ── */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
        <div>
          <h1 className="h4 fw-bold mb-0">Appointments</h1>
          <p className="text-secondary small mb-0">
            {appointments.length} total · {counts.pending} pending
          </p>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
          {error}
          <button
            className="btn-close btn-sm ms-auto"
            style={{ fontSize: "0.65rem" }}
            onClick={() => setError("")}
          />
        </div>
      )}

      {/* ── Search + Filter ── */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">

          {/* Search */}
          <div className="input-group input-group-sm mb-3">
            <span className="input-group-text bg-body-secondary border-end-0">
              <Search size={14} className="text-secondary" />
            </span>
            <input
              type="text"
              className="form-control border-start-0 bg-body-secondary"
              placeholder="Search by patient name, email or date..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Tabs */}
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <Filter size={13} className="text-secondary" />
            {filterTabs.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`btn btn-sm ${
                  filter === t ? "btn-primary" : "btn-outline-secondary"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
                {counts[t] > 0 && (
                  <span
                    className={`ms-1 badge ${
                      filter === t ? "text-bg-light text-primary" : "text-bg-secondary"
                    }`}
                    style={{ fontSize: "0.65rem" }}
                  >
                    {counts[t]}
                  </span>
                )}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* ── Loading ── */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="text-secondary mt-2 small">Loading appointments...</p>
        </div>

      /* ── Empty ── */
      ) : visible.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center text-secondary py-5">
            <Calendar size={40} className="mb-3 opacity-25" />
            <p className="fw-medium mb-0">
              {search || filter !== "all"
                ? "No appointments match your filter."
                : "No appointments yet."}
            </p>
          </div>
        </div>

      /* ── List ── */
      ) : (
        <div className="d-flex flex-column gap-3">
          {visible.map((appt) => {
            const status  = statusConfig[appt.status] ?? { cls: "text-bg-secondary", label: appt.status };
            const isToday = appt.appointment_date === today;
            const busy    = updatingId === appt.id;

            return (
              <div className="card border-0 shadow-sm" key={appt.id}>
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
                    <div className="flex-grow-1" style={{ minWidth: 0 }}>

                      {/* Name + badges */}
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

                      {/* Date / Time / Contact */}
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
                        {appt.patient?.phone && (
                          <span className="text-secondary small d-flex align-items-center gap-1">
                            <Phone size={12} className="text-primary" />
                            {appt.patient.phone}
                          </span>
                        )}
                        {appt.patient?.email && (
                          <span className="text-secondary small d-flex align-items-center gap-1">
                            <Mail size={12} className="text-primary" />
                            {appt.patient.email}
                          </span>
                        )}
                      </div>

                      {/* Notes */}
                      {appt.notes && (
                        <p className="text-secondary small mb-2 d-flex align-items-center gap-1">
                          <FileText size={12} className="text-primary flex-shrink-0" />
                          {appt.notes}
                        </p>
                      )}

                      {/* Actions */}
                      {appt.status === "pending" && (
                        <div className="d-flex gap-2 mt-2">
                          <button
                            className="btn btn-success btn-sm d-flex align-items-center gap-1"
                            onClick={() => updateStatus(appt.id, "accepted")}
                            disabled={busy}
                          >
                            {busy
                              ? <span className="spinner-border spinner-border-sm" />
                              : <><Check size={13} /> Accept</>}
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                            onClick={() => updateStatus(appt.id, "cancelled")}
                            disabled={busy}
                          >
                            {busy
                              ? <span className="spinner-border spinner-border-sm" />
                              : <><X size={13} /> Reject</>}
                          </button>
                        </div>
                      )}

                      {appt.status === "accepted" && (
                        <div className="mt-2">
                          <button
                            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                            onClick={() => updateStatus(appt.id, "completed")}
                            disabled={busy}
                          >
                            {busy
                              ? <span className="spinner-border spinner-border-sm" />
                              : <><CheckCircle size={13} /> Mark Completed</>}
                          </button>
                        </div>
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