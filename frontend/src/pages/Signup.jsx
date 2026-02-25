import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Stethoscope, User, UserCheck, Mail, Phone,
  Lock, Eye, EyeOff, Building, MapPin,
  CreditCard, Microscope, Calendar,
  ShieldCheck, ShieldAlert, ShieldX, MailCheck, RefreshCw,
} from "lucide-react";
import api from "@/lib/api";

// ── Password strength ──
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

// ── Age from DOB ──
const getAge = (dob) => {
  if (!dob) return null;
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
};

// ── Validation helpers ──
const isValidPhone = (phone) => /^(?:\+212|0)[5-7]\d{8}$/.test(phone.replace(/\s/g, ""));
const isValidCIN   = (cin)   => /^[A-Za-z]{1,2}\d{5,6}$/.test(cin.trim());

const InputGroup = ({ icon: Icon, children }) => (
  <div className="input-group">
    <span className="input-group-text bg-body-secondary border-end-0">
      <Icon size={15} className="text-secondary" />
    </span>
    {children}
  </div>
);

export default function Signup() {
  const navigate = useNavigate();

  const [role,            setRole]            = useState("patient");
  const [fullName,        setFullName]        = useState("");
  const [email,           setEmail]           = useState("");
  const [phone,           setPhone]           = useState("");
  const [cin,             setCin]             = useState("");
  const [dateOfBirth,     setDateOfBirth]     = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clinicName,      setClinicName]      = useState("");
  const [city,            setCity]            = useState("");
  const [location,        setLocation]        = useState("");
  const [specialtyId,     setSpecialtyId]     = useState("");
  const [specialties,     setSpecialties]     = useState([]);
  const [specialtyLoading, setSpecialtyLoading] = useState(false);
  const [showPass,        setShowPass]        = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState("");
  const [sent,            setSent]            = useState(false); // ← show "check email" screen
  const [resending,       setResending]       = useState(false);

  const strength = getPasswordStrength(password);
  const age      = getAge(dateOfBirth);

  // Max DOB = 18 years ago, min = 120 years ago
  const maxDob = new Date(new Date().setFullYear(new Date().getFullYear() - 18))
    .toISOString().split("T")[0];
  const minDob = new Date(new Date().setFullYear(new Date().getFullYear() - 120))
    .toISOString().split("T")[0];

  // ── Fetch specialties from DB when doctor role selected ──
  useEffect(() => {
    if (role !== "doctor") return;
    const fetchSpecialties = async () => {
      setSpecialtyLoading(true);
      try {
        const res = await api.get("/specialties");
        setSpecialties(res.data);
      } catch {
        setError("Failed to load specialties. Please refresh.");
      } finally {
        setSpecialtyLoading(false);
      }
    };
    fetchSpecialties();
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidPhone(phone)) {
      setError("Invalid phone number. Use Moroccan format: 06XXXXXXXX or +212 6XXXXXXXX");
      return;
    }
    if (!isValidCIN(cin)) {
      setError("Invalid CIN. Expected format: AB123456 or A123456");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (strength?.label === "Weak") {
      setError("Password is too weak. Please choose a stronger password.");
      return;
    }
    if (role === "patient" && !dateOfBirth) {
      setError("Date of birth is required.");
      return;
    }
    if (role === "patient" && age !== null && age < 18) {
      setError("You must be at least 18 years old to register.");
      return;
    }

    setLoading(true);
    try {
      await api.get("/sanctum/csrf-cookie", { baseURL: "http://localhost:8000" });

      const payload = {
        name:                  fullName,
        email,
        phone,
        cin,
        password,
        password_confirmation: confirmPassword,
        role,
        ...(role === "patient" && { date_of_birth: dateOfBirth }),
        ...(role === "doctor"  && {
          clinic_name:  clinicName,
          city,
          location,
          specialty_id: specialtyId,
        }),
      };

      await api.post("/register", payload);
      setSent(true); // ← show verify screen instead of redirecting
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(
        errors
          ? Object.values(errors)[0][0]
          : err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      await api.post("/email/resend", { email });
    } catch {
      setError("Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  };

  // ── Check email screen ──
  if (sent) {
    return (
      <section className="min-vh-100 d-flex align-items-center justify-content-center py-5 bg-body">
        <div className="w-100" style={{ maxWidth: 440 }}>
          <div className="card border-0 shadow-sm">
            <div className="card-body p-5 text-center">

              <div
                className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-4"
                style={{ width: 72, height: 72 }}
              >
                <MailCheck size={34} className="text-primary" />
              </div>

              <h4 className="fw-bold mb-2">Check your email</h4>
              <p className="text-secondary small mb-1">
                We sent a verification link to
              </p>
              <p className="fw-semibold mb-4">{email}</p>
              <p className="text-secondary small mb-4">
                Click the link in the email to verify your account, then sign in.
              </p>

              {error && (
                <div className="alert alert-danger py-2 small mb-3">{error}</div>
              )}

              <button
                className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2 mb-3"
                onClick={handleResend}
                disabled={resending}
              >
                {resending
                  ? <><span className="spinner-border spinner-border-sm" /> Sending...</>
                  : <><RefreshCw size={15} /> Resend Verification Email</>}
              </button>

              <button
                className="btn btn-primary w-100"
                onClick={() => navigate("/login")}
              >
                Go to Sign In
              </button>

            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-vh-100 d-flex align-items-center justify-content-center py-5 bg-body">
      <div className="w-100" style={{ maxWidth: 680 }}>

        {/* ── Brand ── */}
        <div className="text-center mb-4">
          <div
            className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: 64, height: 64 }}
          >
            <Stethoscope size={30} className="text-primary" />
          </div>
          <h2 className="fw-bold mb-1">Create Account</h2>
          <p className="text-secondary small mb-0">Join TABIBI as a patient or doctor</p>
        </div>

        {/* ── Card ── */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">

            {/* ── Role Selector ── */}
            <div className="row g-2 mb-4">
              <div className="col-6">
                <button
                  type="button"
                  onClick={() => setRole("patient")}
                  className={`btn w-100 d-flex flex-column align-items-center py-3 gap-1 ${
                    role === "patient" ? "btn-primary" : "btn-outline-primary"
                  }`}
                >
                  <User size={22} />
                  <span className="fw-semibold small">Patient</span>
                </button>
              </div>
              <div className="col-6">
                <button
                  type="button"
                  onClick={() => setRole("doctor")}
                  className={`btn w-100 d-flex flex-column align-items-center py-3 gap-1 ${
                    role === "doctor" ? "btn-primary" : "btn-outline-primary"
                  }`}
                >
                  <UserCheck size={22} />
                  <span className="fw-semibold small">Doctor</span>
                </button>
              </div>
            </div>

            {/* ── Global Error ── */}
            {error && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                {error}
                <button
                  className="btn-close btn-sm ms-auto"
                  style={{ fontSize: "0.65rem" }}
                  onClick={() => setError("")}
                />
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">

                {/* ── Full Name ── */}
                <div className="col-12">
                  <label className="form-label small fw-semibold">Full Name</label>
                  <InputGroup icon={User}>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="form-control border-start-0 ps-0"
                      placeholder="Full Name"
                      required
                    />
                  </InputGroup>
                </div>

                {/* ── Email ── */}
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Email</label>
                  <InputGroup icon={Mail}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control border-start-0 ps-0"
                      placeholder="you@example.com"
                      required
                    />
                  </InputGroup>
                </div>

                {/* ── Phone ── */}
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Phone Number</label>
                  <InputGroup icon={Phone}>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`form-control border-start-0 ps-0 ${
                        phone
                          ? isValidPhone(phone) ? "is-valid" : "is-invalid"
                          : ""
                      }`}
                      placeholder="06XXXXXXXX or +212 6XXXXXXXX"
                      required
                    />
                  </InputGroup>
                  {phone && !isValidPhone(phone) && (
                    <div className="invalid-feedback d-block small">
                      Use format: 06XXXXXXXX, 07XXXXXXXX or +212 6XXXXXXXX
                    </div>
                  )}
                </div>

                {/* ── CIN ── */}
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">CIN</label>
                  <InputGroup icon={CreditCard}>
                    <input
                      type="text"
                      value={cin}
                      onChange={(e) => setCin(e.target.value.toUpperCase())}
                      className={`form-control border-start-0 ps-0 ${
                        cin
                          ? isValidCIN(cin) ? "is-valid" : "is-invalid"
                          : ""
                      }`}
                      placeholder="AB123456"
                      required
                    />
                  </InputGroup>
                  {cin && !isValidCIN(cin) && (
                    <div className="invalid-feedback d-block small">
                      Use format: AB123456 or A123456
                    </div>
                  )}
                </div>

                {/* ── Date of Birth — patient only ── */}
                {role === "patient" && (
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Date of Birth</label>
                    <InputGroup icon={Calendar}>
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className={`form-control border-start-0 ps-0 ${
                          dateOfBirth && age !== null && age < 18 ? "is-invalid" : ""
                        }`}
                        min={minDob}
                        max={maxDob}
                        required
                      />
                    </InputGroup>
                    {dateOfBirth && age !== null && (
                      <div className={`form-text ${age < 18 ? "text-danger" : "text-success"}`}>
                        {age < 18 ? "You must be at least 18 years old." : `Age: ${age} years`}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Doctor Fields ── */}
                {role === "doctor" && (
                  <>
                    <div className="col-12">
                      <div className="d-flex align-items-center gap-2 my-1">
                        <hr className="flex-fill m-0" />
                        <span className="text-secondary small px-2 d-flex align-items-center gap-1">
                          <Stethoscope size={13} /> Doctor Details
                        </span>
                        <hr className="flex-fill m-0" />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Clinic Name</label>
                      <InputGroup icon={Building}>
                        <input
                          type="text"
                          value={clinicName}
                          onChange={(e) => setClinicName(e.target.value)}
                          className="form-control border-start-0 ps-0"
                          placeholder="Clinic Name"
                          required
                        />
                      </InputGroup>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Specialty</label>
                      <InputGroup icon={Microscope}>
                        <select
                          value={specialtyId}
                          onChange={(e) => setSpecialtyId(e.target.value)}
                          className="form-select border-start-0"
                          required
                          disabled={specialtyLoading}
                        >
                          <option value="">
                            {specialtyLoading ? "Loading..." : "Select Specialty"}
                          </option>
                          {specialties.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </InputGroup>
                      {specialtyLoading && (
                        <div className="form-text d-flex align-items-center gap-1">
                          <span className="spinner-border spinner-border-sm" style={{ width: 12, height: 12 }} />
                          Loading specialties...
                        </div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">City</label>
                      <InputGroup icon={MapPin}>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="form-control border-start-0 ps-0"
                          placeholder="City"
                          required
                        />
                      </InputGroup>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Location / Address</label>
                      <InputGroup icon={MapPin}>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="form-control border-start-0 ps-0"
                          placeholder="Street / Area"
                          required
                        />
                      </InputGroup>
                    </div>
                  </>
                )}

                {/* ── Security separator ── */}
                <div className="col-12">
                  <div className="d-flex align-items-center gap-2 my-1">
                    <hr className="flex-fill m-0" />
                    <span className="text-secondary small px-2 d-flex align-items-center gap-1">
                      <Lock size={13} /> Security
                    </span>
                    <hr className="flex-fill m-0" />
                  </div>
                </div>

                {/* ── Password ── */}
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-body-secondary border-end-0">
                      <Lock size={15} className="text-secondary" />
                    </span>
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control border-start-0 border-end-0 ps-0"
                      placeholder="••••••••"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      className="input-group-text bg-body-secondary border-start-0"
                      onClick={() => setShowPass(!showPass)}
                      tabIndex={-1}
                    >
                      {showPass
                        ? <EyeOff size={15} className="text-secondary" />
                        : <Eye    size={15} className="text-secondary" />}
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
                              transition: "background-color 0.3s",
                            }}
                          />
                        ))}
                      </div>
                      <div className={`small text-${strength.color} d-flex align-items-center gap-1`}>
                        <strength.icon size={12} />
                        {strength.label} password
                        {strength.label === "Weak" && " — add uppercase, numbers & symbols"}
                        {strength.label === "Fair" && " — add symbols or more characters"}
                      </div>
                    </div>
                  )}

                  {/* Password Rules */}
                  {password && (
                    <ul className="list-unstyled small mb-0 mt-2 d-flex flex-wrap gap-2">
                      {[
                        { rule: password.length >= 8,           text: "8+ chars"  },
                        { rule: /[A-Z]/.test(password),         text: "Uppercase" },
                        { rule: /[0-9]/.test(password),         text: "Number"    },
                        { rule: /[^A-Za-z0-9]/.test(password),  text: "Symbol"    },
                      ].map((r) => (
                        <li
                          key={r.text}
                          className={`d-flex align-items-center gap-1 ${
                            r.rule ? "text-success" : "text-secondary"
                          }`}
                        >
                          <span style={{ fontSize: "0.7rem" }}>{r.rule ? "✓" : "○"}</span>
                          {r.text}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* ── Confirm Password ── */}
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Confirm Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-body-secondary border-end-0">
                      <Lock size={15} className="text-secondary" />
                    </span>
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`form-control border-start-0 border-end-0 ps-0 ${
                        confirmPassword
                          ? confirmPassword === password ? "is-valid" : "is-invalid"
                          : ""
                      }`}
                      placeholder="••••••••"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      className="input-group-text bg-body-secondary border-start-0"
                      onClick={() => setShowConfirm(!showConfirm)}
                      tabIndex={-1}
                    >
                      {showConfirm
                        ? <EyeOff size={15} className="text-secondary" />
                        : <Eye    size={15} className="text-secondary" />}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword !== password && (
                    <div className="invalid-feedback d-block small">Passwords do not match.</div>
                  )}
                  {confirmPassword && confirmPassword === password && (
                    <div className="valid-feedback d-block small">Passwords match.</div>
                  )}
                </div>

                {/* ── Submit ── */}
                <div className="col-12 mt-2">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" />
                        Creating account...
                      </>
                    ) : (
                      `Sign Up as ${role === "doctor" ? "Doctor" : "Patient"}`
                    )}
                  </button>
                </div>

              </div>
            </form>

            <p className="text-center text-body-secondary mt-3 mb-0 small">
              Already have an account?{" "}
              <Link to="/login" className="text-primary fw-medium text-decoration-underline">
                Sign In
              </Link>
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}