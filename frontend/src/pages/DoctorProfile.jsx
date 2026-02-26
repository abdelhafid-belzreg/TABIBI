import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Stethoscope, DollarSign, Award, Clock,
  Calendar, MapPin, Phone, Building, FileText,
  ChevronLeft,
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner }    from "@/components/ui/spinner";
import { Badge }      from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

const dayColors = {
  0: "danger",
  1: "primary",
  2: "primary",
  3: "primary",
  4: "primary",
  5: "primary",
  6: "danger",
};

export default function DoctorProfile() {
  const { t } = useTranslation();
  const { id }           = useParams();
  const { user }         = useAuth();
  const role             = user?.role;
  const [doctor, setDoctor]             = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");

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
    const fetchDoctor = async () => {
      try {
        const [doctorRes, availabilityRes] = await Promise.all([
          api.get(`/doctors/${id}`),
          api.get(`/doctors/${id}/availability`),
        ]);
        setDoctor(doctorRes.data);
        setAvailability(availabilityRes.data);
      } catch {
        setError(t("doctor_profile.not_found"));
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id, t]);

  if (loading) return <Spinner text={t("doctor_profile.loading")} />;

  if (error || !doctor) {
    return (
      <EmptyState
        icon={Stethoscope}
        title={t("doctor_profile.not_found")}
        desc={error || t("doctor_profile.not_exist")}
      />
    );
  }

  const profile = doctor.doctor_profile;

  const grouped = dayNamesT.reduce((acc, _, i) => {
    const daySlots = availability.filter((a) => a.day_of_week === i);
    if (daySlots.length > 0) acc[i] = daySlots;
    return acc;
  }, {});

  return (
    <div className="bg-body py-4">
      <div className="container" style={{ maxWidth: 780 }}>

        {/* Back */}
        <Link
          to="/doctors"
          className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 mb-3"
        >
          <ChevronLeft size={15} /> {t("doctor_profile.back")}
        </Link>

        {/* Header Card */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="d-flex flex-column flex-sm-row gap-4 align-items-start">

              {/* Avatar */}
              <div
                className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: 100, height: 100 }}
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={doctor.name}
                    className="rounded-circle"
                    style={{ width: 100, height: 100, objectFit: "cover" }}
                  />
                ) : (
                  <Stethoscope className="text-primary" size={42} />
                )}
              </div>

              {/* Info */}
              <div className="flex-fill">
                <div className="d-flex align-items-start justify-content-between flex-wrap gap-2">
                  <div>
                    <h1 className="h4 fw-bold mb-1">{t("doctors.dr")} {doctor.name}</h1>
                    <Badge variant="primary" className="mb-2">
                      {profile?.specialty || t("doctors.general")}
                    </Badge>
                  </div>
                </div>

                {/* Meta info */}
                <div className="d-flex flex-wrap gap-3 text-secondary small mt-2">
                  {profile?.consultation_fee && (
                    <span className="d-flex align-items-center gap-1">
                      <DollarSign size={14} className="text-success" />
                      <span className="text-success fw-medium">{profile.consultation_fee} MAD</span>
                      <span>{t("doctor_profile.per_visit")}</span>
                    </span>
                  )}
                  {doctor.phone && (
                    <span className="d-flex align-items-center gap-1">
                      <Phone size={14} /> {doctor.phone}
                    </span>
                  )}
                  {profile?.city && (
                    <span className="d-flex align-items-center gap-1">
                      <MapPin size={14} /> {profile.city}
                    </span>
                  )}
                  {profile?.clinic_name && (
                    <span className="d-flex align-items-center gap-1">
                      <Building size={14} /> {profile.clinic_name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-7">

            {/* About */}
            {profile?.bio && (
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-body-secondary py-2 d-flex align-items-center gap-2">
                  <FileText size={14} className="text-secondary" />
                  <strong className="small text-uppercase text-secondary">{t("doctor_profile.about")}</strong>
                </div>
                <div className="card-body">
                  <p className="text-secondary mb-0">{profile.bio}</p>
                </div>
              </div>
            )}

            {/* Qualifications */}
            {profile?.qualifications && (
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-body-secondary py-2 d-flex align-items-center gap-2">
                  <Award size={14} className="text-secondary" />
                  <strong className="small text-uppercase text-secondary">{t("doctor_profile.qualifications")}</strong>
                </div>
                <div className="card-body">
                  <p className="text-secondary mb-0">{profile.qualifications}</p>
                </div>
              </div>
            )}

            {/* Location */}
            {profile?.location && (
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-body-secondary py-2 d-flex align-items-center gap-2">
                  <MapPin size={14} className="text-secondary" />
                  <strong className="small text-uppercase text-secondary">{t("doctor_profile.location")}</strong>
                </div>
                <div className="card-body">
                  <p className="text-secondary mb-0">{profile.location}</p>
                </div>
              </div>
            )}

          </div>

          <div className="col-lg-5">

            {/* Availability */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-body-secondary py-2 d-flex align-items-center gap-2">
                <Clock size={14} className="text-secondary" />
                <strong className="small text-uppercase text-secondary">{t("doctor_profile.availability")}</strong>
                {availability.length > 0 && (
                  <Badge variant="primary" className="ms-auto">
                    {availability.length} slot{availability.length > 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
              <div className="card-body p-0">
                {availability.length === 0 ? (
                  <EmptyState
                    icon={Clock}
                    title="No Availability"
                    desc="This doctor has not set any schedule yet."
                  />
                ) : (
                  <div className="d-flex flex-column">
                    {Object.entries(grouped).map(([dayIndex, daySlots], i) => (
                      <div
                        key={dayIndex}
                        className={`p-3 ${i !== 0 ? "border-top" : ""}`}
                      >
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <span className={`badge text-bg-${dayColors[dayIndex] ?? "secondary"}`}>
                            {dayNamesT[dayIndex]}
                          </span>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                          {daySlots
                            .sort((a, b) => a.start_time.localeCompare(b.start_time))
                            .map((slot) => (
                              <span
                                key={slot.id}
                                className="badge bg-body border text-secondary d-flex align-items-center gap-1 fw-normal px-2 py-1"
                              >
                                <Clock size={11} />
                                {slot.start_time.slice(0, 5)} — {slot.end_time.slice(0, 5)}
                              </span>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Book Button */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 text-center">
                {profile?.consultation_fee && (
                  <div className="mb-3">
                    <div className="text-secondary small mb-1">{t("doctor_profile.consultation_fee")}</div>
                    <div className="h3 fw-bold text-success mb-0">
                      {profile.consultation_fee} MAD
                    </div>
                  </div>
                )}

                {user && role === "patient" ? (
                  <Link
                    to={`/patient/book/${doctor.id}`}
                    className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                  >
                    <Calendar size={18} /> {t("doctor_profile.book_appointment")}
                  </Link>
                ) : !user ? (
                  <Link
                    to="/login"
                    className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                  >
                    <Calendar size={18} /> {t("doctor_profile.sign_in_to_book")}
                  </Link>
                ) : null}

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}