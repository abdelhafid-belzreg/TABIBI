import { useEffect, useState, useRef } from "react";
import { Heart, Shield, Users, Award, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const values = [
  { icon: Heart,  title: "Patient-Centered Care", desc: "Every decision we make revolves around improving the patient experience and health outcomes.",  color: "danger"  },
  { icon: Shield, title: "Trust & Security",       desc: "Your health data is encrypted and protected with industry-leading security standards.",         color: "primary" },
  { icon: Users,  title: "Accessibility",          desc: "We believe quality healthcare should be accessible to everyone, everywhere.",                   color: "success" },
  { icon: Award,  title: "Excellence",             desc: "We partner only with verified, qualified healthcare professionals.",                             color: "warning" },
];

const missions = [
  "Seamless & secure appointment booking",
  "Verified and qualified doctors only",
  "24/7 access to healthcare services",
  "Real-time availability & instant confirmation",
];

// ── Animated counter ──────────────────────────────────────
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

// ── Scroll-triggered fade-in hook ────────────────────────
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

// ── FadeIn wrapper ────────────────────────────────────────
function FadeIn({ children, delay = 0, direction = "up", className = "" }) {
  const [ref, visible] = useFadeIn();

  const translate = direction === "up"    ? "translateY(40px)"
                  : direction === "down"  ? "translateY(-40px)"
                  : direction === "left"  ? "translateX(40px)"
                  : direction === "right" ? "translateX(-40px)"
                  : "translateY(40px)";

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translate(0)" : translate,
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────
export default function About() {
  const [stats,        setStats]        = useState({ total_doctors: 0, total_patients: 0, total_specialties: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/stats");
        setStats(res.data);
      } catch { /* silently fail */ }
      finally { setStatsLoading(false); }
    };
    fetchStats();
  }, []);

  const statCards = [
    { val: stats.total_doctors,     label: "Doctors",     suffix: "+", color: "primary" },
    { val: stats.total_patients,    label: "Patients",    suffix: "+", color: "success" },
    { val: stats.total_specialties, label: "Specialties", suffix: "+", color: "info"    },
    { val: null,                    label: "Support",     text: "24/7", color: "warning" },
  ];

  return (
    <div className="bg-body">

      {/* Hero */}
      <section className="py-5">
        <div className="container text-center">

          <FadeIn delay={0}>
            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1 mb-3">
              <Shield size={13} /> About Us
            </span>
          </FadeIn>

          <FadeIn delay={100}>
            <h1 className="display-5 fw-bold mb-3">
              About <span className="text-primary">TABIBI</span>
            </h1>
          </FadeIn>

          <FadeIn delay={200}>
            <p className="lead text-secondary mx-auto mb-4" style={{ maxWidth: 650 }}>
              TABIBI is a modern online medical appointment platform that bridges
              the gap between patients and healthcare providers, making quality
              healthcare accessible with just a few clicks.
            </p>
          </FadeIn>

          <FadeIn delay={300}>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/doctors" className="btn btn-primary d-inline-flex align-items-center gap-1">
                Find a Doctor <ArrowRight size={15} />
              </Link>
              <Link to="/signup" className="btn btn-outline-primary">
                Join as Doctor
              </Link>
            </div>
          </FadeIn>

        </div>
      </section>

      {/* Mission + Stats */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center g-5 mb-5">

            {/* Mission text */}
            <div className="col-md-6">
              <FadeIn direction="right">
                <h2 className="fw-bold mb-3">
                  Our <span className="text-primary">Mission</span>
                </h2>
                <p className="text-secondary mb-3">
                  To revolutionize healthcare access by providing a seamless,
                  secure, and efficient platform for booking medical appointments.
                  We strive to connect patients with the right doctors at the right time.
                </p>
                <p className="text-secondary mb-4">
                  Founded with the belief that booking a doctor's appointment
                  should be as simple as ordering food online, TABIBI has grown
                  to serve thousands of patients and hundreds of healthcare providers.
                </p>
                <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                  {missions.map((m, i) => (
                    <FadeIn key={m} delay={i * 100} direction="right">
                      <li className="d-flex align-items-center gap-2 text-secondary small">
                        <CheckCircle size={16} className="text-success flex-shrink-0" />
                        {m}
                      </li>
                    </FadeIn>
                  ))}
                </ul>
              </FadeIn>
            </div>

            {/* Stats */}
            <div className="col-md-6">
              <div className="row g-3">
                {statCards.map((s, i) => (
                  <div className="col-6" key={s.label}>
                    <FadeIn delay={i * 100} direction="left">
                      <div className="card text-center shadow-sm border-0 bg-body-secondary h-100 card-hover">
                        <div className="card-body py-4">
                          <div className={`rounded-circle bg-${s.color} bg-opacity-10 d-inline-flex p-2 mb-2`}>
                            <div className={`rounded-circle bg-${s.color} bg-opacity-25`} style={{ width: 8, height: 8 }} />
                          </div>
                          <div className={`h3 fw-bold text-${s.color} mb-1`}>
                            {statsLoading
                              ? <Skeleton width={60} height={28} className="mx-auto" />
                              : s.text
                                ? s.text
                                : <><AnimatedNumber value={s.val} />{s.suffix}</>
                            }
                          </div>
                          <div className="small text-secondary fw-medium">{s.label}</div>
                        </div>
                      </div>
                    </FadeIn>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Values */}
          <FadeIn>
            <div className="text-center mb-4">
              <h2 className="fw-bold mb-2">
                Our <span className="text-primary">Values</span>
              </h2>
              <p className="text-secondary">What drives everything we do at TABIBI</p>
            </div>
          </FadeIn>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
            {values.map((v, i) => (
              <div className="col" key={v.title}>
                <FadeIn delay={i * 100} direction="up">
                  <div className="card h-100 text-center border-0 shadow-sm bg-body-secondary card-hover">
                    <div className="card-body d-flex flex-column align-items-center py-4">
                      <div className={`rounded-circle bg-${v.color} bg-opacity-10 p-3 mb-3`}>
                        <v.icon className={`text-${v.color}`} size={28} />
                      </div>
                      <h5 className="fw-bold mb-2">{v.title}</h5>
                      <p className="text-secondary small mb-0">{v.desc}</p>
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
              <Shield size={36} className="mx-auto mb-3 opacity-75" />
              <h2 className="fw-bold mb-3">Join Thousands of Happy Patients</h2>
              <p className="opacity-75 lead mb-4 mx-auto" style={{ maxWidth: 500 }}>
                Experience healthcare the modern way — fast, easy, and reliable.
              </p>
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                <Link to="/signup" className="btn btn-light btn-lg fw-semibold d-inline-flex align-items-center gap-2 justify-content-center">
                  Get Started <ArrowRight size={18} />
                </Link>
                <Link to="/doctors" className="btn btn-outline-light btn-lg">
                  Browse Doctors
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}