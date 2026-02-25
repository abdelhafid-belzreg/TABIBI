export function Progress({ value = 0, max = 100, variant = "primary", label, showPercent = false, height = 8 }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div>
      {(label || showPercent) && (
        <div className="d-flex justify-content-between small text-secondary mb-1">
          {label && <span>{label}</span>}
          {showPercent && <span>{Math.round(pct)}%</span>}
        </div>
      )}
      <div className="progress" style={{ height }}>
        <div
          className={`progress-bar bg-${variant}`}
          role="progressbar"
          style={{ width: `${pct}%` }}
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}