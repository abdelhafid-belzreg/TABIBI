import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Calendar, User, Clock, LogOut, Menu, X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/doctor/dashboard",    icon: LayoutDashboard, label: "Dashboard"    },
  { to: "/doctor/appointments", icon: Calendar,        label: "Appointments" },
  { to: "/doctor/availability", icon: Clock,           label: "Availability" },
  { to: "/doctor/profile/edit", icon: User,            label: "Profile"      },
];

export default function DoctorLayout() {
  const { user, logout } = useAuth();
  const navigate          = useNavigate();
  const [open, setOpen]   = useState(false);

  const handleSignOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>

      {/* ── Sidebar ── */}
      <div
        className="d-flex flex-column bg-body-secondary border-end"
        style={{
          width:      open ? 240 : 64,
          minHeight:  "100vh",
          position:   "sticky",
          top:        0,
          transition: "width 0.25s ease",
          overflow:   "hidden",
          flexShrink: 0,
        }}
      >

        {/* Toggle */}
        <div className="p-2 border-bottom d-flex justify-content-end">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setOpen(!open)}
            title={open ? "Collapse" : "Expand"}
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Doctor Info */}
        {open && (
          <div className="p-3 border-bottom text-center">
            <div
              className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-2"
              style={{ width: 48, height: 48 }}
            >
              <User size={22} className="text-primary" />
            </div>
            <div className="fw-semibold small text-truncate">Dr. {user?.name}</div>
            <div className="text-secondary" style={{ fontSize: "0.7rem" }}>Doctor</div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-grow-1 py-3">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              title={!open ? label : undefined}
              className={({ isActive }) =>
                `d-flex align-items-center gap-2 px-3 py-2 mx-2 mb-1 rounded text-decoration-none small fw-medium ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-body-secondary hover-light"
                }`
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              {open && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Sign Out */}
        <div className="p-2 border-top">
          <button
            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-2 w-100"
            onClick={handleSignOut}
            title={!open ? "Sign Out" : undefined}
          >
            <LogOut size={16} className="flex-shrink-0" />
            {open && <span>Sign Out</span>}
          </button>
        </div>

      </div>

      {/* ── Main Content ── */}
      <div className="flex-grow-1 p-4" style={{ minWidth: 0 }}>
        <Outlet />
      </div>

    </div>
  );
}
