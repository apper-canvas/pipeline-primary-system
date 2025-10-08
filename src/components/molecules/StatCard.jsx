import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const StatCard = ({ title, value, trend, icon, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-secondary font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <ApperIcon name={icon} size={24} />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trend.value >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            <ApperIcon
              name={trend.value >= 0 ? "TrendingUp" : "TrendingDown"}
              size={16}
            />
            <span>{Math.abs(trend.value)}%</span>
          </div>
          <span className="text-sm text-gray-500">{trend.label}</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;