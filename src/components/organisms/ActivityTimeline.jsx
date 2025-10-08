import { format } from "date-fns";
import { motion } from "framer-motion";
import React from "react";
import ApperIcon from "@/components/ApperIcon";

const ActivityTimeline = ({ activities }) => {
const getActivityIcon = (type) => {
    switch (type) {
      case "email":
        return "Mail";
      case "call":
        return "Phone";
      case "meeting":
        return "Users";
      case "note":
        return "FileText";
      default:
        return "Activity";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "email":
        return "bg-blue-100 text-blue-600";
      case "call":
        return "bg-green-100 text-green-600";
      case "meeting":
        return "bg-purple-100 text-purple-600";
      case "note":
        return "bg-orange-100 text-orange-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.timestamp_c) - new Date(a.timestamp_c)
  );

  return (
    <div className="space-y-4">
      {sortedActivities.map((activity, index) => (
        <motion.div
          key={activity.Id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
className="flex gap-4"
        >
          <div className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${getActivityColor(
                activity.type_c
              )}`}
            >
              <ApperIcon name={getActivityIcon(activity.type_c)} size={18} />
            </div>
            {index < sortedActivities.length - 1 && (
              <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
            )}
          </div>

          <div className="flex-1 pb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 capitalize">
                  {activity.type_c}
                </h4>
                <span className="text-sm text-secondary">
                  {format(new Date(activity.timestamp_c), "MMM d, h:mm a")}
                </span>
              </div>
              <p className="text-sm text-secondary">{activity.description_c}</p>
            </div>
          </div>
        </motion.div>
      ))}

      {sortedActivities.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon
            name="Activity"
            size={48}
            className="text-gray-300 mx-auto mb-3"
          />
          <p className="text-secondary">No activity history</p>
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;