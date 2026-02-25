import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Stethoscope, DollarSign, MapPin } from "lucide-react";
import api from "@/lib/api";

export default function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsRes, specialtiesRes] = await Promise.all([
          api.get("/doctors"),
          api.get("/specialties"),
        ]);
        setDoctors(doctorsRes.data);
        setSpecialties(specialtiesRes.data);
      } catch (err) {
        setError("Failed to load doctors. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = doctors.filter((d) => {
    const matchesSearch =
      d.profile?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === "all" || d.specialty?.name === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <>
      {/* Header & Search */}
      <section className="py-5 b">
        <div className="container">
          <h1 className="h3 fw-bold mb-2">Find a Doctor</h1>
          <p className="text-secondary mb-4">
            Browse our qualified healthcare professionals
          </p>
          <div className="row g-2 mb-4">
            <div className="col-12 col-sm-8">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <Search size={16} className="text-secondary" />
                </span>
                <input
                  className="form-control"
                  placeholder="Search by name or specialty..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <select
                className="form-select"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <option value="all">All Specialties</option>
                {specialties.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors List */}
      <section className="py-4">
        <div className="container">
          {/* Error */}
          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
              <p className="text-secondary mt-3">Loading doctors...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-5 text-secondary">
              No doctors found. Try adjusting your search.
            </div>
          ) : (
            <div className="row g-4">
              {filtered.map((doc) => (
                <div className="col-12 col-md-6 col-lg-4" key={doc.id}>
                  <Link
                    to={`/doctors/${doc.id}`}
                    className="text-decoration-none"
                  >
                    <div className="card h-100 shadow-sm card-hover">
                      <div className="card-body">
                        {/* Doctor Header */}
                        <div className="d-flex align-items-start gap-3 mb-3">
                          <div
                            className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{ width: 56, height: 56 }}
                          >
                            {doc.profile?.avatar_url ? (
                              <img
                                src={doc.profile.avatar_url}
                                alt={doc.profile.full_name}
                                className="rounded-circle"
                                style={{ width: 56, height: 56, objectFit: "cover" }}
                              />
                            ) : (
                              <Stethoscope className="text-primary" size={24} />
                            )}
                          </div>
                          <div className="flex-grow-1 overflow-hidden">
                            <h5 className="mb-1 text-truncate text-dark">
                              Dr. {doc.profile?.full_name}
                            </h5>
                            <span className="badge bg-primary bg-opacity-10 text-primary">
                              {doc.specialty?.name || "General"}
                            </span>
                          </div>
                        </div>

                        {/* Bio */}
                        <p
                          className="text-secondary small mb-3"
                          style={{ minHeight: 40 }}
                        >
                          {doc.bio || "No bio available"}
                        </p>

                        {/* Qualifications */}
                        {doc.qualifications && (
                          <p className="small text-secondary mb-2">
                            🎓 {doc.qualifications}
                          </p>
                        )}

                        {/* Location */}
                        {doc.city && (
                          <p className="small text-secondary mb-2 d-flex align-items-center gap-1">
                            <MapPin size={14} /> {doc.city}
                          </p>
                        )}

                        {/* Footer */}
                        <div className="d-flex align-items-center justify-content-between border-top pt-2 mt-2">
                          <span className="d-flex align-items-center text-primary fw-medium">
                            <DollarSign size={16} className="me-1" />
                            {doc.consultation_fee ?? "N/A"}
                          </span>
                          <button className="btn btn-outline-primary btn-sm">
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}