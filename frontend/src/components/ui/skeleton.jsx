export function Skeleton({ width = "100%", height = 16, className = "", rounded = false }) {
  return (
    <div
      className={`placeholder-glow ${className}`}
      style={{ width, height }}
    >
      <span
        className={`placeholder w-100 h-100 ${rounded ? "rounded-circle" : "rounded"}`}
      />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card shadow-sm p-3">
      <div className="d-flex align-items-center gap-3 mb-3">
        <Skeleton width={48} height={48} rounded />
        <div className="flex-fill">
          <Skeleton height={14} className="mb-2" />
          <Skeleton width="60%" height={12} />
        </div>
      </div>
      <Skeleton height={12} className="mb-2" />
      <Skeleton height={12} className="mb-2" width="80%" />
      <Skeleton height={12} width="60%" />
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="d-flex flex-column gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}