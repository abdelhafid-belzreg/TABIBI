import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

export function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="breadcrumb" className="mb-3">
      <ol className="breadcrumb small">
        <li className="breadcrumb-item">
          <Link to="/" className="text-decoration-none d-flex align-items-center gap-1">
            <Home size={13} /> Home
          </Link>
        </li>
        {items.map((item, i) => (
          <li
            key={i}
            className={`breadcrumb-item ${i === items.length - 1 ? "active" : ""}`}
          >
            {item.href && i !== items.length - 1
              ? <Link to={item.href} className="text-decoration-none">{item.label}</Link>
              : item.label}
          </li>
        ))}
      </ol>
    </nav>
  );
}