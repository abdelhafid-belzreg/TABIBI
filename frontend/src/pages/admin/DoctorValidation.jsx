import { useEffect, useState } from "react";
import { Check, X, Mail, Phone, Stethoscope, Building, MapPin } from "lucide-react";
import api from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const statusColors = {
  pending:  "text-bg-warning",
  approved: "text-bg-success",
  rejected: "text-bg-danger",
};

export default function DoctorValidation() {
  const [doctors, setDoctors]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [filter, setFilter]     = useState("pending"); // ✅ default to pending

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/admin/doctors/pending");
        setDoctors(res.data);
      } catch (err) {
        setError("Failed to load doctors.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/doctors/${id}/status`, { status });
      // ✅ Update doctor_profile.status not doc.status
      setDoctors((prev) =>
        prev.map((d) =>
          d.id === id
            ? { ...d, doctor_profile: { ...d.doctor_profile, status } }
            : d
        )
      );
      toast.success("Doctor approved!");
    } catch (err) {
      setError("Failed to update doctor status.");
      toast.danger("Error", "Failed to update doctor status.");
    }
  };

  // ✅ Filter by doctor_profile.status
  const filtered =
    filter === "all"
      ? doctors
      : doctors.filter((d) => (d.doctor_profile?.status ?? "pending") === filter);

  return (
    <div>
      <h1 className="fw-bold mb-4">Doctor Validation</h1>

      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      {/* ✅ Filter Buttons */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {["all", "pending", "approved", "rejected"].map((s) => (
          <button
            key={s}
            className={`btn btn-sm ${filter === s ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setFilter(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
            <span className="ms-1 badge bg-white text-dark">
              {s === "all"
                ? doctors.length
                : doctors.filter((d) => (d.doctor_profile?.status ?? "pending") === s).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="text-secondary mt-3">Loading doctors...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <div className="card-body text-center text-secondary py-5">
            No {filter === "all" ? "" : filter} doctors found.
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filtered.map((doc) => {
            // ✅ Get status from doctor_profile
            const status = doc.doctor_profile?.status ?? "pending";

            return (
              <div className="card card-popout" key={doc.id}>
                <div className="card-body p-4">
                  <div className="d-flex flex-column flex-sm-row justify-content-between gap-3">
                    <div className="d-flex flex-column gap-1">

                      <div className="fw-semibold fs-6">Dr. {doc.name}</div>

                      <div className="small text-secondary d-flex align-items-center gap-1">
                        <Mail size={13} className="flex-shrink-0" />
                        {doc.email}
                      </div>

                      {doc.phone && (
                        <div className="small text-secondary d-flex align-items-center gap-1">
                          <Phone size={13} className="flex-shrink-0" />
                          {doc.phone}
                        </div>
                      )}

                      {doc.doctor_profile?.specialty && (
                        <div className="small text-secondary d-flex align-items-center gap-1">
                          <Stethoscope size={13} className="flex-shrink-0" />
                          {doc.doctor_profile.specialty}
                        </div>
                      )}

                      {doc.doctor_profile?.clinic_name && (
                        <div className="small text-secondary d-flex align-items-center gap-1">
                          <Building size={13} className="flex-shrink-0" />
                          {doc.doctor_profile.clinic_name}
                        </div>
                      )}

                      {doc.doctor_profile?.city && (
                        <div className="small text-secondary d-flex align-items-center gap-1">
                          <MapPin size={13} className="flex-shrink-0" />
                          {doc.doctor_profile.city}
                        </div>
                      )}

                    </div>

                    <div className="d-flex flex-column align-items-start align-items-sm-end gap-2">
                      {/* ✅ Status from doctor_profile */}
                      <span className={`badge ${statusColors[status] ?? "text-bg-warning"}`}>
                        {status}
                      </span>

                      {/* ✅ Show buttons only if pending */}
                      {status === "pending" && (
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-success btn-sm d-flex align-items-center gap-1"
                            onClick={() => updateStatus(doc.id, "approved")}
                          >
                            <Check size={14} /> Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm d-flex align-items-center gap-1"
                            onClick={() => updateStatus(doc.id, "rejected")}
                          >
                            <X size={14} /> Reject
                          </button>
                        </div>
                      )}

                      {/* ✅ Allow re-pending approved/rejected doctors */}
                      {status !== "pending" && (
                        <button
                          className="btn btn-outline-warning btn-sm d-flex align-items-center gap-1"
                          onClick={() => updateStatus(doc.id, "pending")}
                        >
                          Reset to Pending
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