import { User } from "lucide-react";

const sizeMap = { sm: 32, md: 40, lg: 56, xl: 72 };

export function Avatar({ name, size = "md", className = "" }) {
  const px = typeof size === "number" ? size : sizeMap[size] ?? 40;
  return (
    <div
      className={`rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0 ${className}`}
      style={{ width: px, height: px }}
    >
      {name
        ? <span className="fw-bold text-primary" style={{ fontSize: px * 0.35 }}>
            {name.charAt(0).toUpperCase()}
          </span>
        : <User className="text-primary" size={px * 0.45} />}
    </div>
  );
}