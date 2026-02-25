import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search, Stethoscope, DollarSign, MapPin,
  Filter, X, Star, Clock,
} from "lucide-react";
import api from "@/lib/api";
import { Spinner }    from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// ── Main ────────────────────────────────────────────────
export default function DoctorsList() {
  const [doctors,           setDoctors]           = useState([]);
  const [specialties,       setSpecialties]       = useState([]);
  const [cities,            setCities]            = useState([]);
  const [search,            setSearch]            = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedCity,      setSelectedCity]      = useState("all");
  const [selectedDay,       setSelectedDay]       = useState("all");
  const [showSidebar,       setShowSidebar]       = useState(false);
  const [loading,           setLoading]           = useState(true);
  const [error,             setError]             = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsRes, specialtiesRes] = await Promise.all([
          api.get("/doctors"),
          api.get("/specialties"),
        ]);
        setDoctors(doctorsRes.data);
        setSpecialties(specialtiesRes.data);
        const uniqueCities = [
          ...new Set(doctorsRes.data.map((d) => d.doctor_profile?.city).filter(Boolean)),
        ].sort();
        setCities(uniqueCities);
      } catch {
        setError("Failed to load doctors. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const resetFilters = () => {
    setSelectedSpecialty("all");
    setSelectedCity("all");
    setSelectedDay("all");
    setSearch("");
  };

  const hasActiveFilters =
    selectedSpecialty !== "all" || selectedCity !== "all" ||
    selectedDay !== "all" || search !== "";

  const filtered = doctors.filter((d) => {
    const profile       = d.doctor_profile;
    const matchesSearch =
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      profile?.specialty?.toLowerCase().includes(search.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "all" || profile?.specialty === selectedSpecialty;
    const matchesCity      = selectedCity === "all"      || profile?.city      === selectedCity;
    const matchesDay       = selectedDay === "all" ||
      (d.availabilities ?? []).some((a) => String(a.day_of_week) === selectedDay);
    return matchesSearch && matchesSpecialty && matchesCity && matchesDay;
  });

  const SidebarContent = () => (
    <div className="d-flex flex-column gap-4">

      {/* Header */}
      <div className="d-flex align-items-center justify-content-between">
        <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
          <Filter size={15} /> Filters
          {hasActiveFilters && (
            <span className="badge text-bg-primary" style={{ fontSize: "0.65rem" }}>Active</span>
          )}
        </h6>
        {hasActiveFilters && (
          <button
            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
            onClick={resetFilters}
          >
            <X size={13} /> Reset
          </button>
        )}
      </div>

      {/* Specialty */}
      <div>
        <label className="form-label fw-semibold small text-uppercase text-secondary mb-1">
          Specialty
        </label>
        <select
          className="form-select form-select-sm"
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
        >
          <option value="all">All Specialties</option>
          {specialties.map((s) => (
            <option key={s.id} value={s.name}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* City */}
      <div>
        <label className="form-label fw-semibold small text-uppercase text-secondary mb-1">
          City
        </label>
        <select
          className="form-select form-select-sm"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="all">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Available Day */}
      <div>
        <label className="form-label fw-semibold small text-uppercase text-secondary mb-1">
          Available On
        </label>
        <div className="d-flex flex-column gap-1">
          <div className="form-check">
            <input
              className="form-check-input" type="radio" name="day"
              id="day-all" value="all"
              checked={selectedDay === "all"}
              onChange={(e) => setSelectedDay(e.target.value)}
            />
            <label className="form-check-label small" htmlFor="day-all">Any Day</label>
          </div>
          {dayNames.map((day, index) => (
            <div className="form-check" key={index}>
              <input
                className="form-check-input" type="radio" name="day"
                id={`day-${index}`} value={String(index)}
                checked={selectedDay === String(index)}
                onChange={(e) => setSelectedDay(e.target.value)}
              />
              <label className="form-check-label small" htmlFor={`day-${index}`}>{day}</label>
            </div>
          ))}
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* ── Hero / Search ── */}
      <section className="py-5 bg-body-secondary border-bottom">
        <div className="container">
          <h1 className="h3 fw-bold mb-1">Find a Doctor</h1>
          <p className="text-secondary mb-4 small">Browse our qualified healthcare professionals</p>
          <div className="row g-2">
            <div className="col-12 col-sm-8 col-lg-6">
              <div className="input-group">
                <span className="input-group-text bg-body border-end-0">
                  <Search size={15} className="text-secondary" />
                </span>
                <input
                  className="form-control border-start-0 ps-0"
                  placeholder="Search by name or specialty..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    className="btn btn-outline-secondary border-start-0"
                    onClick={() => setSearch("")}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
            <div className="col-12 d-sm-none">
              <button
                className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <Filter size={15} />
                {showSidebar ? "Hide Filters" : "Show Filters"}
                {hasActiveFilters && <span className="badge text-bg-primary">Active</span>}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main ── */}
      <section className="py-4">
        <div className="container">
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="row g-4">

            {/* Mobile Sidebar */}
            {showSidebar && (
              <div className="col-12 d-sm-none">
                <div className="card border-0 shadow-sm p-3">
                  <SidebarContent />
                </div>
              </div>
            )}

            {/* Desktop Sidebar */}
            <div className="col-sm-3 d-none d-sm-block">
              <div className="card border-0 shadow-sm p-3 sticky-top" style={{ top: 80 }}>
                <SidebarContent />
              </div>
            </div>

            {/* Doctors Grid */}
            <div className="col-12 col-sm-9">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <p className="text-secondary small mb-0">
                  Showing <strong>{filtered.length}</strong> doctor{filtered.length !== 1 ? "s" : ""}
                  {hasActiveFilters && (
                    <button className="btn btn-link btn-sm text-danger p-0 ms-2" onClick={resetFilters}>
                      Clear filters
                    </button>
                  )}
                </p>
              </div>

              {loading ? (
                <Spinner text="Loading doctors..." />
              ) : filtered.length === 0 ? (
                <EmptyState
                  icon={Stethoscope}
                  title="No Doctors Found"
                  desc="Try adjusting your filters or search term."
                />
              ) : (
                <div className="row g-4">
                  {filtered.map((doc) => {
                    const profile = doc.doctor_profile;
                    return (
                      <div className="col-12 col-md-6 col-lg-4" key={doc.id}>
                        <div className="card h-100 border-0 shadow-sm card-hover">
                          <div className="card-body d-flex flex-column p-3">

                            {/* Header */}
                            <div className="d-flex align-items-start gap-3 mb-3">
                              <div
                                className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{ width: 52, height: 52 }}
                              >
                                {profile?.avatar_url ? (
                                  <img
                                    src={profile.avatar_url}
                                    alt={doc.name}
                                    className="rounded-circle"
                                    style={{ width: 52, height: 52, objectFit: "cover" }}
                                  />
                                ) : (
                                  <Stethoscope className="text-primary" size={22} />
                                )}
                              </div>
                              <div className="flex-grow-1 overflow-hidden">
                                <h6 className="mb-1 fw-bold text-truncate">Dr. {doc.name}</h6>
                                <span className="badge text-bg-primary bg-opacity-10" style={{ fontSize: "0.7rem" }}>
                                  {profile?.specialty || "General"}
                                </span>
                              </div>
                              <div className="d-flex align-items-center gap-1 text-warning flex-shrink-0">
                                <Star size={12} fill="currentColor" />
                                <span className="text-secondary" style={{ fontSize: "0.7rem" }}>5.0</span>
                              </div>
                            </div>

                            {/* Bio */}
                            <p
                              className="text-secondary small mb-2 flex-grow-1"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {profile?.bio || "No bio available"}
                            </p>

                            {/* Meta */}
                            <div className="d-flex flex-column gap-1 mb-2">
                              {profile?.city && (
                                <span className="d-flex align-items-center gap-1 text-secondary small">
                                  <MapPin size={12} className="text-primary" /> {profile.city}
                                </span>
                              )}
                              {profile?.clinic_name && (
                                <span className="d-flex align-items-center gap-1 text-secondary small">
                                  🏥 {profile.clinic_name}
                                </span>
                              )}
                            </div>

                            {/* Availability */}
                            {doc.availabilities?.length > 0 && (
                              <div className="mb-2 d-flex flex-wrap gap-1">
                                <Clock size={12} className="text-secondary mt-1 flex-shrink-0" />
                                {doc.availabilities.map((a) => (
                                  <span
                                    key={a.id}
                                    className="badge bg-success bg-opacity-10 text-success"
                                    style={{ fontSize: "0.65rem" }}
                                  >
                                    {dayNames[a.day_of_week]?.slice(0, 3)}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Footer */}
                            <div className="d-flex align-items-center justify-content-between border-top pt-2 mt-auto">
                              <span className="d-flex align-items-center text-success fw-semibold small">
                                <DollarSign size={14} className="me-1" />
                                {profile?.consultation_fee ?? "N/A"} MAD
                              </span>
                              <Link to={`/doctors/${doc.id}`} className="btn btn-outline-primary btn-sm">
                                View Profile
                              </Link>
                            </div>

                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}