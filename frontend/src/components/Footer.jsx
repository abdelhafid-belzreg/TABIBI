import { Link } from "react-router-dom";
import { Stethoscope, Mail, Phone, MapPin, Heart, ArrowRight } from "lucide-react";

const quickLinks = [
  { to: "/",        label: "Home"         },
  { to: "/doctors", label: "Find Doctors" },
  { to: "/about",   label: "About Us"     },
  { to: "/contact", label: "Contact"      },
];

const patientLinks = [
  { to: "/signup",  label: "Create Account" },
  { to: "/doctors", label: "Search Doctors" },
  { to: "/login",   label: "Sign In"        },
];

const contactItems = [
  { icon: Mail,   value: "contact@tabibi.com",               href: "mailto:contact@tabibi.com" },
  { icon: Phone,  value: "+212 7 7777 7777",                 href: "tel:+212777777777"          },
  { icon: MapPin, value: "Salé, Rabat-Salé-Kénitra, Maroc",  href: null                         },
];

export default function Footer() {
  return (
    <footer className="border-top bg-body-secondary">

      <div className="container py-5">
        <div className="row gy-4">

          {/* ── Brand ── */}
          <div className="col-12 col-md-5">
            <Link
              to="/"
              className="d-inline-flex align-items-center gap-2 fw-bold fs-5 text-primary text-decoration-none mb-3"
            >
              <Stethoscope size={22} />
              TABIBI
            </Link>
            <p className="text-secondary small mb-3">
              Your trusted online medical appointment platform. Connecting
              patients with qualified doctors seamlessly.
            </p>
            <div className="d-flex flex-column gap-2">
              {contactItems.map((item) => (
                <span key={item.value} className="d-flex align-items-center gap-2 small text-secondary">
                  <item.icon size={14} className="text-primary flex-shrink-0" />
                  {item.href ? (
                    <a href={item.href} className="text-secondary text-decoration-none">
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div className="col-6 col-md-3 offset-md-1">
            <h6 className="fw-bold mb-3 text-uppercase" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>
              Quick Links
            </h6>
            <div className="d-flex flex-column gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-secondary text-decoration-none d-inline-flex align-items-center gap-1 small"
                >
                  <ArrowRight size={12} className="text-primary" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── For Patients ── */}
          <div className="col-6 col-md-3">
            <h6 className="fw-bold mb-3 text-uppercase" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>
              For Patients
            </h6>
            <div className="d-flex flex-column gap-2">
              {patientLinks.map((link) => (
                <Link
                  key={link.to + link.label}
                  to={link.to}
                  className="text-secondary text-decoration-none d-inline-flex align-items-center gap-1 small"
                >
                  <ArrowRight size={12} className="text-primary" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-top py-3 bg-body-secondary">
        <div className="container d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2">
          <span className="text-secondary small">
            © {new Date().getFullYear()} TABIBI. All rights reserved.
          </span>
          <span className="text-secondary small d-flex align-items-center gap-1">
            Made with <Heart size={13} className="text-danger mx-1" fill="currentColor" /> in Morocco
          </span>
          <div className="d-flex gap-3">
            <Link to="/about"   className="text-secondary small text-decoration-none">Privacy</Link>
            <Link to="/about"   className="text-secondary small text-decoration-none">Terms</Link>
            <Link to="/contact" className="text-secondary small text-decoration-none">Support</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}