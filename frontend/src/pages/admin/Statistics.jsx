import { useEffect, useState } from "react";
import { Users, UserCheck, Calendar, Stethoscope } from "lucide-react";
import api from "@/lib/api";

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        setError("Failed to load statistics.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Users", value: stats?.total_users ?? 0, icon: Users, color: "text-primary", bg: "bg-primary" },
    { label: "Total Doctors", value: stats?.total_doctors ?? 0, icon: UserCheck, color: "text-success", bg: "bg-success" },
    { label: "Total Patients", value: stats?.total_patients ?? 0, icon: Users, color: "text-info", bg: "bg-info" },
    { label: "Total Appointments", value: stats?.total_appointments ?? 0, icon: Calendar, color: "text-warning", bg: "bg-warning" },
    { label: "Pending Doctors", value: stats?.pending_doctors ?? 0, icon: UserCheck, color: "text-danger", bg: "bg-danger" },
    { label: "Specialties", value: stats?.total_specialties ?? 0, icon: Stethoscope, color: "text-secondary", bg: "bg-secondary" },
  ];

  return (
    <div>
      <h1 className="fw-bold mb-4">Statistics</h1>

      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="text-secondary mt-3">Loading statistics...</p>
        </div>
      ) : (
        <>
          <div className="row g-3 mb-4">
            {statCards.map((s) => (
              <div className="col-12 col-sm-6 col-lg-4" key={s.label}>
                <div className="card card-popout h-100">
                  <div className="card-body d-flex align-items-center gap-3">
                    <div className={`rounded ${s.bg} bg-opacity-10 p-3`}>
                      <s.icon size={24} className={s.color} />
                    </div>
                    <div>
                      <div className="fw-bold fs-3">{s.value}</div>
                      <div className="small text-secondary">{s.label}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Appointments by status */}
          {stats?.appointments_by_status && (
            <div className="card">
              <div className="card-body">
                <h5 className="fw-semibold mb-3">Appointments by Status</h5>
                <div className="row g-3">
                  {Object.entries(stats.appointments_by_status).map(([status, count]) => (
                    <div className="col-6 col-md-3" key={status}>
                      <div className="text-center p-3 rounded bg-body-secondary">
                        <div className="fw-bold fs-4">{count}</div>
                        <div className="small text-secondary text-capitalize">{status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}