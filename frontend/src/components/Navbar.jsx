import "../assets/css/custom.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Stethoscope, Menu, X, LogOut,
  LayoutDashboard, Sun, Moon, ChevronDown, ArrowUp,
} from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { to: "/",        label: "Home"    },
  { to: "/doctors", label: "Doctors" },
  { to: "/about",   label: "About"   },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const { dark, toggleDark }   = useTheme();
  const navigate               = useNavigate();
  const location               = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen,   setDropOpen]   = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  // ── Show scroll-up button after 300px ──
  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleSignOut = async () => {
    await logout();
    navigate("/login");
    setMobileOpen(false);
  };

  const dashboardPath =
    role === "doctor" ? "/doctor/dashboard"  :
    role === "admin"  ? "/admin/dashboard"   :
                        "/patient/dashboard";

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      {/* ══════════════ NAVBAR ══════════════ */}
      <nav className="blurEffect navbar navbar-expand-lg sticky-top border-bottom">
        <div className="container">

          {/* ── Brand ── */}
          <Link
            to="/"
            className="navbar-brand d-flex align-items-center gap-2 fw-bold text-primary"
          >
            <Stethoscope size={22} />
            <span>TABIBI</span>
          </Link>

          {/* ── Mobile: dark toggle + hamburger ── */}
          <div className="d-flex align-items-center gap-2 ms-auto d-lg-none">
            <button
              className="btn btn-sm btn-outline-secondary d-flex align-items-center"
              onClick={toggleDark}
              title={dark ? "Light Mode" : "Dark Mode"}
            >
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              className="btn btn-sm btn-outline-primary d-flex align-items-center"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {/* ── Nav Links + Auth ── */}
          <div className={`collapse navbar-collapse${mobileOpen ? " show" : ""}`}>

            {/* Nav links */}
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 text-center gap-1">
              {navLinks.map((link) => (
                <li className="nav-item" key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`nav-link px-3 rounded ${
                      isActive(link.to)
                        ? "text-primary fw-semibold"
                        : "text-secondary"
                    }`}
                  >
                    {link.label}
                    {/* active dot */}
                    {isActive(link.to) && (
                      <span
                        className="d-none d-lg-inline-block bg-primary rounded-circle ms-1"
                        style={{ width: 5, height: 5, verticalAlign: "middle" }}
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Auth + Theme */}
            <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0 justify-content-center">

              {/* Dark toggle — desktop */}
              <button
                className="btn btn-sm btn-outline-secondary d-none d-lg-flex align-items-center"
                onClick={toggleDark}
                title={dark ? "Light Mode" : "Dark Mode"}
              >
                {dark ? <Sun size={15} /> : <Moon size={15} />}
              </button>

              {user ? (
                <div className="position-relative">
                  {/* User dropdown trigger */}
                  <button
                    className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                    onClick={() => setDropOpen(!dropOpen)}
                  >
                    <span
                      className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
                      style={{ width: 22, height: 22, fontSize: "0.7rem", fontWeight: 700 }}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                    <span className="d-none d-lg-inline">{user.name?.split(" ")[0]}</span>
                    <ChevronDown size={13} />
                  </button>

                  {/* Dropdown */}
                  {dropOpen && (
                    <div
                      className="position-absolute end-0 mt-1 bg-body border rounded shadow-sm py-1"
                      style={{ minWidth: 185, zIndex: 9999 }}
                      onMouseLeave={() => setDropOpen(false)}
                    >
                      {/* User info */}
                      <div className="px-3 py-2 border-bottom">
                        <div className="fw-semibold small">{user.name}</div>
                        <div className="text-secondary" style={{ fontSize: "0.75rem" }}>{user.email}</div>
                        <span
                          className={`badge mt-1 text-bg-${
                            role === "admin" ? "danger" : role === "doctor" ? "success" : "primary"
                          }`}
                          style={{ fontSize: "0.65rem" }}
                        >
                          {role}
                        </span>
                      </div>

                      {/* Dashboard */}
                      <button
                        className="dropdown-item d-flex align-items-center gap-2 small py-2"
                        onClick={() => { navigate(dashboardPath); setDropOpen(false); setMobileOpen(false); }}
                      >
                        <LayoutDashboard size={14} /> Dashboard
                      </button>

                      <hr className="dropdown-divider my-1" />

                      {/* Sign out */}
                      <button
                        className="dropdown-item d-flex align-items-center gap-2 small py-2 text-danger"
                        onClick={handleSignOut}
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="btn btn-sm btn-outline-primary"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="btn btn-sm btn-primary"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ══════════════ SCROLL TO TOP ══════════════ */}
      <button
        onClick={scrollToTop}
        title="Scroll to top"
        className="btn btn-primary d-flex align-items-center justify-content-center shadow"
        style={{
          position:     "fixed",
          bottom:       "1.5rem",
          right:        "1.5rem",
          width:        42,
          height:       42,
          borderRadius: "50%",
          zIndex:       9999,
          opacity:      showScroll ? 1 : 0,
          pointerEvents: showScroll ? "auto" : "none",
          transition:   "opacity 0.3s ease",
        }}
      >
        <ArrowUp size={18} />
      </button>
    </>
  );
}