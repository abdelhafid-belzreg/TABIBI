export function Spinner({ text = "Loading..." }) {
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status" />
      {text && <p className="text-secondary mt-3 small">{text}</p>}
    </div>
  );
}