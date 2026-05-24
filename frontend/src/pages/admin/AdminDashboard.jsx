import { useEffect, useState } from "react";
import { Users, UserCheck, Stethoscope, TrendingUp, TrendingDown } from "lucide-react";
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
  PointElement,
  LineElement,
  RadialLinearScale,
} from "chart.js";
import { Bar, Pie, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
  ArcElement, PointElement, LineElement, RadialLinearScale
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: "bottom", labels: { boxWidth: 12, padding: 16 } } },
  scales: { x: { grid: { display: false } }, y: { beginAtZero: true, ticks: { stepSize: 1 } } },
};

const sharedChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { x: { grid: { display: false } }, y: { beginAtZero: true, ticks: { stepSize: 1 } } },
};

const chartPalette = ["#4361ee", "#3a0ca3", "#7209b7", "#f72585", "#4cc9f0", "#06d6a0", "#ffd166"];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, reportRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/reports"),
        ]);
        setStats(statsRes.data);
        setReportData(reportRes.data);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ── Chart data ───────────────────────────────────── */

  const userRoleData = {
    labels: ["Doctors", "Patients", "Pending Doctors"],
    datasets: [{
      data: stats ? [stats.total_doctors, stats.total_patients, stats.pending_doctors] : [],
      backgroundColor: ["#4361ee", "#06d6a0", "#ffd166"],
      borderWidth: 0,
    }],
  };

  const statusPieData = {
    labels: stats ? Object.keys(stats.appointments_by_status).map((k) => k.charAt(0).toUpperCase() + k.slice(1)) : [],
    datasets: [{
      data: stats ? Object.values(stats.appointments_by_status) : [],
      backgroundColor: ["#ffd166", "#06d6a0", "#4361ee", "#ef476f"],
      borderWidth: 0,
    }],
  };

  const doctorBarData = {
    labels: reportData ? reportData.appointments_by_doctor.map((d) => d.name) : [],
    datasets: [{
      label: "Appointments",
      data: reportData ? reportData.appointments_by_doctor.map((d) => d.count) : [],
      backgroundColor: chartPalette[0] + "cc",
      borderColor: chartPalette[0],
      borderWidth: 1,
      borderRadius: 6,
    }],
  };

  const dayLineData = {
    labels: reportData ? Object.keys(reportData.appointments_by_day) : [],
    datasets: [{
      label: "Appointments",
      data: reportData ? Object.values(reportData.appointments_by_day) : [],
      borderColor: chartPalette[2],
      backgroundColor: chartPalette[2] + "22",
      fill: true,
      tension: 0.4,
    }],
  };

  const weekLineData = {
    labels: reportData ? reportData.last_7_days.map((d) => d.date) : [],
    datasets: [{
      label: "Bookings",
      data: reportData ? reportData.last_7_days.map((d) => d.count) : [],
      borderColor: chartPalette[1],
      backgroundColor: chartPalette[1] + "22",
      fill: true,
      tension: 0.4,
    }],
  };

  const formatRevenue = (val) => {
    if (!val) return "0.00";
    return Number(val).toFixed(2);
  };

  /* ── Render ──────────────────────────────────────── */

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h1 className="fw-bold">Admin Dashboard</h1>
        <p className="text-secondary">Overview of the TABIBI platform</p>
      </div>

      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="text-secondary mt-3">Loading...</p>
        </div>
      ) : (
        <>
          {/* ── Stat Cards ──────────────────────────── */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-sm-6 col-lg-4">
              <div className="card card-popout h-100">
                <div className="card-body d-flex align-items-center gap-3">
                  <div className="rounded bg-primary bg-opacity-10 p-2">
                    <Users size={22} className="text-primary" />
                  </div>
                  <div>
                    <div className="fw-bold fs-4">{stats?.total_users ?? 0}</div>
                    <div className="small text-secondary">Total Users</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-sm-6 col-lg-4">
              <div className="card card-popout h-100">
                <div className="card-body d-flex align-items-center gap-3">
                  <div className="rounded bg-warning bg-opacity-10 p-2">
                    <UserCheck size={22} className="text-warning" />
                  </div>
                  <div>
                    <div className="fw-bold fs-4">{stats?.pending_doctors ?? 0}</div>
                    <div className="small text-secondary">Pending Doctors</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-sm-6 col-lg-4">
              <div className="card card-popout h-100">
                <div className="card-body d-flex align-items-center gap-3">
                  <div className="rounded bg-success bg-opacity-10 p-2">
                    <Stethoscope size={22} className="text-success" />
                  </div>
                  <div>
                    <div className="fw-bold fs-4">{stats?.total_specialties ?? 0}</div>
                    <div className="small text-secondary">Specialties</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Summary Cards ───────────────────────── */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="card card-popout">
                <div className="card-body text-center p-3">
                  <div className="fw-bold fs-2">{reportData?.total_appointments ?? 0}</div>
                  <div className="small text-secondary">Total Appointments</div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card card-popout">
                <div className="card-body text-center p-3">
                  <div className="fw-bold fs-2 text-success d-flex align-items-center justify-content-center gap-1">
                    <TrendingUp size={18} /> {reportData?.completion_rate ?? 0}%
                  </div>
                  <div className="small text-secondary">Completion Rate</div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card card-popout">
                <div className="card-body text-center p-3">
                  <div className="fw-bold fs-2 text-danger d-flex align-items-center justify-content-center gap-1">
                    <TrendingDown size={18} /> {reportData?.cancellation_rate ?? 0}%
                  </div>
                  <div className="small text-secondary">Cancellation Rate</div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card card-popout">
                <div className="card-body text-center p-3">
                  <div className="fw-bold fs-2 text-success">
                    {formatRevenue(reportData?.total_revenue)} <small className="fs-6">MAD</small>
                  </div>
                  <div className="small text-secondary">Est. Revenue</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Charts Row 1 ────────────────────────── */}
          <div className="row g-3 mb-4">
            {/* User Roles Doughnut */}
            <div className="col-12 col-lg-6">
              <div className="card card-popout h-100">
                <div className="card-header bg-body-secondary py-2">
                  <strong className="small text-uppercase text-secondary">Users by Role</strong>
                </div>
                <div className="card-body d-flex align-items-center justify-content-center" style={{ height: 280 }}>
                  <Doughnut
                    data={userRoleData}
                    options={{ responsive: true, maintainAspectRatio: false, cutout: "55%", plugins: { legend: { position: "bottom", labels: { boxWidth: 12, padding: 16 } } } }}
                  />
                </div>
              </div>
            </div>

            {/* Appointment Status Pie */}
            <div className="col-12 col-lg-6">
              <div className="card card-popout h-100">
                <div className="card-header bg-body-secondary py-2">
                  <strong className="small text-uppercase text-secondary">Appointment Status</strong>
                </div>
                <div className="card-body d-flex align-items-center justify-content-center" style={{ height: 280 }}>
                  <Pie
                    data={statusPieData}
                    options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { boxWidth: 12, padding: 16 } } } }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Charts Row 2 ────────────────────────── */}
          <div className="row g-3 mb-4">
            {/* Doctor Bar */}
            <div className="col-12 col-lg-8">
              <div className="card card-popout h-100">
                <div className="card-header bg-body-secondary py-2">
                  <strong className="small text-uppercase text-secondary">Appointments per Doctor</strong>
                </div>
                <div className="card-body" style={{ height: 280 }}>
                  <Bar
                    data={doctorBarData}
                    options={{ ...chartOptions, indexAxis: "y", scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } }, y: { grid: { display: false } } } }}
                  />
                </div>
              </div>
            </div>

            {/* Last 7 Days */}
            <div className="col-12 col-lg-4">
              <div className="card card-popout h-100">
                <div className="card-header bg-body-secondary py-2">
                  <strong className="small text-uppercase text-secondary">Last 7 Days</strong>
                </div>
                <div className="card-body" style={{ height: 280 }}>
                  <Line data={weekLineData} options={sharedChartOptions} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Charts Row 3 ────────────────────────── */}
          <div className="row g-3 mb-4">
            {/* Day of Week */}
            <div className="col-12">
              <div className="card card-popout">
                <div className="card-header bg-body-secondary py-2">
                  <strong className="small text-uppercase text-secondary">Appointments by Day of Week</strong>
                </div>
                <div className="card-body" style={{ height: 260 }}>
                  <Line data={dayLineData} options={sharedChartOptions} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
