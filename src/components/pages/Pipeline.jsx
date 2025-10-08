import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import PipelineBoard from "@/components/organisms/PipelineBoard";
import DealModal from "@/components/organisms/DealModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import dealService from "@/services/api/dealService";
import contactService from "@/services/api/contactService";
import activityService from "@/services/api/activityService";

const Pipeline = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

  useEffect(() => {
    loadPipelineData();
  }, []);

  const loadPipelineData = async () => {
    setLoading(true);
    setError("");
    try {
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(),
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message || "Failed to load pipeline data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeal = () => {
    setSelectedDeal(null);
    setModalOpen(true);
  };

  const handleEditDeal = (deal) => {
    setSelectedDeal(deal);
    setModalOpen(true);
  };

  const handleSaveDeal = async (dealData) => {
    try {
      if (selectedDeal) {
        await dealService.update(selectedDeal.Id, dealData);
        await activityService.create({
          contactId: dealData.contactId,
          dealId: selectedDeal.Id,
          type: "note",
          description: `Deal updated: ${dealData.title}`,
        });
        toast.success("Deal updated successfully!");
      } else {
        const newDeal = await dealService.create(dealData);
        await activityService.create({
          contactId: dealData.contactId,
          dealId: newDeal.Id,
          type: "note",
          description: `New deal created: ${dealData.title}`,
        });
        toast.success("Deal added successfully!");
      }
      setModalOpen(false);
      setSelectedDeal(null);
      loadPipelineData();
    } catch (err) {
      toast.error("Failed to save deal");
    }
  };

  const handleDeleteDeal = async (dealId) => {
    if (window.confirm("Are you sure you want to delete this deal?")) {
      try {
        await dealService.delete(dealId);
        toast.success("Deal deleted successfully!");
        loadPipelineData();
      } catch (err) {
        toast.error("Failed to delete deal");
      }
    }
  };

  const handleUpdateStage = async (dealId, newStage) => {
    try {
      const deal = deals.find((d) => d.Id === dealId);
      await dealService.updateStage(dealId, newStage);
      await activityService.create({
        contactId: deal.contactId,
        dealId: dealId,
        type: "note",
        description: `Deal moved to ${newStage} stage`,
      });
      toast.success(`Deal moved to ${newStage} stage!`);
      loadPipelineData();
    } catch (err) {
      toast.error("Failed to update deal stage");
    }
  };

  if (loading) return <Loading type="pipeline" />;
  if (error) return <Error message={error} onRetry={loadPipelineData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pipeline</h1>
          <p className="text-secondary">
            Drag and drop deals to update their stage
          </p>
        </div>
        <Button onClick={handleAddDeal}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Deal
        </Button>
      </div>

      {/* Pipeline Board */}
      {deals.length === 0 ? (
        <Empty
          title="No deals in pipeline"
          description="Start building your pipeline by adding your first deal opportunity."
          icon="GitBranch"
          action={{
            label: "Add Deal",
            icon: "Plus",
            onClick: handleAddDeal,
          }}
        />
      ) : (
        <PipelineBoard
          deals={deals}
          contacts={contacts}
          onUpdateStage={handleUpdateStage}
          onEdit={handleEditDeal}
          onDelete={handleDeleteDeal}
        />
      )}

      {/* Deal Modal */}
      <DealModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedDeal(null);
        }}
        onSave={handleSaveDeal}
        deal={selectedDeal}
        contacts={contacts}
      />
    </div>
  );
};

export default Pipeline;