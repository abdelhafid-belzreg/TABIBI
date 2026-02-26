import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Stethoscope, Mail, Lock, LogIn, Eye, EyeOff, MailCheck, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/api";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [verified,    setVerified]    = useState(false);
  const [unverified,  setUnverified]  = useState(false);
  const [resending,   setResending]   = useState(false);
  const [resendMsg,   setResendMsg]   = useState("");
  const [resendError, setResendError] = useState("");
  const [reset,       setReset]       = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("verified") === "1") setVerified(true);
    if (params.get("reset")    === "1") setReset(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUnverified(false);
    setResendMsg("");
    setResendError("");
    try {
      const user = await login(email, password);
      if (!user.email_verified_at) { setUnverified(true); setLoading(false); return; }
      if (user.role === "admin")       navigate("/admin/dashboard");
      else if (user.role === "doctor") navigate("/doctor/dashboard");
      else                             navigate("/patient/dashboard");
    } catch (err) {
      toast({ title: t("login.failed"), description: err.response?.data?.message || t("login.invalid"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResendMsg("");
    setResendError("");
    try {
      await api.post("/email/resend", { email });
      setResendMsg(t("login.resend"));
    } catch {
      setResendError(t("common.error"));
    } finally {
      setResending(false);
    }
  };

  return (
    <section className="min-vh-100 d-flex align-items-center justify-content-center py-5 bg-body">
      <div className="w-100" style={{ maxWidth: 420 }}>

        {/* Brand */}
        <div className="text-center mb-4">
          <div
            className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: 64, height: 64 }}
          >
            <Stethoscope size={30} className="text-primary" />
          </div>
          <h2 className="fw-bold mb-1">{t("login.welcome")}</h2>
          <p className="text-secondary small mb-0">{t("login.subtitle")}</p>
        </div>

        {/* Card */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">

            {/* Verified success */}
            {verified && <div className="alert alert-success py-2 small mb-3">{t("login.verified")}</div>}

            {/* Unverified warning */}
            {unverified && (
              <div className="alert alert-warning py-3 small mb-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <MailCheck size={16} className="text-warning" />
                  <strong>{t("login.unverified_title")}</strong>
                </div>
                <p className="mb-2">{t("login.unverified_msg")} <strong>{email}</strong></p>
                {resendMsg   && <p className="mb-2 text-success">{resendMsg}</p>}
                {resendError && <p className="mb-2 text-danger">{resendError}</p>}
                <button className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1" onClick={handleResend} disabled={resending}>
                  {resending
                    ? <><span className="spinner-border spinner-border-sm" style={{ width: 12, height: 12 }} /> {t("login.resending")}</>
                    : <><RefreshCw size={13} /> {t("login.resend")}</>}
                </button>
              </div>
            )}

            {/* Password reset success */}
            {reset && <div className="alert alert-success py-2 small mb-3">{t("login.reset_success")}</div>}

            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label small fw-semibold">{t("login.email")}</label>
                <div className="input-group">
                  <span className="input-group-text bg-body-secondary border-end-0"><Mail size={15} className="text-secondary" /></span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control border-start-0 ps-0"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label htmlFor="password" className="form-label small fw-semibold mb-0">{t("login.password")}</label>
                  <Link to="/forgot-password" className="text-primary small text-decoration-none">{t("login.forgot")}</Link>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-body-secondary border-end-0"><Lock size={15} className="text-secondary" /></span>
                  <input
                    id="password"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control border-start-0 border-end-0 ps-0"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="input-group-text bg-body-secondary border-start-0"
                    onClick={() => setShowPass(!showPass)}
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOff size={15} className="text-secondary" /> : <Eye size={15} className="text-secondary" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                disabled={loading}
              >
                {loading
                  ? <><span className="spinner-border spinner-border-sm" /> {t("login.signing_in")}</>
                  : <><LogIn size={16} /> {t("login.sign_in")}</>}
              </button>

            </form>

            <div className="d-flex align-items-center gap-2 my-3">
              <hr className="flex-fill m-0" />
              <span className="text-secondary small px-1">{t("common.or")}</span>
              <hr className="flex-fill m-0" />
            </div>

            <p className="text-center text-secondary small mb-0">
              {t("login.no_account")}{" "}
              <Link to="/signup" className="text-primary fw-semibold text-decoration-none">{t("login.sign_up")}</Link>
            </p>

          </div>
        </div>

        <p className="text-center text-secondary mt-3 mb-0" style={{ fontSize: "0.875rem" }}>
          &copy; {new Date().getFullYear()} TABIBI. {t("footer.rights")}
        </p>

      </div>
    </section>
  );
}