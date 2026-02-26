import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Stethoscope, Search, CalendarCheck, Shield, Heart, Brain,
  Eye, Smile, Baby, Bone, ScanLine, UserCheck, ArrowRight,
} from "lucide-react";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import "../assets/css/custom.css";

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value === 0) return;
    let start = 0;
    const step  = Math.ceil(value / 50);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(start);
    }, 30);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display.toLocaleString()}</>;
}

function useFadeIn(threshold = 0.15) {
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

function FadeIn({ children, delay = 0, direction = "up", className = "" }) {
  const [ref, visible] = useFadeIn();
  const translate = direction === "up" ? "translateY(40px)" : direction === "down" ? "translateY(-40px)" : direction === "left" ? "translateX(40px)" : "translateX(-40px)";
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translate(0)" : translate, transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const [stats,        setStats]        = useState({ total_patients: 0, total_appointments: 0, total_doctors: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  const specialties = [
    { name: t("home.step1_title"), icon: Stethoscope },
    { name: "Cardiology",         icon: Heart        },
    { name: "Dermatology",        icon: ScanLine     },
    { name: "Neurology",          icon: Brain        },
    { name: "Ophthalmology",      icon: Eye          },
    { name: "Dentistry",          icon: Smile        },
    { name: "Pediatrics",         icon: Baby         },
    { name: "Orthopedics",        icon: Bone         },
  ];

  const steps = [
    { icon: Search,        title: t("home.step1_title"), desc: t("home.step1_desc") },
    { icon: CalendarCheck, title: t("home.step2_title"), desc: t("home.step2_desc") },
    { icon: UserCheck,     title: t("home.step3_title"), desc: t("home.step3_desc") },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/stats");
        setStats(res.data);
      } catch { }
      finally { setStatsLoading(false); }
    };
    fetchStats();
  }, []);

  const statItems = [
    { value: stats.total_patients,     icon: Heart,         label: t("home.satisfied_patients"),      color: "danger"  },
    { value: stats.total_appointments, icon: CalendarCheck, label: t("home.successful_appointments"), color: "success" },
    { value: stats.total_doctors,      icon: UserCheck,     label: t("home.top_doctors"),             color: "primary" },
  ];

  return (
    <div className="p-0 m-0">

      {/* Hero */}
      <section className="py-5">
        <div className="container">
          <div className="text-center">

            <FadeIn delay={0}>
              <div className="mb-3">
                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1">
                  <Shield size={13} />
                  {t("home.trusted_by")}{" "}
                  {statsLoading ? "..." : <strong>{stats.total_patients.toLocaleString()}+</strong>}{" "}
                  {t("home.patients")}
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={100}>
              <h1 className="display-4 fw-bold mb-3 lh-sm">
                {t("home.hero_title")}{" "}
                <span className="text-primary">{t("home.hero_title_highlight")}</span>
              </h1>
            </FadeIn>

            <FadeIn delay={200}>
              <p className="lead text-secondary mb-4 mx-auto" style={{ maxWidth: 600 }}>
                {t("home.hero_subtitle")}
              </p>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center mb-4">
                <Link to="/doctors" className="btn btn-primary btn-lg d-flex align-items-center gap-2 justify-content-center">
                  {t("home.find_doctor")} <ArrowRight size={18} />
                </Link>
                <Link to="/signup" className="btn btn-outline-primary btn-lg">
                  {t("home.join_doctor")}
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={400}>
              <div className="d-flex gap-4 justify-content-center flex-wrap">
                {statItems.map((s) => (
                  <div key={s.label} className="text-center">
                    <div className={`fw-bold text-${s.color} fs-5`}>
                      {statsLoading ? "..." : <><AnimatedNumber value={s.value} />+</>}
                    </div>
                    <div className="text-secondary" style={{ fontSize: "0.75rem" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="py-5">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-4">
              <h2 className="fw-bold mb-2">
                {t("home.specialties_title")}{" "}
                <span className="text-primary">{t("home.specialties_title_highlight")}</span>
              </h2>
              <p className="text-secondary">{t("home.specialties_subtitle")}</p>
            </div>
          </FadeIn>

          <div className="row row-cols-2 row-cols-sm-4 g-3">
            {specialties.map((s, i) => (
              <div className="col" key={s.name}>
                <FadeIn delay={i * 60} direction="up">
                  <Link to="/doctors" className="text-decoration-none">
                    <div className="card h-100 text-center shadow-sm border-0 card-hover bg-body-secondary">
                      <div className="card-body d-flex flex-column align-items-center py-4">
                        <div className="rounded-circle bg-primary bg-opacity-10 p-3 mb-3">
                          <s.icon className="text-primary" size={26} />
                        </div>
                        <span className="fw-medium small">{s.name}</span>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              </div>
            ))}
          </div>

          <FadeIn delay={200}>
            <div className="text-center mt-4">
              <Link to="/doctors" className="btn btn-outline-primary d-inline-flex align-items-center gap-1">
                {t("home.view_all")} <ArrowRight size={15} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-5">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-4">
              <h2 className="fw-bold mb-2">
                {t("home.how_title")}{" "}
                <span className="text-primary">{t("home.how_title_highlight")}</span>
              </h2>
              <p className="text-secondary">{t("home.how_subtitle")}</p>
            </div>
          </FadeIn>

          <div className="row row-cols-1 row-cols-sm-3 g-4">
            {steps.map((step, i) => (
              <div className="col" key={step.title}>
                <FadeIn delay={i * 150} direction="up">
                  <div className="card h-100 text-center border-0 shadow-sm bg-body-secondary card-hover">
                    <div className="card-body py-4">
                      <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white mb-3" style={{ width: 32, height: 32, fontSize: "0.85rem", fontWeight: 700 }}>
                        {i + 1}
                      </div>
                      <div className="rounded-circle bg-primary bg-opacity-10 p-3 mb-3 mx-auto" style={{ width: "fit-content" }}>
                        <step.icon className="text-primary" size={26} />
                      </div>
                      <h5 className="fw-semibold mb-2">{step.title}</h5>
                      <p className="text-secondary small mb-0">{step.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4 text-center">
            {statItems.map((s, i) => (
              <div className="col-12 col-sm-4" key={s.label}>
                <FadeIn delay={i * 150} direction="up">
                  <div className="card border-0 shadow-sm bg-body-secondary h-100 card-hover">
                    <div className="card-body py-4">
                      <div className={`rounded-circle bg-${s.color} bg-opacity-10 d-inline-flex p-3 mb-3`}>
                        <s.icon className={`text-${s.color}`} size={28} />
                      </div>
                      <div className={`display-5 fw-bold text-${s.color} mb-1`}>
                        {statsLoading
                          ? <Skeleton width={80} height={40} className="mx-auto" />
                          : <><AnimatedNumber value={s.value} />+</>}
                      </div>
                      <h5 className="fw-semibold mb-0">{s.label}</h5>
                    </div>
                  </div>
                </FadeIn>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5">
        <div className="container">
          <FadeIn direction="up">
            <div className="card border-0 shadow-sm bg-primary text-white text-center p-5">
              <div className="mb-2"><Shield size={36} className="opacity-75" /></div>
              <h2 className="fw-bold mb-3">{t("home.cta_title")}</h2>
              <p className="mb-4 opacity-75 lead">{t("home.cta_subtitle")}</p>
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                <Link to="/signup" className="btn btn-light btn-lg fw-semibold">{t("home.join_tabibi")}</Link>
                <Link to="/doctors" className="btn btn-outline-light btn-lg">{t("home.find_doctor")}</Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}