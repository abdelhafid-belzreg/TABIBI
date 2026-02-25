import { useState, useEffect } from "react";
import { Trash2, Plus, Clock, CalendarDays } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const dayColors = {
  0: "text-bg-danger",
  1: "text-bg-primary",
  2: "text-bg-primary",
  3: "text-bg-primary",
  4: "text-bg-primary",
  5: "text-bg-primary",
  6: "text-bg-danger",
};

export default function DoctorAvailability() {
  const { user } = useAuth();
  const [slots,        setSlots]        = useState([]);
  const [newDay,       setNewDay]       = useState("1");
  const [newStart,     setNewStart]     = useState("09:00");
  const [newEnd,       setNewEnd]       = useState("17:00");
  const [loading,      setLoading]      = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [msg,          setMsg]          = useState(null); // { type, text }
  const [deletingId,   setDeletingId]   = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchSlots = async () => {
      try {
        const res = await api.get("/doctor/availability");
        setSlots(res.data);
      } catch {
        setMsg({ type: "danger", text: "Failed to load availability." });
      } finally {
        setFetchLoading(false);
      }
    };
    fetchSlots();
  }, [user]);

  const handleAdd = async () => {
    setMsg(null);
    if (newStart >= newEnd) {
      setMsg({ type: "danger", text: "End time must be after start time." });
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/doctor/availability", {
        day_of_week: parseInt(newDay),
        start_time:  newStart,
        end_time:    newEnd,
      });
      setSlots((prev) => [...prev, res.data]);
      setMsg({ type: "success", text: "Slot added successfully!" });
      setNewDay("1");
      setNewStart("09:00");
      setNewEnd("17:00");
    } catch (err) {
      setMsg({
        type: "danger",
        text: err.response?.data?.message || "Failed to add slot.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this availability slot?")) return;
    setMsg(null);
    setDeletingId(id);
    try {
      await api.delete(`/doctor/availability/${id}`);
      setSlots((prev) => prev.filter((s) => s.id !== id));
      setMsg({ type: "success", text: "Slot deleted successfully!" });
    } catch {
      setMsg({ type: "danger", text: "Failed to delete slot." });
    } finally {
      setDeletingId(null);
    }
  };

  if (fetchLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="text-secondary mt-3 small">Loading schedule...</p>
      </div>
    );
  }

  // Group slots by day (only days that have slots)
  const grouped = dayNames.reduce((acc, _, i) => {
    const daySlots = slots.filter((s) => s.day_of_week === i);
    if (daySlots.length > 0) acc[i] = daySlots;
    return acc;
  }, {});

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-9 col-xl-8">

          {/* ── Header ── */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <div
              className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: 56, height: 56 }}
            >
              <CalendarDays className="text-primary" size={26} />
            </div>
            <div>
              <h1 className="fw-bold mb-0 fs-4">Availability Schedule</h1>
              <p className="text-secondary small mb-0">Manage your weekly working hours</p>
            </div>
          </div>

          {/* ── Alert ── */}
          {msg && (
            <div className={`alert alert-${msg.type} py-2 small d-flex align-items-center gap-2`}>
              {msg.text}
              <button
                className="btn-close btn-sm ms-auto"
                style={{ fontSize: "0.65rem" }}
                onClick={() => setMsg(null)}
              />
            </div>
          )}

          {/* ── Add New Slot ── */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-body-secondary py-2 d-flex align-items-center gap-2">
              <Plus size={15} className="text-secondary" />
              <strong className="small text-uppercase text-secondary">Add New Slot</strong>
            </div>
            <div className="card-body">
              <div className="row g-3 align-items-end">

                <div className="col-sm-4">
                  <label className="form-label small d-flex align-items-center gap-1">
                    <CalendarDays size={13} /> Day
                  </label>
                  <select
                    className="form-select"
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value)}
                  >
                    {dayNames.map((name, i) => (
                      <option key={i} value={String(i)}>{name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-sm-4">
                  <label className="form-label small d-flex align-items-center gap-1">
                    <Clock size={13} /> Start Time
                  </label>
                  <input
                    type="time"
                    className="form-control"
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                  />
                </div>

                <div className="col-sm-4">
                  <label className="form-label small d-flex align-items-center gap-1">
                    <Clock size={13} /> End Time
                  </label>
                  <input
                    type="time"
                    className="form-control"
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                  />
                </div>

                <div className="col-12 d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-primary d-flex align-items-center gap-2"
                    onClick={handleAdd}
                    disabled={loading}
                  >
                    {loading
                      ? <><span className="spinner-border spinner-border-sm" /> Adding...</>
                      : <><Plus size={15} /> Add Slot</>}
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* ── Current Schedule ── */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-body-secondary py-2 d-flex align-items-center gap-2">
              <CalendarDays size={15} className="text-secondary" />
              <strong className="small text-uppercase text-secondary">Current Schedule</strong>
              {slots.length > 0 && (
                <span className="badge text-bg-primary ms-auto">
                  {slots.length} slot{slots.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div className="card-body p-0">
              {slots.length === 0 ? (
                <div className="text-center text-secondary py-5">
                  <CalendarDays size={36} className="mb-2 opacity-25" />
                  <p className="small mb-1">No availability slots set yet.</p>
                  <p className="small mb-0">Add your first slot above.</p>
                </div>
              ) : (
                <div className="d-flex flex-column">
                  {Object.entries(grouped).map(([dayIndex, daySlots], i) => (
                    <div
                      key={dayIndex}
                      className={`p-3 ${i !== 0 ? "border-top" : ""}`}
                    >
                      {/* Day Label */}
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className={`badge ${dayColors[dayIndex] ?? "text-bg-secondary"}`}>
                          {dayNames[dayIndex]}
                        </span>
                        <span className="text-secondary small">
                          {daySlots.length} slot{daySlots.length > 1 ? "s" : ""}
                        </span>
                      </div>

                      {/* Slots for this day */}
                      <div className="d-flex flex-wrap gap-2">
                        {daySlots
                          .sort((a, b) => a.start_time.localeCompare(b.start_time))
                          .map((slot) => (
                            <div
                              key={slot.id}
                              className="d-flex align-items-center gap-2 border rounded px-3 py-2 bg-body-secondary"
                            >
                              <Clock size={13} className="text-primary flex-shrink-0" />
                              <span className="small fw-medium">
                                {slot.start_time?.slice(0, 5)} — {slot.end_time?.slice(0, 5)}
                              </span>
                              <button
                                className="btn btn-link btn-sm text-danger p-0 ms-1 d-flex align-items-center"
                                onClick={() => handleDelete(slot.id)}
                                title="Delete slot"
                                disabled={deletingId === slot.id}
                              >
                                {deletingId === slot.id ? (
                                  <span className="spinner-border spinner-border-sm" />
                                ) : (
                                  <Trash2 size={14} />
                                )}
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}