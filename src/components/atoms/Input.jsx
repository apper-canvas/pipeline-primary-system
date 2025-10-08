import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(
  ({ className, type = "text", error, ...props }, ref) => {
    const baseStyles =
      "w-full px-4 py-2 border rounded-lg text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";

    const errorStyles = error
      ? "border-red-500 focus:ring-red-500"
      : "border-gray-300";

    if (type === "textarea") {
      return (
        <textarea
          ref={ref}
          className={cn(baseStyles, errorStyles, "min-h-[100px] resize-y", className)}
          {...props}
        />
      );
    }

    return (
      <input
        ref={ref}
        type={type}
        className={cn(baseStyles, errorStyles, className)}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;