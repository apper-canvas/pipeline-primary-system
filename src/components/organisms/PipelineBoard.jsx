import { useState } from "react";
import DealCard from "./DealCard";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const PipelineBoard = ({ deals, contacts, onUpdateStage, onEdit, onDelete, userId }) => {
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  const stages = [
    { id: "lead", label: "Lead", color: "blue" },
    { id: "qualified", label: "Qualified", color: "yellow" },
    { id: "proposal", label: "Proposal", color: "orange" },
    { id: "negotiation", label: "Negotiation", color: "purple" },
    { id: "closed", label: "Closed Won", color: "green" },
  ];

const getStageDeals = (stageId) => {
    return deals.filter((deal) => deal.stage_c === stageId);
  };

const getStageTotalValue = (stageId) => {
    const stageDeals = getStageDeals(stageId);
    const total = stageDeals.reduce((sum, deal) => sum + deal.value_c, 0);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(total);
  };

const handleDragStart = (e, deal) => {
    // Prevent dragging deals not owned by current user
    if (deal.Owner?.Id !== userId) {
      return;
    }
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e, stageId) => {
    e.preventDefault();
    setDragOverStage(stageId);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

const handleDrop = async (e, stageId) => {
    e.preventDefault();
    setDragOverStage(null);

    if (draggedDeal && draggedDeal.stage_c !== stageId) {
      // Verify ownership before updating stage
      if (draggedDeal.Owner?.Id === userId) {
        await onUpdateStage(draggedDeal.Id, stageId);
      }
    }
    setDraggedDeal(null);
  };

  const getContactForDeal = (contactId) => {
    return contacts.find((c) => c.Id === contactId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stages.map((stage) => {
        const stageDeals = getStageDeals(stage.id);
        const isOver = dragOverStage === stage.id;

        return (
          <div
            key={stage.id}
            className={`bg-gray-50 rounded-lg p-4 transition-all ${
              isOver ? "ring-2 ring-primary bg-blue-50" : ""
            }`}
            onDragOver={(e) => handleDragOver(e, stage.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full bg-${stage.color}-500`}
                  ></div>
                  {stage.label}
                </h3>
                <span className="text-sm font-medium text-secondary">
                  {stageDeals.length}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-700">
                {getStageTotalValue(stage.id)}
              </p>
            </div>

            <div className="space-y-3 min-h-[200px]">
              {stageDeals.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                  <ApperIcon name="Inbox" size={32} className="mb-2" />
                  <p className="text-sm">No deals</p>
                </div>
              ) : (
stageDeals.map((deal) => (
                  <div
                    key={deal.Id}
                    draggable={deal.Owner?.Id === userId}
                    onDragStart={(e) => handleDragStart(e, deal)}
                    className={deal.Owner?.Id !== userId ? "opacity-60 cursor-not-allowed" : "cursor-move"}
                  >
                    <DealCard
                      deal={deal}
                      contact={getContactForDeal(deal.contactId)}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      isDragging={draggedDeal?.Id === deal.Id}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PipelineBoard;