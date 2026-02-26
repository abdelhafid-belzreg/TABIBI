import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Search, Stethoscope, DollarSign, MapPin,
  Filter, X, Clock, Building,
} from "lucide-react";
import api from "@/lib/api";
import { Spinner }    from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";

const dayNames = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

// ── Scroll-triggered fade-in hook ────────────────────────
function useFadeIn(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

// ── FadeIn wrapper ────────────────────────────────────────
function FadeIn({ children, delay = 0, direction = "up", className = "" }) {
  const [ref, visible] = useFadeIn();

  const translate = direction === "up"    ? "translateY(30px)"
                  : direction === "down"  ? "translateY(-30px)"
                  : direction === "left"  ? "translateX(30px)"
                  : direction === "right" ? "translateX(-30px)"
                  : "translateY(30px)";

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translate(0)" : translate,
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function Doctors() {
  const { t, i18n } = useTranslation();
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

  // Translate day names for availability
  const dayNamesT = [
    t("doctors.days.sunday", "Sunday"),
    t("doctors.days.monday", "Monday"),
    t("doctors.days.tuesday", "Tuesday"),
    t("doctors.days.wednesday", "Wednesday"),
    t("doctors.days.thursday", "Thursday"),
    t("doctors.days.friday", "Friday"),
    t("doctors.days.saturday", "Saturday"),
  ];

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
        setError(t("common.error"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t]);

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
          <Filter size={15} /> {t("common.filters")}
          {hasActiveFilters && (
            <span className="badge text-bg-primary" style={{ fontSize: "0.65rem" }}>{t("common.active")}</span>
          )}
        </h6>
        {hasActiveFilters && (
          <button
            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
            onClick={resetFilters}
          >
            <X size={13} /> {t("common.reset")}
          </button>
        )}
      </div>

      {/* Specialty */}
      <div>
        <label className="form-label fw-semibold small text-uppercase text-secondary mb-1">
          {t("doctors.specialty")}
        </label>
        <select
          className="form-select form-select-sm"
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
        >
          <option value="all">{t("doctors.all_specialties")}</option>
          {specialties.map((s) => (
            <option key={s.id} value={s.name}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* City */}
      <div>
        <label className="form-label fw-semibold small text-uppercase text-secondary mb-1">
          {t("doctors.city")}
        </label>
        <select
          className="form-select form-select-sm"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="all">{t("doctors.all_cities")}</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Available Day */}
      <div>
        <label className="form-label fw-semibold small text-uppercase text-secondary mb-1">
          {t("doctors.available_on")}
        </label>
        <div className="d-flex flex-column gap-1">
          <div className="form-check">
            <input
              className="form-check-input" type="radio" name="day"
              id="day-all" value="all"
              checked={selectedDay === "all"}
              onChange={(e) => setSelectedDay(e.target.value)}
            />
            <label className="form-check-label small" htmlFor="day-all">{t("doctors.any_day")}</label>
          </div>
          {dayNamesT.map((day, index) => (
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
      {/* Hero / Search */}
      <section className="py-5 bg-body-secondary border-bottom">
        <div className="container">
          <FadeIn delay={0}>
            <h1 className="h3 fw-bold mb-1">{t("doctors.title")}</h1>
            <p className="text-secondary mb-4 small">{t("doctors.subtitle")}</p>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="row g-2">
              <div className="col-12 col-sm-8 col-lg-6">
                <div className="input-group">
                  <span className="input-group-text bg-body border-end-0">
                    <Search size={15} className="text-secondary" />
                  </span>
                  <input
                    className="form-control border-start-0 ps-0"
                    placeholder={t("doctors.search_placeholder")}
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
                  {showSidebar ? t("doctors.hide_filters") : t("doctors.show_filters")}
                  {hasActiveFilters && <span className="badge text-bg-primary">{t("common.active")}</span>}
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Main */}
      <section className="py-4">
        <div className="container">
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="row g-4">

            {/* Mobile Sidebar */}
            {showSidebar && (
              <div className="col-12 d-sm-none">
                <FadeIn direction="down">
                  <div className="card border-0 shadow-sm p-3">
                    <SidebarContent />
                  </div>
                </FadeIn>
              </div>
            )}

            {/* Desktop Sidebar */}
            <div className="col-sm-3 d-none d-sm-block">
              <FadeIn direction="right">
                <div className="card border-0 shadow-sm p-3 sticky-top" style={{ top: 80 }}>
                  <SidebarContent />
                </div>
              </FadeIn>
            </div>

            {/* Doctors Grid */}
            <div className="col-12 col-sm-9">
              <FadeIn delay={150}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <p className="text-secondary small mb-0">
                    {t("doctors.showing")} <strong>{filtered.length}</strong> {t("doctors.doctor", { count: filtered.length })}
                    {hasActiveFilters && (
                      <button className="btn btn-link btn-sm text-danger p-0 ms-2" onClick={resetFilters}>
                        {t("doctors.clear_filters")}
                      </button>
                    )}
                  </p>
                </div>
              </FadeIn>

              {loading ? (
                <Spinner text={t("common.loading")} />
              ) : filtered.length === 0 ? (
                <FadeIn>
                  <EmptyState
                    icon={Stethoscope}
                    title={t("doctors.no_doctors")}
                    desc={t("doctors.no_doctors_desc")}
                  />
                </FadeIn>
              ) : (
                <div className="row g-4">
                  {filtered.map((doc, i) => {
                    const profile = doc.doctor_profile;
                    return (
                      <div className="col-12 col-md-6 col-lg-4" key={doc.id}>
                        <FadeIn delay={i * 60} direction="up">
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
                                  <h6 className="mb-1 fw-bold text-body text-truncate">
                                    {t("doctors.dr")} {doc.name}
                                  </h6>
                                  <span className="badge text-bg-primary" style={{ fontSize: "0.7rem" }}>
                                    {profile?.specialty || t("doctors.general")}
                                  </span>
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
                                {profile?.bio || t("doctors.no_bio")}
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
                                    <Building size={12} className="text-primary" /> {profile.clinic_name}
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
                                      className="badge text-bg-success"
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
                                  {t("doctors.view_profile")}
                                </Link>
                              </div>

                            </div>
                          </div>
                        </FadeIn>
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