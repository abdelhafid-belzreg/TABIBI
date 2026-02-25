import * as React from "react";
import { cn } from "@/lib/utils";

const variantClasses = {
  default: "btn btn-primary",
  destructive: "btn btn-danger",
  outline: "btn btn-outline-secondary",
  secondary: "btn btn-secondary",
  ghost: "btn btn-light",
  link: "btn btn-link p-0 align-baseline",
};

const sizeClasses = {
  default: "",
  sm: "btn-sm",
  lg: "btn-lg",
  icon: "p-2",
};

const Button = React.forwardRef(function Button(
  { className, variant = "default", size = "default", asChild = false, type = "button", ...props },
  ref,
) {
  // asChild: render children directly (e.g. for <Link> wrappers)
  if (asChild) {
    const child = React.Children.only(props.children);
    return React.cloneElement(child, {
      className: cn(
        variantClasses[variant] || variantClasses.default,
        sizeClasses[size] || sizeClasses.default,
        className,
        child.props.className,
      ),
      ref,
    });
  }

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        variantClasses[variant] || variantClasses.default,
        sizeClasses[size] || sizeClasses.default,
        className,
      )}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };