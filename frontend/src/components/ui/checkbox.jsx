export function Checkbox({ checked, onChange, label, id, disabled = false }) {
  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
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