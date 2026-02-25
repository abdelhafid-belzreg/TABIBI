import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function Accordion({ items = [], defaultOpen = null }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="accordion">
      {items.map((item, i) => (
        <div className="accordion-item" key={i}>
          <h2 className="accordion-header">
            <button
              className={`accordion-button ${open !== i ? "collapsed" : ""}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              {item.icon && <span className="me-2">{item.icon}</span>}
              {item.title}
            </button>
          </h2>
          <div className={`accordion-collapse collapse ${open === i ? "show" : ""}`}>
            <div className="accordion-body">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}