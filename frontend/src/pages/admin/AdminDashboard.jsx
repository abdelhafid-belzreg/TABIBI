import { useEffect, useState } from "react";
import { Users, UserCheck, Stethoscope, Calendar } from "lucide-react";
import api from "@/lib/api";

export default function AdminDashboard() {
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
    { label: "Total Users", value: stats?.total_users ?? 0, icon: Users, color: "text-primary" },
    { label: "Pending Doctors", value: stats?.pending_doctors ?? 0, icon: UserCheck, color: "text-warning" },
    { label: "Specialties", value: stats?.total_specialties ?? 0, icon: Stethoscope, color: "text-success" },
    { label: "Appointments", value: stats?.total_appointments ?? 0, icon: Calendar, color: "text-info" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h1 className="fw-bold">Admin Dashboard</h1>
        <p className="text-secondary">Overview of the TABIBI platform</p>
      </div>

      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      {/* Stats */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="text-secondary mt-3">Loading...</p>
        </div>
      ) : (
        <div className="row g-3 mb-4">
          {statCards.map((s) => (
            <div className="col-12 col-sm-6 col-lg-3" key={s.label}>
              <div className="card card-popout h-100">
                <div className="card-body d-flex align-items-center gap-3">
                  <div className="rounded bg-primary bg-opacity-10 p-2">
                    <s.icon size={22} className={s.color} />
                  </div>
                  <div>
                    <div className="fw-bold fs-4">{s.value}</div>
                    <div className="small text-secondary">{s.label}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}