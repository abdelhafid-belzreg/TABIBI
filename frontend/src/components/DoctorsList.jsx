import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Stethoscope, DollarSign, MapPin, Filter, X } from "lucide-react";
import api from "@/lib/api";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [cities, setCities] = useState([]); // ✅ dynamic cities from DB
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedDay, setSelectedDay] = useState("all");
  const [minFee, setMinFee] = useState("");
  const [maxFee, setMaxFee] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
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

        // ✅ Extract unique cities from doctors data
        const uniqueCities = [
          ...new Set(
            doctorsRes.data
              .map((d) => d.doctor_profile?.city)
              .filter(Boolean)
          ),
        ].sort();
        setCities(uniqueCities);

      } catch (err) {
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
    setMinFee("");
    setMaxFee("");
    setSearch("");
  };

  const hasActiveFilters =
    selectedSpecialty !== "all" ||
    selectedCity !== "all" ||
    selectedDay !== "all" ||
    minFee !== "" ||
    maxFee !== "" ||
    search !== "";

  const filtered = doctors.filter((d) => {
    const profile = d.doctor_profile;

    const matchesSearch =
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      profile?.specialty?.toLowerCase().includes(search.toLowerCase());

    const matchesSpecialty =
      selectedSpecialty === "all" || profile?.specialty === selectedSpecialty;

    const matchesCity =
      selectedCity === "all" || profile?.city === selectedCity;

    const fee = profile?.consultation_fee ?? 0;
    const matchesMinFee = minFee === "" || fee >= Number(minFee);
    const matchesMaxFee = maxFee === "" || fee <= Number(maxFee);

    const matchesDay =
      selectedDay === "all" ||
      (d.availabilities ?? []).some(
        (a) => String(a.day_of_week) === selectedDay
      );

    return matchesSearch && matchesSpecialty && matchesCity && matchesMinFee && matchesMaxFee && matchesDay;
  });

  const SidebarContent = () => (
    <div className="d-flex flex-column gap-4">

      {/* Header */}
      <div className="d-flex align-items-center justify-content-between">
        <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
          <Filter size={18} /> Filters
        </h5>
        {hasActiveFilters && (
          <button className="btn btn-sm btn-outline-danger" onClick={resetFilters}>
            <X size={14} className="me-1" /> Reset
          </button>
        )}
      </div>

      {/* Specialty */}
      <div>
        <label className="form-label fw-semibold small text-uppercase text-secondary">
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

      {/* City ✅ from DB */}
      <div>
        <label className="form-label fw-semibold small text-uppercase text-secondary">
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

      {/* Availability Day */}
      <div>
        <label className="form-label fw-semibold small text-uppercase text-secondary">
          Available On
        </label>
        <div className="d-flex flex-column gap-1">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="day"
              id="day-all"
              value="all"
              checked={selectedDay === "all"}
              onChange={(e) => setSelectedDay(e.target.value)}
            />
            <label className="form-check-label small" htmlFor="day-all">Any Day</label>
          </div>
          {dayNames.map((day, index) => (
            <div className="form-check" key={index}>
              <input
                className="form-check-input"
                type="radio"
                name="day"
                id={`day-${index}`}
                value={String(index)}
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
      {/* Header & Search */}
      <section className="py-5 bg-body-tertiary border-bottom">
        <div className="container">
          <h1 className="h3 fw-bold mb-2">Find a Doctor</h1>
          <p className="text-secondary mb-4">Browse our qualified healthcare professionals</p>
          <div className="row g-2">
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
            <div className="col-12 d-sm-none">
              <button
                className="btn btn-outline-primary w-100"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <Filter size={16} className="me-2" />
                {showSidebar ? "Hide Filters" : "Show Filters"}
                {hasActiveFilters && <span className="badge bg-primary ms-2">Active</span>}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-4">
        <div className="container">
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="row g-4">

            {/* Mobile Sidebar */}
            <div className={`col-12 d-sm-none ${showSidebar ? "" : "d-none"}`}>
              <div className="card shadow-sm p-3">
                <SidebarContent />
              </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="col-sm-3 d-none d-sm-block z-3">
              <div className="card shadow-sm p-3 sticky-top" style={{ top: 80 }}>
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
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status" />
                  <p className="text-secondary mt-3">Loading doctors...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-5 text-secondary">
                  <Stethoscope size={48} className="mb-3 opacity-25" />
                  <p>No doctors found. Try adjusting your filters.</p>
                  <button className="btn btn-outline-primary btn-sm" onClick={resetFilters}>
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="row g-4">
                  {filtered.map((doc) => (
                    <div className="col-12 col-md-6 col-lg-4" key={doc.id}>
                      <div className="card h-100 shadow-sm card-hover">
                        <div className="card-body d-flex flex-column">

                          {/* Doctor Header */}
                          <div className="d-flex align-items-start gap-3 mb-3">
                            <div
                              className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0"
                              style={{ width: 56, height: 56 }}
                            >
                              {doc.doctor_profile?.avatar_url ? (
                                <img
                                  src={doc.doctor_profile.avatar_url}
                                  alt={doc.name}
                                  className="rounded-circle"
                                  style={{ width: 56, height: 56, objectFit: "cover" }}
                                />
                              ) : (
                                <Stethoscope className="text-primary" size={24} />
                              )}
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                              <h5 className="mb-1 text-truncate text-dark">Dr. {doc.name}</h5>
                              <span className="badge bg-primary bg-opacity-10 text-primary">
                                {doc.doctor_profile?.specialty || "General"}
                              </span>
                            </div>
                          </div>

                          {/* Bio */}
                          <p className="text-secondary small mb-3" style={{ minHeight: 40 }}>
                            {doc.doctor_profile?.bio || "No bio available"}
                          </p>

                          {/* Qualifications */}
                          {doc.doctor_profile?.qualifications && (
                            <p className="small text-secondary mb-2">
                              🎓 {doc.doctor_profile.qualifications}
                            </p>
                          )}

                          {/* Location */}
                          {doc.doctor_profile?.city && (
                            <p className="small text-secondary mb-2 d-flex align-items-center gap-1">
                              <MapPin size={14} /> {doc.doctor_profile.city}
                            </p>
                          )}

                          {/* Availability day badges */}
                          {doc.availabilities?.length > 0 && (
                            <div className="mb-2 d-flex flex-wrap gap-1">
                              {doc.availabilities.map((a) => (
                                <span key={a.id} className="badge bg-success bg-opacity-10 text-success small">
                                  {dayNames[a.day_of_week]?.slice(0, 3)}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Footer */}
                          <div className="d-flex align-items-center justify-content-between border-top pt-2 mt-auto">
                            <span className="d-flex align-items-center text-primary fw-medium">
                              <DollarSign size={16} className="me-1" />
                              {doc.doctor_profile?.consultation_fee ?? "N/A"} MAD
                            </span>
                            <Link to={`/doctors/${doc.id}`} className="btn btn-outline-primary btn-sm">
                              View Profile
                            </Link>
                          </div>

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}