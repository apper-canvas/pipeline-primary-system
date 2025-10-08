import { cn } from "@/utils/cn";

const Badge = ({ children, variant = "default", className }) => {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

  const variants = {
    default: "bg-gray-100 text-gray-800",
    lead: "bg-blue-100 text-blue-800",
    qualified: "bg-yellow-100 text-yellow-800",
    proposal: "bg-orange-100 text-orange-800",
    negotiation: "bg-purple-100 text-purple-800",
    closed: "bg-green-100 text-green-800",
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-600",
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)}>
      {children}
    </span>
  );
};

export default Badge;