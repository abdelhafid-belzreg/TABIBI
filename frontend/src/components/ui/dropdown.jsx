import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export function Dropdown({ label, icon: Icon, items = [], variant = "outline-secondary", align = "start" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="dropdown" ref={ref}>
      <button
        className={`btn btn-${variant} d-flex align-items-center gap-1`}
        onClick={() => setOpen(!open)}
      >
        {Icon && <Icon size={15} />} {label} <ChevronDown size={13} />
      </button>
      <ul className={`dropdown-menu dropdown-menu-${align} ${open ? "show" : ""}`}>
        {items.map((item, i) =>
          item.divider ? (
            <li key={i}><hr className="dropdown-divider" /></li>
          ) : (
            <li key={i}>
              <button
                className={`dropdown-item d-flex align-items-center gap-2 ${item.variant ? `text-${item.variant}` : ""}`}
                onClick={() => { item.onClick?.(); setOpen(false); }}
                disabled={item.disabled}
              >
                {item.icon && <item.icon size={14} />} {item.label}
              </button>
            </li>
          )
        )}
      </ul>
    </div>
  );
}