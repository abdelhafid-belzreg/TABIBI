import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../assets/css/custom.css";
import {
  Stethoscope, Search, CalendarCheck, Shield, Heart, Brain,
  Eye, Smile, Baby, Bone, ScanLine, UserCheck, ArrowRight, Star,
} from "lucide-react";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge }    from "@/components/ui/badge";

const specialties = [
  { name: "General Medicine", icon: Stethoscope },
  { name: "Cardiology",       icon: Heart       },
  { name: "Dermatology",      icon: ScanLine    },
  { name: "Neurology",        icon: Brain       },
  { name: "Ophthalmology",    icon: Eye         },
  { name: "Dentistry",        icon: Smile       },
  { name: "Pediatrics",       icon: Baby        },
  { name: "Orthopedics",      icon: Bone        },
];

const steps = [
  { icon: Search,        title: "Search Doctors",   desc: "Find specialists by name, specialty, or availability" },
  { icon: CalendarCheck, title: "Book Appointment", desc: "Choose a convenient time slot and confirm your booking" },
  { icon: UserCheck,     title: "Get Treated",      desc: "Visit your doctor at the scheduled time" },
];

// ✅ Animated counter
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === 0) return;
    let start = 0;
    const step = Math.ceil(value / 50);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(start);
    }, 30);
    return () => clearInterval(timer);
  }, [value]);

  return <>{display.toLocaleString()}</>;
}

export default function Home() {
  const [stats, setStats]       = useState({ total_patients: 0, total_appointments: 0, total_doctors: 0 });
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

  const statItems = [
    { value: stats.total_patients,     icon: Heart,        label: "Satisfied Patients",        color: "danger"  },
    { value: stats.total_appointments, icon: CalendarCheck, label: "Successful Appointments",  color: "success" },
    { value: stats.total_doctors,      icon: UserCheck,    label: "Top Doctors",               color: "primary" },
  ];

  return (
    <div className="p-0 m-0">

      {/* ── Hero ── */}
      <section className="py-5">
        <div className="container">
          <div className="text-center">

            {/* Trust badge */}
            <div className="mb-3">
              <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1">
                <Shield size={13} />
                Trusted by{" "}
                {statsLoading
                  ? "..."
                  : <strong>{stats.total_patients.toLocaleString()}+</strong>}{" "}
                patients
              </span>
            </div>

            <h1 className="display-4 fw-bold mb-3 lh-sm">
              Your Health,{" "}
              <span className="text-primary">Our Priority</span>
            </h1>
            <p className="lead text-secondary mb-4 mx-auto" style={{ maxWidth: 600 }}>
              Book appointments with top-rated doctors instantly. TABIBI connects you
              with qualified healthcare professionals for a seamless medical experience.
            </p>

            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center mb-4">
              <Link to="/doctors" className="btn btn-primary btn-lg d-flex align-items-center gap-2 justify-content-center">
                Find a Doctor <ArrowRight size={18} />
              </Link>
              <Link to="/signup" className="btn btn-outline-primary btn-lg">
                Join as Doctor
              </Link>
            </div>

            {/* Mini stats */}
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

          </div>
        </div>
      </section>

      {/* ── Specialties ── */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-2">
              Browse by <span className="text-primary">Specialty</span>
            </h2>
            <p className="text-secondary">Find the right specialist for your needs</p>
          </div>
          <div className="row row-cols-2 row-cols-sm-4 g-3">
            {specialties.map((s) => (
              <div className="col" key={s.name}>
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
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/doctors" className="btn btn-outline-primary d-inline-flex align-items-center gap-1">
              View All Specialties <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-2">
              How It <span className="text-primary">Works</span>
            </h2>
            <p className="text-secondary">Book your appointment in 3 simple steps</p>
          </div>
          <div className="row row-cols-1 row-cols-sm-3 g-4">
            {steps.map((step, i) => (
              <div className="col" key={step.title}>
                <div className="card h-100 text-center border-0 shadow-sm bg-body-secondary card-hover">
                  <div className="card-body py-4 position-relative overflow-hidden">
                    {/* Step badge */}
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white mb-3"
                      style={{ width: 32, height: 32, fontSize: "0.85rem", fontWeight: 700 }}>
                      {i + 1}
                    </div>
                    <div className="rounded-circle bg-primary bg-opacity-10 p-3 mb-3 mx-auto" style={{ width: "fit-content" }}>
                      <step.icon className="text-primary" size={26} />
                    </div>
                    <h5 className="fw-semibold mb-2">{step.title}</h5>
                    <p className="text-secondary small mb-0">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dynamic Stats ── */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4 text-center">
            {statItems.map((s) => (
              <div className="col-12 col-sm-4" key={s.label}>
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-5">
        <div className="container">
          <div className="card border-0 shadow-sm bg-primary text-white text-center p-5">
            <div className="mb-2">
              <Shield size={36} className="opacity-75" />
            </div>
            <h2 className="fw-bold mb-3">
              Ready to Take Control of Your Health?
            </h2>
            <p className="mb-4 opacity-75 lead">
              Join TABIBI today and connect with the best healthcare professionals.
            </p>
            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
              <Link to="/signup" className="btn btn-light btn-lg">
                Join TABIBI
              </Link>
              <Link to="/doctors" className="btn btn-outline-light btn-lg">
                Find a Doctor
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}