import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import api from "@/lib/api";

export default function SpecialtyManagement() {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newSpecialty, setNewSpecialty] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const res = await api.get("/admin/specialties");
        setSpecialties(res.data);
      } catch (err) {
        setError("Failed to load specialties.");
      } finally {
        setLoading(false);
      }
    };
    fetchSpecialties();
  }, []);

  const addSpecialty = async (e) => {
    e.preventDefault();
    if (!newSpecialty.trim()) return;
    setAdding(true);
    try {
      const res = await api.post("/admin/specialties", { name: newSpecialty });
      setSpecialties((prev) => [...prev, res.data]);
      setNewSpecialty("");
    } catch (err) {
      setError("Failed to add specialty.");
    } finally {
      setAdding(false);
    }
  };

  const deleteSpecialty = async (id) => {
    if (!confirm("Delete this specialty?")) return;
    try {
      await api.delete(`/admin/specialties/${id}`);
      setSpecialties((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError("Failed to delete specialty.");
    }
  };

  return (
    <div>
      <h1 className="fw-bold mb-4">Specialty Management</h1>

      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      {/* Add Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="fw-semibold mb-3">Add New Specialty</h5>
          <form onSubmit={addSpecialty} className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Cardiology"
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              required
            />
            <button
              type="submit"
              className="btn btn-primary d-flex align-items-center gap-1"
              disabled={adding}
            >
              {adding ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                <Plus size={16} />
              )}
              Add
            </button>
          </form>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="text-secondary mt-3">Loading specialties...</p>
        </div>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Specialty Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {specialties.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center text-secondary py-4">
                      No specialties found.
                    </td>
                  </tr>
                ) : (
                  specialties.map((s) => (
                    <tr key={s.id}>
                      <td>{s.id}</td>
                      <td className="fw-medium">{s.name}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                          onClick={() => deleteSpecialty(s.id)}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}