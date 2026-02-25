import { useEffect, useState } from "react";
import { Trash2, Search, Eye, X, User, Mail, Phone, Calendar, CreditCard } from "lucide-react";
import api from "@/lib/api";

const roleColors = {
  admin:   "text-bg-danger",
  doctor:  "text-bg-primary",
  patient: "text-bg-success",
};

export default function UserManagement() {
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [search, setSearch]         = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selected, setSelected]     = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      setError("Failed to delete user.");
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div>
      <h1 className="fw-bold mb-4">User Management</h1>

      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      {/* Search + Filter */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <div className="position-relative" style={{ maxWidth: 280 }}>
          <Search size={16} className="position-absolute top-50 translate-middle-y ms-2 text-secondary" />
          <input
            type="text"
            className="form-control ps-4"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Role Filter Buttons */}
        <div className="d-flex gap-1">
          {["all", "admin", "doctor", "patient"].map((r) => (
            <button
              key={r}
              className={`btn btn-sm ${roleFilter === r ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => setRoleFilter(r)}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
              <span className="ms-1 badge bg-white text-dark">
                {r === "all" ? users.length : users.filter((u) => u.role === r).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="text-secondary mt-3">Loading users...</p>
        </div>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-secondary py-4">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td className="fw-medium">{u.name}</td>
                      <td className="text-secondary">{u.email}</td>
                      <td>
                        <span className={`badge ${roleColors[u.role] ?? "text-bg-secondary"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="text-secondary small">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                            onClick={() => setSelected(u)}
                          >
                            <Eye size={14} /> View
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                            onClick={() => deleteUser(u.id)}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {selected && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setSelected(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">

              {/* Header */}
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">User Profile</h5>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setSelected(null)}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="modal-body">

                {/* Avatar */}
                <div className="text-center mb-4">
                  <div
                    className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-2"
                    style={{ width: 72, height: 72 }}
                  >
                    <User size={32} className="text-primary" />
                  </div>
                  <div className="fw-bold fs-5">{selected.name}</div>
                  <div className="mt-1">
                    <span className={`badge ${roleColors[selected.role] ?? "text-bg-secondary"}`}>
                      {selected.role}
                    </span>
                  </div>
                </div>

                {/* Account Info */}
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex align-items-center gap-2 small">
                    <Mail size={14} className="text-secondary flex-shrink-0" />
                    <span>{selected.email}</span>
                  </li>
                  {selected.phone && (
                    <li className="list-group-item d-flex align-items-center gap-2 small">
                      <Phone size={14} className="text-secondary flex-shrink-0" />
                      <span>{selected.phone}</span>
                    </li>
                  )}
                  {selected.cin && (
                    <li className="list-group-item d-flex align-items-center gap-2 small">
                      {/* ✅ CreditCard icon instead of 🪪 emoji */}
                      <CreditCard size={14} className="text-secondary flex-shrink-0" />
                      <span><strong>CIN:</strong> {selected.cin}</span>
                    </li>
                  )}
                  <li className="list-group-item d-flex align-items-center gap-2 small">
                    <Calendar size={14} className="text-secondary flex-shrink-0" />
                    <span>Joined {new Date(selected.created_at).toLocaleDateString()}</span>
                  </li>
                </ul>

              </div>

              {/* Footer */}
              <div className="modal-footer border-0 pt-0">
                <button
                  className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                  onClick={() => deleteUser(selected.id)}
                >
                  <Trash2 size={14} /> Delete User
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelected(null)}
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}