import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ current = 1, total = 1, onPageChange }) {
  if (total <= 1) return null;

  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <nav>
      <ul className="pagination pagination-sm justify-content-center mb-0">
        {/* Prev */}
        <li className={`page-item ${current === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(current - 1)}>
            <ChevronLeft size={14} />
          </button>
        </li>

        {/* Pages */}
        {pages.map((p) => (
          <li key={p} className={`page-item ${p === current ? "active" : ""}`}>
            <button className="page-link" onClick={() => onPageChange(p)}>{p}</button>
          </li>
        ))}

        {/* Next */}
        <li className={`page-item ${current === total ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(current + 1)}>
            <ChevronRight size={14} />
          </button>
        </li>
      </ul>
    </nav>
  );
}