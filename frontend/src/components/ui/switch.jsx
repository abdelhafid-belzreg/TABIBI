export function Switch({ checked, onChange, label, id, disabled = false }) {
  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      {label && (
        <label className="form-check-label small" htmlFor={id}>
          {label}
        </label>
      )}
    </div>
  );
}