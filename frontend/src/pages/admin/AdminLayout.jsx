import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Users, UserCheck, Stethoscope,
  LogOut, Menu, X
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/admin/dashboard",          icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/users",              icon: Users,           label: "User Management" },
  { to: "/admin/doctors/validation", icon: UserCheck,       label: "Doctor Validation" },
  { to: "/admin/specialties",        icon: Stethoscope,     label: "Specialties" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth(); // ✅ logout not signOut
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await logout();        // ✅ was signOut()
    navigate("/login");    // ✅ was navigate("/")
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        className="d-flex flex-column bg-body-secondary border-end"
        style={{
          width: sidebarOpen ? "240px" : "60px",
          transition: "width 0.3s",
          minHeight: "100vh",
          position: "sticky",
          top: 0,
        }}
      >
        {/* Toggle Button */}
        <div className="p-2 border-bottom d-flex justify-content-end">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Admin Info */}
        {sidebarOpen && (
          <div className="p-3 border-bottom text-center">
            <div
              className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-2"
              style={{ width: 48, height: 48 }}
            >
              <Users size={22} className="text-primary" />
            </div>
            {/* ✅ user.name from AuthContext */}
            <div className="fw-semibold small">{user?.name}</div>
            <div className="text-secondary" style={{ fontSize: "0.75rem" }}>Admin</div>
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex-grow-1 py-3">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `d-flex align-items-center gap-2 px-3 py-2 text-decoration-none rounded mx-2 mb-1 ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-body-secondary hover-bg"
                }`
              }
              title={!sidebarOpen ? label : ""}
            >
              <Icon size={18} className="flex-shrink-0" />
              {sidebarOpen && <span className="small fw-medium">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Sign Out */}
        <div className="p-2 border-top">
          <button
            className="btn btn-sm btn-danger d-flex align-items-center gap-2 w-100"
            onClick={handleSignOut}
          >
            <LogOut size={16} />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <Outlet />
      </div>
    </div>
  );
}