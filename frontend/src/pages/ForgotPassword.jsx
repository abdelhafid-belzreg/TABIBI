import { useState } from "react";
import { Link } from "react-router-dom";
import { Stethoscope, Mail, ArrowLeft } from "lucide-react";
import api from "@/lib/api";

export default function ForgotPassword() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
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
          <h2 className="fw-bold mb-1">Forgot Password</h2>
          <p className="text-secondary small mb-0">
            Enter your email and we will send you a reset link
          </p>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">

            {sent ? (
              <div className="text-center py-3">
                <div
                  className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: 64, height: 64 }}
                >
                  <Mail size={28} className="text-success" />
                </div>
                <h5 className="fw-bold mb-2">Check your email</h5>
                <p className="text-secondary small mb-4">
                  If an account exists for <strong>{email}</strong>, a password reset link has been sent.
                </p>
                <Link to="/login" className="btn btn-primary w-100">
                  Back to Sign In
                </Link>
              </div>
            ) : (
              <>
                {error && (
                  <div className="alert alert-danger py-2 small mb-3">{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label small fw-semibold">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-body-secondary border-end-0">
                        <Mail size={15} className="text-secondary" />
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control border-start-0 ps-0"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm" /> Sending...</>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </form>

                <div className="text-center mt-3">
                  <Link
                    to="/login"
                    className="text-secondary small text-decoration-none d-flex align-items-center justify-content-center gap-1"
                  >
                    <ArrowLeft size={14} /> Back to Sign In
                  </Link>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}