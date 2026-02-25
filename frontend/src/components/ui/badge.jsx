import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  default: "text-bg-primary",
  secondary: "text-bg-secondary",
  destructive: "text-bg-danger",
  outline: "text-dark bg-transparent border border-secondary",
};

export function Badge({ children, variant = "primary", className = "" }) {
  return (
    <span className={`badge text-bg-${variant} ${className}`}>
      {children}
    </span>
  );
}

export { badgeVariants };