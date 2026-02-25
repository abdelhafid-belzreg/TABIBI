export function Separator({ label, className = "" }) {
  if (label) {
    return (
      <div className={`d-flex align-items-center gap-2 my-3 ${className}`}>
        <hr className="flex-fill m-0" />
        <span className="text-secondary small px-1">{label}</span>
        <hr className="flex-fill m-0" />
      </div>
    );
  }
  return <hr className={`my-3 ${className}`} />;
}