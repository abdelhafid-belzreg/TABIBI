import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { MailCheck, XCircle } from "lucide-react";
import api from "@/lib/api";

export default function VerifyEmail() {
  const { id, hash }          = useParams();
  const [searchParams]        = useSearchParams();
  const navigate              = useNavigate();
  const [status, setStatus]   = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        await api.get(`/email/verify/${id}/${hash}?${searchParams.toString()}`);
        setStatus("success");
        setTimeout(() => navigate("/login?verified=1"), 3000);
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message || "Verification failed. Link may be expired."
        );
      }
    };
    verify();
  }, [id, hash]);

  return (
    <section className="min-vh-100 d-flex align-items-center justify-content-center bg-body">
      <div className="card border-0 shadow-sm text-center p-5" style={{ maxWidth: 440 }}>

        {status === "loading" && (
          <>
            <div className="spinner-border text-primary mx-auto mb-4" />
            <h5 className="fw-bold">Verifying your email...</h5>
            <p className="text-secondary small">Please wait.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div
              className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mx-auto mb-4"
              style={{ width: 72, height: 72 }}
            >
              <MailCheck size={34} className="text-success" />
            </div>
            <h5 className="fw-bold mb-2">Email Verified</h5>
            <p className="text-secondary small mb-4">
              Your email has been verified successfully. Redirecting to login...
            </p>
            <button
              className="btn btn-primary w-100"
              onClick={() => navigate("/login?verified=1")}
            >
              Go to Sign In
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div
              className="rounded-circle bg-danger bg-opacity-10 d-inline-flex align-items-center justify-content-center mx-auto mb-4"
              style={{ width: 72, height: 72 }}
            >
              <XCircle size={34} className="text-danger" />
            </div>
            <h5 className="fw-bold mb-2">Verification Failed</h5>
            <p className="text-secondary small mb-4">{message}</p>
            <button
              className="btn btn-outline-primary w-100"
              onClick={() => navigate("/signup")}
            >
              Back to Sign Up
            </button>
          </>
        )}

      </div>
    </section>
  );
}