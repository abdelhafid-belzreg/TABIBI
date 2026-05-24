import { useEffect, useState } from "react";
import { Calendar, Clock, FileText, TrendingUp, TrendingDown } from "lucide-react";
import api from "@/lib/api";
import { toast } from "@/hooks/use-toast";
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
import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
  ArcElement, PointElement, LineElement, RadialLinearScale
);

const statusColors = {
  pending:   "text-bg-warning",
  accepted:  "text-bg-success",
  cancelled: "text-bg-danger",
  completed: "text-bg-primary",
};

const chartPalette = ["#4361ee", "#3a0ca3", "#7209b7", "#f72585", "#4cc9f0", "#06d6a0", "#ffd166"];

export default function Reports() {
  const [appointments, setAppointments] = useState([]);
  const [reportData,  setReportData]    = useState(null);
  const [loading,     setLoading]       = useState(true);
  const [error,       setError]         = useState("");
  const [filter,      setFilter]        = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptRes, reportRes] = await Promise.all([
          api.get("/admin/appointments"),
          api.get("/admin/reports"),
        ]);
        setAppointments(apptRes.data);
        setReportData(reportRes.data);
      } catch (err) {
        setError("Failed to load reports.");
        toast.danger("Error", "Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = filter === "all"
    ? appointments
    : appointments.filter((a) => a.status === filter);

  /* ── Chart configs ───────────────────────────────────── */

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom", labels: { boxWidth: 12, padding: 16 } } },
    scales: { x: { grid: { display: false } }, y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  };

  const statusChartData = {
    labels: reportData ? Object.keys(reportData.appointments_by_status).map((k) => k.charAt(0).toUpperCase() + k.slice(1)) : [],
    datasets: [{
      data: reportData ? Object.values(reportData.appointments_by_status) : [],
      backgroundColor: ["#ffd166", "#06d6a0", "#4361ee", "#ef476f"],
      borderWidth: 0,
    }],
  };

  const doctorChartData = {
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

  const dayChartData = {
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

  const weekChartData = {
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

  const sharedChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { grid: { display: false } }, y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  };

  const rateData = {
    labels: ["Completed", "Cancelled", "Pending", "Accepted"],
    datasets: [{
      data: reportData ? [
        reportData.appointments_by_status.completed,
        reportData.appointments_by_status.cancelled,
        reportData.appointments_by_status.pending,
        reportData.appointments_by_status.accepted,
      ] : [],
      backgroundColor: ["#4361ee", "#ef476f", "#ffd166", "#06d6a0"],
      borderWidth: 0,
    }],
  };

  /* ── Render ──────────────────────────────────────────── */

  return (
    <div>
      <h1 className="fw-bold mb-4">Reports</h1>

      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="text-secondary mt-3">Loading reports...</p>
        </div>
      ) : (
        <>
          {/* ── Summary Cards ──────────────────────────── */}
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
                    {reportData?.total_revenue ?? 0} <small className="fs-6">MAD</small>
                  </div>
                  <div className="small text-secondary">Est. Revenue</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Charts Row 1 ──────────────────────────── */}
          <div className="row g-3 mb-4">
            {/* Status Pie */}
            <div className="col-12 col-lg-4">
              <div className="card card-popout h-100">
                <div className="card-header bg-body-secondary py-2">
                  <strong className="small text-uppercase text-secondary">Appointment Status</strong>
                </div>
                <div className="card-body" style={{ height: 260 }}>
                  <Pie
                    data={statusChartData}
                    options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { boxWidth: 12, padding: 12 } } } }}
                  />
                </div>
              </div>
            </div>

            {/* Doctor Bar */}
            <div className="col-12 col-lg-8">
              <div className="card card-popout h-100">
                <div className="card-header bg-body-secondary py-2">
                  <strong className="small text-uppercase text-secondary">Appointments per Doctor</strong>
                </div>
                <div className="card-body" style={{ height: 260 }}>
                  <Bar data={doctorChartData} options={{ ...chartOptions, indexAxis: "y", scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } }, y: { grid: { display: false } } } }} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Charts Row 2 ──────────────────────────── */}
          <div className="row g-3 mb-4">
            {/* Day of Week */}
            <div className="col-12 col-lg-6">
              <div className="card card-popout h-100">
                <div className="card-header bg-body-secondary py-2">
                  <strong className="small text-uppercase text-secondary">Appointments by Day of Week</strong>
                </div>
                <div className="card-body" style={{ height: 260 }}>
                  <Line data={dayChartData} options={sharedChartOptions} />
                </div>
              </div>
            </div>

            {/* Last 7 Days */}
            <div className="col-12 col-lg-6">
              <div className="card card-popout h-100">
                <div className="card-header bg-body-secondary py-2">
                  <strong className="small text-uppercase text-secondary">Last 7 Days</strong>
                </div>
                <div className="card-body" style={{ height: 260 }}>
                  <Line data={weekChartData} options={sharedChartOptions} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Distribution Pie ───────────────────────── */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-lg-4">
              <div className="card card-popout h-100">
                <div className="card-header bg-body-secondary py-2">
                  <strong className="small text-uppercase text-secondary">Distribution</strong>
                </div>
                <div className="card-body d-flex align-items-center justify-content-center" style={{ height: 260 }}>
                  <Pie
                    data={rateData}
                    options={{ responsive: true, maintainAspectRatio: false, cutout: "60%", plugins: { legend: { position: "bottom", labels: { boxWidth: 12, padding: 12 } } } }}
                  />
                </div>
              </div>
            </div>

            {/* ── Filter + Table ───────────────────────── */}
            <div className="col-12 col-lg-8">
              <div className="card card-popout h-100">
                <div className="card-header bg-body-secondary py-2 d-flex align-items-center gap-2">
                  <Calendar size={14} className="text-secondary" />
                  <strong className="small text-uppercase text-secondary">Recent Appointments</strong>
                </div>
                <div className="card-body p-3">
                  {/* Filter Buttons */}
                  <div className="d-flex gap-2 mb-3 flex-wrap">
                    {["all", "pending", "accepted", "completed", "cancelled"].map((s) => (
                      <button
                        key={s}
                        className={`btn btn-sm ${filter === s ? "btn-primary" : "btn-outline-secondary"}`}
                        onClick={() => setFilter(s)}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                        <span className="ms-1 badge bg-white text-dark">
                          {s === "all" ? appointments.length : appointments.filter((a) => a.status === s).length}
                        </span>
                      </button>
                    ))}
                  </div>

                  {filtered.length === 0 ? (
                    <div className="text-center text-secondary py-4">No appointments found.</div>
                  ) : (
                    <div className="table-responsive" style={{ maxHeight: 400, overflowY: "auto" }}>
                      <table className="table table-sm table-hover align-middle mb-0">
                        <thead className="sticky-top bg-body">
                          <tr className="text-secondary small">
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.slice(0, 20).map((appt) => (
                            <tr key={appt.id}>
                              <td className="small">{appt.patient?.name || "N/A"}</td>
                              <td className="small">Dr. {appt.doctor?.name || "N/A"}</td>
                              <td className="small d-flex align-items-center gap-1"><Calendar size={12} /> {appt.appointment_date}</td>
                              <td className="small d-flex align-items-center gap-1"><Clock size={12} /> {appt.appointment_time?.slice(0, 5)}</td>
                              <td><span className={`badge ${statusColors[appt.status]}`}>{appt.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
