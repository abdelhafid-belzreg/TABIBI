import { useEffect, useState } from "react";
import { Calendar, Clock, FileText } from "lucide-react";
import api from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const statusColors = {
  pending:   "text-bg-warning",
  accepted:  "text-bg-success",
  cancelled: "text-bg-danger",
  completed: "text-bg-primary",
};

export default function Reports() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [filter, setFilter]             = useState("all");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/admin/appointments");
        setAppointments(res.data);
      } catch (err) {
        setError("Failed to load appointments.");
        toast.danger("Error", "Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const filtered =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  return (
    <div>
      <h1 className="fw-bold mb-4">Reports</h1>

      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      {/* Filter Buttons with counts */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {["all", "pending", "accepted", "completed", "cancelled"].map((s) => (
          <button
            key={s}
            className={`btn btn-sm ${filter === s ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setFilter(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
            <span className="ms-1 badge bg-white text-dark">
              {s === "all"
                ? appointments.length
                : appointments.filter((a) => a.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="text-secondary mt-3">Loading reports...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <div className="card-body text-center text-secondary py-5">
            No appointments found.
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filtered.map((appt) => (
            <div className="card card-popout" key={appt.id}>
              <div className="card-body p-4">
                <div className="d-flex flex-column flex-sm-row justify-content-between gap-2">
                  <div>
                    {/* ✅ appt.patient?.name from users table */}
                    <div className="fw-medium">
                      Patient: {appt.patient?.name || "N/A"}
                    </div>
                    {/* ✅ appt.doctor?.name from users table */}
                    <div className="fw-medium text-secondary">
                      Doctor: Dr. {appt.doctor?.name || "N/A"}
                    </div>
                    <div className="small text-secondary d-flex flex-wrap gap-2 mt-1">
                      <span className="d-inline-flex align-items-center gap-1">
                        <Calendar size={13} /> {appt.appointment_date}
                      </span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <Clock size={13} /> {appt.appointment_time?.slice(0, 5)}
                      </span>
                    </div>
                    {/* ✅ FileText icon instead of 📝 emoji */}
                    {appt.notes && (
                      <div className="small text-secondary mt-1 d-flex align-items-center gap-1">
                        <FileText size={13} /> {appt.notes}
                      </div>
                    )}
                  </div>
                  <span className={`badge ${statusColors[appt.status]} flex-shrink-0`}>
                    {appt.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}