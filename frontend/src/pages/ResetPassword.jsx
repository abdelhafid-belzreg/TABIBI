import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Stethoscope, Lock, Eye, EyeOff, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import api from "@/lib/api";

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

export default function ResetPassword() {
  const navigate              = useNavigate();
  const [searchParams]        = useSearchParams();
  const token                 = searchParams.get("token");
  const email                 = searchParams.get("email");

  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass,        setShowPass]        = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState("");

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (strength?.label === "Weak") {
      setError("Password is too weak. Please choose a stronger password.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/reset-password", {
        token,
        email,
        password,
        password_confirmation: confirmPassword,
      });
      navigate("/login?reset=1");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-vh-100 d-flex align-items-center justify-content-center py-5 bg-body">
      <div className="w-100" style={{ maxWidth: 420 }}>

        <div className="text-center mb-4">
          <div
            className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: 64, height: 64 }}
          >
            <Stethoscope size={30} className="text-primary" />
          </div>
          <h2 className="fw-bold mb-1">Reset Password</h2>
          <p className="text-secondary small mb-0">Enter your new password below</p>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">

            {error && (
              <div className="alert alert-danger py-2 small mb-3">{error}</div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label small fw-semibold">New Password</label>
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

                {/* Strength bar */}
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
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
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

              <button
                type="submit"
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm" /> Resetting...</>
                ) : (
                  "Reset Password"
                )}
              </button>

            </form>

            <div className="text-center mt-3">
              <Link
                to="/login"
                className="text-secondary small text-decoration-none"
              >
                Back to Sign In
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}