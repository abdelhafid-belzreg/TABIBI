import { AlertTriangle, X } from "lucide-react";

export function AlertDialog({
  show, onClose, onConfirm,
  title      = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText  = "Cancel",
  variant     = "danger",
  loading     = false,
}) {
  if (!show) return null;
  return (
    <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className={`modal-content border-${variant}`}>
          <div className="modal-body p-4 text-center">
            <div className={`rounded-circle bg-${variant} bg-opacity-10 d-inline-flex p-3 mb-3`}>
              <AlertTriangle className={`text-${variant}`} size={28} />
            </div>
            <h5 className="fw-bold mb-2">{title}</h5>
            <p className="text-secondary small mb-4">{description}</p>
            <div className="d-flex gap-2 justify-content-center">
              <button className="btn btn-secondary btn-sm" onClick={onClose}>
                {cancelText}
              </button>
              <button
                className={`btn btn-${variant} btn-sm d-flex align-items-center gap-1`}
                onClick={onConfirm}
                disabled={loading}
              >
                {loading
                  ? <><span className="spinner-border spinner-border-sm" /> Loading...</>
                  : confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}