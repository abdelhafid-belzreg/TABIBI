import { useEffect, useState } from "react";
import { Users, UserCheck, Calendar, Stethoscope } from "lucide-react";
import api from "@/lib/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: "bottom", labels: { boxWidth: 12, padding: 16 } } },
  scales: { x: { grid: { display: false } }, y: { beginAtZero: true, ticks: { stepSize: 1 } } },
};

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

  const userRoleData = {
    labels: ["Doctors", "Patients", "Pending Doctors"],
    datasets: [{
      data: stats ? [stats.total_doctors, stats.total_patients, stats.pending_doctors] : [],
      backgroundColor: ["#4361ee", "#06d6a0", "#ffd166"],
      borderWidth: 0,
    }],
  };

  const statusData = {
    labels: stats?.appointments_by_status
      ? Object.keys(stats.appointments_by_status).map((k) => k.charAt(0).toUpperCase() + k.slice(1))
      : [],
    datasets: [{
      data: stats ? Object.values(stats.appointments_by_status) : [],
      backgroundColor: ["#ffd166", "#06d6a0", "#4361ee", "#ef476f"],
      borderWidth: 0,
      borderRadius: 4,
    }],
  };

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
          {/* Stat Cards */}
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

          {/* Charts */}
          <div className="row g-3">
            {/* User Roles Doughnut */}
            <div className="col-12 col-lg-6">
              <div className="card card-popout h-100">
                <div className="card-header bg-body-secondary py-2">
                  <strong className="small text-uppercase text-secondary">Users by Role</strong>
                </div>
                <div className="card-body d-flex align-items-center justify-content-center" style={{ height: 300 }}>
                  <Doughnut
                    data={userRoleData}
                    options={{ responsive: true, maintainAspectRatio: false, cutout: "55%", plugins: { legend: { position: "bottom", labels: { boxWidth: 12, padding: 16 } } } }}
                  />
                </div>
              </div>
            </div>

            {/* Appointment Status Bar */}
            <div className="col-12 col-lg-6">
              <div className="card card-popout h-100">
                <div className="card-header bg-body-secondary py-2">
                  <strong className="small text-uppercase text-secondary">Appointments by Status</strong>
                </div>
                <div className="card-body" style={{ height: 300 }}>
                  <Bar data={statusData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
