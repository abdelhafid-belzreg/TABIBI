import { useToast } from "@/hooks/use-toast";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

const icons = {
  success: <CheckCircle  size={18} className="text-success" />,
  danger:  <AlertCircle  size={18} className="text-danger"  />,
  warning: <AlertTriangle size={18} className="text-warning" />,
  info:    <Info          size={18} className="text-info"    />,
};

export function Toaster() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position:  "fixed",
        bottom:    "1.5rem",
        right:     "1.5rem",
        zIndex:    9999,
        display:   "flex",
        flexDirection: "column",
        gap:       "0.5rem",
        minWidth:  "300px",
        maxWidth:  "400px",
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast show align-items-center border-0 shadow ${
            t.dismissed ? "opacity-0" : "opacity-100"
          }`}
          style={{ transition: "opacity 0.3s ease" }}
          role="alert"
        >
          <div className="d-flex align-items-start gap-2 p-3">
            {/* Icon */}
            <div className="flex-shrink-0 mt-1">
              {icons[t.variant] ?? icons.info}
            </div>

            {/* Content */}
            <div className="flex-fill">
              {t.title && (
                <div className="fw-semibold small">{t.title}</div>
              )}
              {t.description && (
                <div className="text-secondary" style={{ fontSize: "0.8rem" }}>
                  {t.description}
                </div>
              )}
            </div>

            {/* Dismiss */}
            <button
              className="btn btn-sm p-0 ms-1 text-secondary"
              onClick={() => dismiss(t.id)}
            >
              <X size={15} />
            </button>
          </div>

          {/* ✅ Progress bar */}
          <div
            className={`bg-${t.variant} bg-opacity-25`}
            style={{ height: 3, width: "100%", borderRadius: "0 0 4px 4px" }}
          />
        </div>
      ))}
    </div>
  );
}