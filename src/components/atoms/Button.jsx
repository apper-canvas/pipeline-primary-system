import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      disabled = false,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-primary text-white hover:bg-blue-700 shadow-sm",
      secondary:
        "bg-white text-secondary border border-gray-300 hover:bg-gray-50",
      outline:
        "bg-transparent text-primary border border-primary hover:bg-blue-50",
      ghost: "bg-transparent text-secondary hover:bg-gray-100",
      danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;