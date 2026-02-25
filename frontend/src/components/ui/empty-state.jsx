export function EmptyState({ icon: Icon, title, desc }) {
  return (
    <div className="text-center text-secondary py-5">
      {Icon && <Icon size={40} className="mb-3 opacity-25" />}
      {title && <p className="fw-medium mb-1">{title}</p>}
      {desc  && <p className="small mb-0">{desc}</p>}
    </div>
  );
}