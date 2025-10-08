import React, { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import DealCard from "@/components/organisms/DealCard";
import dealService from "@/services/api/dealService";
const PipelineBoard = ({ deals, contacts, onUpdateStage, onEdit, onDelete }) => {
  const { user } = useSelector((state) => state.user);
  const userId = user?.userId;
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
const handleDragStart = (e, deal) => {
    // Check authorization - only allow dragging deals owned by current user
    if (deal.Owner?.Id !== userId) {
      e.preventDefault();
      toast.error('You can only move deals that you own');
      return;
    }
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('dealId', deal.Id.toString());
    setDraggedDeal(deal);
  };

  const handleDragOver = (e, stageId) => {
    // Prevent default to allow dropping
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Highlight the drop zone
    if (dragOverStage !== stageId) {
      setDragOverStage(stageId);
    }
  };

  const handleDragLeave = () => {
    // Clear highlight when leaving drop zone
    setDragOverStage(null);
  };

  const handleDrop = async (e, stageId) => {
    e.preventDefault();
    
    // Get the deal ID from drag data
    const dealId = parseInt(e.dataTransfer.getData('dealId'));
    
    if (draggedDeal && draggedDeal.stage_c !== stageId) {
      try {
        // Update the deal stage via service
        const updated = await dealService.updateStage(dealId, stageId);
        
        if (updated) {
          toast.success('Deal stage updated successfully');
          // Trigger parent component to refresh data
          await onUpdateStage(dealId, stageId);
        } else {
          toast.error('Failed to update deal stage');
        }
      } catch (error) {
        console.error('Error updating deal stage:', error);
        toast.error('An error occurred while updating the deal stage');
      }
    }
    
    // Clear drag states
    setDraggedDeal(null);
    setDragOverStage(null);
  };

  const getContactForDeal = (contactId) => {
    if (!contactId) return null;
    return contacts?.find((contact) => contact.Id === contactId) || null;
  };

  return (

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
className={`flex-1 bg-gray-50 rounded-lg p-4 min-h-[calc(100vh-280px)] transition-all ${
                dragOverStage === stage.id 
                  ? "ring-2 ring-primary ring-offset-2 bg-blue-50" 
                  : ""
              }`}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-3 h-3 rounded-full ${stage.color}`}></span>
                  <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                  <span className="text-sm text-secondary">
                    ({stageDeals.length})
                  </span>
                </div>
                <div className="text-right">
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