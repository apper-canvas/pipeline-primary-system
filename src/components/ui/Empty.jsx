import ApperIcon from "@/components/ApperIcon";

const Empty = ({ title, description, action, icon = "Inbox" }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <ApperIcon name={icon} className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title || "No data found"}
        </h3>
        <p className="text-secondary mb-6">
          {description || "Get started by adding your first item."}
        </p>
        {action && (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ApperIcon name={action.icon || "Plus"} size={16} />
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default Empty;