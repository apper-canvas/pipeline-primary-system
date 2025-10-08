import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { format } from "date-fns";
import { motion } from "framer-motion";

const DealCard = ({ deal, contact, onEdit, onDelete, isDragging = false }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getDaysInStage = () => {
    const created = new Date(deal.updatedAt);
    const now = new Date();
    const diff = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: isDragging ? 1 : 1.02 }}
      className={`bg-white rounded-lg p-4 shadow-sm border-l-4 cursor-move transition-shadow hover:shadow-md ${
        deal.stage === "lead"
          ? "border-blue-500"
          : deal.stage === "qualified"
          ? "border-yellow-500"
          : deal.stage === "proposal"
          ? "border-orange-500"
          : deal.stage === "negotiation"
          ? "border-purple-500"
          : "border-green-500"
      } ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
            {deal.title}
          </h4>
          {contact && (
            <p className="text-sm text-secondary flex items-center gap-1">
              <ApperIcon name="Building2" size={14} />
              {contact.company}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={() => onEdit(deal)}
            className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded transition-colors"
          >
            <ApperIcon name="Edit2" size={14} />
          </button>
          <button
            onClick={() => onDelete(deal.Id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <ApperIcon name="Trash2" size={14} />
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            {formatCurrency(deal.value)}
          </span>
          <Badge variant={deal.stage}>{deal.probability}%</Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-secondary">
          <ApperIcon name="Calendar" size={14} />
          <span>Close: {format(new Date(deal.expectedCloseDate), "MMM d")}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-secondary">
          <ApperIcon name="Clock" size={14} />
          <span>{getDaysInStage()} days in stage</span>
        </div>
      </div>

      {deal.notes && (
        <p className="text-sm text-secondary line-clamp-2 border-t pt-2">
          {deal.notes}
        </p>
      )}
    </motion.div>
  );
};

export default DealCard;