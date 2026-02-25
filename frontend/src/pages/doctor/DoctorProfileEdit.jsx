import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import {
  UserCheck, User, Phone, MapPin, Building, Stethoscope,
  DollarSign, GraduationCap, FileText, Save, Mail,
  Lock, Eye, EyeOff, Trash2, ShieldCheck, ShieldAlert, ShieldX,
} from "lucide-react";

const getPasswordStrength = (password) => {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8)           score++;
  if (password.length >= 12)          score++;
  if (/[A-Z]/.test(password))         score++;
  if (/[0-9]/.test(password))         score++;
  if (/[^A-Za-z0-9]/.test(password))  score++;
  if (score <= 2) return { label: "Weak",   color: "danger",  icon: ShieldX,     bars: 1 };
  if (score <= 3) return { label: "Fair",   color: "warning", icon: ShieldAlert, bars: 2 };
  if (score <= 4) return { label: "Good",   color: "info",    icon: ShieldCheck, bars: 3 };
  return           { label: "Strong", color: "success", icon: ShieldCheck, bars: 4 };
};

export default function DoctorProfileEdit() {
  const { user, setUser, logout } = useAuth();
  const navigate                   = useNavigate();

  // ── Profile state ──
  const [fullName,       setFullName]       = useState("");
  const [phone,          setPhone]          = useState("");
  const [bio,            setBio]            = useState("");
  const [qualifications, setQualifications] = useState("");
  const [fee,            setFee]            = useState("");
  const [specialtyId,    setSpecialtyId]    = useState("");
  const [clinicName,     setClinicName]     = useState("");
  const [city,           setCity]           = useState("");
  const [location,       setLocation]       = useState("");
  const [specialties,    setSpecialties]    = useState([]);
  const [loading,        setLoading]        = useState(false);
  const [fetchLoading,   setFetchLoading]   = useState(true);
  const [profileMsg,     setProfileMsg]     = useState(null); // { type, text }

  // ── Password state ──
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent,     setShowCurrent]     = useState(false);
  const [showNew,         setShowNew]         = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [passLoading,     setPassLoading]     = useState(false);
  const [passMsg,         setPassMsg]         = useState(null); // { type, text }

  // ── Delete state ──
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword,  setDeletePassword]  = useState("");
  const [showDeletePass,  setShowDeletePass]  = useState(false);
  const [deleteLoading,   setDeleteLoading]   = useState(false);
  const [deleteError,     setDeleteError]     = useState("");

  const strength = getPasswordStrength(newPassword);

  // Load profile & specialties
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const [profileRes, specialtiesRes] = await Promise.all([
          api.get("/doctor/profile"),
          api.get("/specialties"),
        ]);
        const p = profileRes.data;
        setFullName(p.full_name          || "");
        setPhone(p.phone                 || "");
        setBio(p.bio                     || "");
        setQualifications(p.qualifications || "");
        setFee(p.consultation_fee        || "");
        setSpecialtyId(p.specialty_id    || "");
        setClinicName(p.clinic_name      || "");
        setCity(p.city                   || "");
        setLocation(p.location           || "");
        setSpecialties(specialtiesRes.data);
      } catch {
        setProfileMsg({ type: "danger", text: "Failed to load profile." });
      } finally {
        setFetchLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProfileMsg(null);
    try {
      await api.put("/doctor/profile", {
        full_name: fullName, phone, bio, qualifications,
        consultation_fee: fee, specialty_id: specialtyId,
        clinic_name: clinicName, city, location,
      });
      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
      setUser((prev) => ({ ...prev, name: fullName }));
    } catch (err) {
      const errors = err.response?.data?.errors;
      setProfileMsg({
        type: "danger",
        text: errors
          ? Object.values(errors)[0][0]
          : err.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassMsg(null);
    if (newPassword !== confirmPassword)
      return setPassMsg({ type: "danger", text: "New passwords do not match." });
    if (newPassword.length < 8)
      return setPassMsg({ type: "danger", text: "Password must be at least 8 characters." });
    if (strength?.label === "Weak")
      return setPassMsg({ type: "danger", text: "Password is too weak. Please choose a stronger password." });

    setPassLoading(true);
    try {
      await api.put("/doctor/password", {
        current_password:          currentPassword,
        new_password:              newPassword,
        new_password_confirmation: confirmPassword,
      });
      setPassMsg({ type: "success", text: "Password changed! Logging out..." });
      setTimeout(async () => {
        await logout();
        navigate("/login");
      }, 1500);
    } catch (err) {
      const errors = err.response?.data?.errors;
      setPassMsg({
        type: "danger",
        text: errors
          ? Object.values(errors)[0][0]
          : err.response?.data?.message || "Failed to change password.",
      });
    } finally {
      setPassLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteError("");
    setDeleteLoading(true);
    try {
      await api.delete("/doctor/account", { data: { password: deletePassword } });
      await logout();
      navigate("/");
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Failed to delete account.");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="text-secondary mt-3 small">Loading profile...</p>
      </div>
    );
  }

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
              <UserCheck className="text-primary" size={26} />
            </div>
            <div>
              <h1 className="fw-bold mb-0 fs-4">My Profile</h1>
              <p className="text-secondary small mb-0">Manage your professional information</p>
            </div>
          </div>

          {/* ── Account Info ── */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-body-secondary py-2">
              <strong className="small text-uppercase text-secondary">Account Information</strong>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-1 text-secondary small mb-1">
                    <User size={13} /> Name
                  </div>
                  <div className="fw-medium">{user?.name || "N/A"}</div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-1 text-secondary small mb-1">
                    <Mail size={13} /> Email
                  </div>
                  <div className="fw-medium">{user?.email || "N/A"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Personal Information ── */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-body-secondary py-2">
              <strong className="small text-uppercase text-secondary">Personal Information</strong>
            </div>
            <div className="card-body">
              {profileMsg && (
                <div className={`alert alert-${profileMsg.type} py-2 small`}>
                  {profileMsg.text}
                </div>
              )}
              <form onSubmit={handleSave}>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label small d-flex align-items-center gap-1">
                      <User size={13} /> Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Dr. Alice Smith"
                      required
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label small d-flex align-items-center gap-1">
                      <Phone size={13} /> Phone
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+212 6 1234 5678"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label small d-flex align-items-center gap-1">
                      <Building size={13} /> Clinic Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      placeholder="Clinic Name"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label small d-flex align-items-center gap-1">
                      <MapPin size={13} /> City
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small d-flex align-items-center gap-1">
                      <MapPin size={13} /> Full Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Full address"
                    />
                  </div>
                  <div className="col-12 d-flex justify-content-end">
                    <button
                      type="submit"
                      className="btn btn-primary d-flex align-items-center gap-2"
                      disabled={loading}
                    >
                      {loading
                        ? <><span className="spinner-border spinner-border-sm" /> Saving...</>
                        : <><Save size={15} /> Save Changes</>}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* ── Professional Details ── */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-body-secondary py-2">
              <strong className="small text-uppercase text-secondary">Professional Details</strong>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-sm-6">
                  <label className="form-label small d-flex align-items-center gap-1">
                    <Stethoscope size={13} /> Specialty
                  </label>
                  <select
                    className="form-select"
                    value={specialtyId}
                    onChange={(e) => setSpecialtyId(e.target.value)}
                  >
                    <option value="">Select specialty</option>
                    {specialties.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-sm-6">
                  <label className="form-label small d-flex align-items-center gap-1">
                    <DollarSign size={13} /> Consultation Fee (MAD)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small d-flex align-items-center gap-1">
                    <GraduationCap size={13} /> Qualifications
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    placeholder="MD, MBBS, etc."
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small d-flex align-items-center gap-1">
                    <FileText size={13} /> Bio
                  </label>
                  <textarea
                    className="form-control"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell patients about yourself..."
                    rows={4}
                  />
                  <div className="form-text">This will be visible to patients on your profile.</div>
                </div>
                <div className="col-12 d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-primary d-flex align-items-center gap-2"
                    disabled={loading}
                    onClick={handleSave}
                  >
                    {loading
                      ? <><span className="spinner-border spinner-border-sm" /> Saving...</>
                      : <><Save size={15} /> Save Changes</>}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Change Password ── */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-body-secondary py-2 d-flex align-items-center gap-2">
              <Lock size={14} className="text-secondary" />
              <strong className="small text-uppercase text-secondary">Change Password</strong>
            </div>
            <div className="card-body">
              {passMsg && (
                <div className={`alert alert-${passMsg.type} py-2 small`}>
                  {passMsg.text}
                </div>
              )}
              <form onSubmit={handleChangePassword}>
                <div className="row g-3">

                  {/* Current Password */}
                  <div className="col-12">
                    <label className="form-label small d-flex align-items-center gap-1">
                      <Lock size={13} /> Current Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showCurrent ? "text" : "password"}
                        className="form-control"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowCurrent(!showCurrent)}
                      >
                        {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="col-sm-6">
                    <label className="form-label small d-flex align-items-center gap-1">
                      <Lock size={13} /> New Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showNew ? "text" : "password"}
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowNew(!showNew)}
                      >
                        {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>

                    {/* Strength Bar */}
                    {strength && (
                      <div className="mt-2">
                        <div className="d-flex gap-1 mb-1">
                          {[1, 2, 3, 4].map((b) => (
                            <div
                              key={b}
                              className="flex-fill rounded"
                              style={{
                                height: 5,
                                backgroundColor: b <= strength.bars
                                  ? `var(--bs-${strength.color})`
                                  : "var(--bs-secondary-bg)",
                              }}
                            />
                          ))}
                        </div>
                        <div className={`small text-${strength.color} d-flex align-items-center gap-1`}>
                          <strength.icon size={13} />
                          {strength.label} password
                          {strength.label === "Weak" && " — add uppercase, numbers & symbols"}
                          {strength.label === "Fair" && " — add symbols or more characters"}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="col-sm-6">
                    <label className="form-label small d-flex align-items-center gap-1">
                      <Lock size={13} /> Confirm Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showConfirm ? "text" : "password"}
                        className={`form-control ${
                          confirmPassword
                            ? newPassword === confirmPassword ? "is-valid" : "is-invalid"
                            : ""
                        }`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat new password"
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowConfirm(!showConfirm)}
                      >
                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <div className="invalid-feedback d-block small">Passwords do not match.</div>
                    )}
                  </div>

                  {/* Password Rules */}
                  <div className="col-12">
                    <ul className="list-unstyled small mb-0 d-flex flex-wrap gap-2">
                      {[
                        { rule: newPassword.length >= 8,           text: "8+ characters"   },
                        { rule: /[A-Z]/.test(newPassword),         text: "Uppercase letter" },
                        { rule: /[0-9]/.test(newPassword),         text: "Number"           },
                        { rule: /[^A-Za-z0-9]/.test(newPassword),  text: "Symbol (!@#...)" },
                      ].map((r) => (
                        <li
                          key={r.text}
                          className={`d-flex align-items-center gap-1 ${r.rule ? "text-success" : "text-secondary"}`}
                        >
                          <span>{r.rule ? "✓" : "○"}</span> {r.text}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div className="form-text text-warning d-flex align-items-center gap-1">
                      <Lock size={12} /> You will be logged out after changing your password.
                    </div>
                    <button
                      type="submit"
                      className="btn btn-warning d-flex align-items-center gap-2"
                      disabled={passLoading}
                    >
                      {passLoading
                        ? <><span className="spinner-border spinner-border-sm" /> Changing...</>
                        : <><Lock size={15} /> Change Password</>}
                    </button>
                  </div>

                </div>
              </form>
            </div>
          </div>

          {/* ── Danger Zone ── */}
          <div className="card border-danger shadow-sm">
            <div className="card-header bg-danger bg-opacity-10 py-2 d-flex align-items-center gap-2">
              <Trash2 size={14} className="text-danger" />
              <strong className="small text-uppercase text-danger">Danger Zone</strong>
            </div>
            <div className="card-body">
              <p className="text-secondary small mb-3">
                Once you delete your account, all your data including appointments, availability
                and profile will be permanently removed. This action <strong>cannot be undone</strong>.
              </p>
              <button
                className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 size={14} /> Delete My Account
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── Delete Modal ── */}
      {showDeleteModal && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowDeleteModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-danger">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-danger d-flex align-items-center gap-2">
                  <Trash2 size={18} /> Delete Account
                </h5>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body">
                <div className="alert alert-danger small">
                  ⚠️ This will permanently delete your account and all associated data.
                </div>
                {deleteError && (
                  <div className="alert alert-danger py-2 small">{deleteError}</div>
                )}
                <form onSubmit={handleDeleteAccount}>
                  <label className="form-label small d-flex align-items-center gap-1">
                    <Lock size={13} /> Enter your password to confirm
                  </label>
                  <div className="input-group mb-3">
                    <input
                      type={showDeletePass ? "text" : "password"}
                      className="form-control"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Your password"
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowDeletePass(!showDeletePass)}
                    >
                      {showDeletePass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <div className="d-flex gap-2 justify-content-end">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-danger btn-sm d-flex align-items-center gap-1"
                      disabled={deleteLoading}
                    >
                      {deleteLoading
                        ? <><span className="spinner-border spinner-border-sm" /> Deleting...</>
                        : <><Trash2 size={14} /> Yes, Delete My Account</>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}