import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import DealModal from "@/components/organisms/DealModal";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import dealService from "@/services/api/dealService";
import contactService from "@/services/api/contactService";

const Deals = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [sortField, setSortField] = useState("value");
  const [sortDirection, setSortDirection] = useState("desc");
  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    setLoading(true);
    setError("");
    try {
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(),
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
      setFilteredDeals(dealsData);
    } catch (err) {
      setError(err.message || "Failed to load deals");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredDeals(deals);
      return;
    }

    const lowerQuery = query.toLowerCase();
const filtered = deals.filter((d) => {
      const contact = contacts.find((c) => c.Id === d.contactId);
      return (
        d.title_c.toLowerCase().includes(lowerQuery) ||
        contact?.name_c.toLowerCase().includes(lowerQuery) ||
        contact?.company_c.toLowerCase().includes(lowerQuery)
      );
    });
    setFilteredDeals(filtered);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

const sortedDeals = [...filteredDeals].sort((a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1;
    if (sortField === "value") {
      return (a.value_c - b.value_c) * direction;
    }
    if (sortField === "expectedCloseDate") {
      return (new Date(a.expected_close_date_c) - new Date(b.expected_close_date_c)) * direction;
    }
    return 0;
  });

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
        toast.success("Deal updated successfully!");
      } else {
        await dealService.create(dealData);
        toast.success("Deal added successfully!");
      }
      setModalOpen(false);
      setSelectedDeal(null);
      loadDeals();
    } catch (err) {
      toast.error("Failed to save deal");
    }
  };

  const handleDeleteDeal = async (dealId) => {
    if (window.confirm("Are you sure you want to delete this deal?")) {
      try {
        await dealService.delete(dealId);
        toast.success("Deal deleted successfully!");
        loadDeals();
      } catch (err) {
        toast.error("Failed to delete deal");
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getContact = (contactId) => {
    return contacts.find((c) => c.Id === contactId);
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadDeals} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Deals</h1>
          <p className="text-secondary">
            Track all your deals and opportunities
          </p>
        </div>
        <Button onClick={handleAddDeal}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Deal
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <SearchBar placeholder="Search deals..." onSearch={handleSearch} />
      </div>

      {/* Deals Grid */}
      {filteredDeals.length === 0 ? (
        <Empty
          title="No deals found"
          description="Create your first deal opportunity to start tracking your sales pipeline."
          icon="DollarSign"
          action={{
            label: "Add Deal",
            icon: "Plus",
            onClick: handleAddDeal,
          }}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleSort("value")}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary"
              >
                Sort by Value
                <ApperIcon
                  name={sortDirection === "asc" ? "ArrowUp" : "ArrowDown"}
                  size={14}
                />
              </button>
              <button
                onClick={() => handleSort("expectedCloseDate")}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary"
              >
                Sort by Close Date
                <ApperIcon
                  name={sortDirection === "asc" ? "ArrowUp" : "ArrowDown"}
                  size={14}
                />
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {sortedDeals.map((deal, index) => {
              const contact = getContact(deal.contactId);
              return (
                <motion.div
                  key={deal.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
<div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {deal.title_c}
                      </h3>
                      {contact && (
                        <p className="text-sm text-secondary flex items-center gap-2">
                          <ApperIcon name="Building2" size={14} />
                          {contact.name_c} - {contact.company_c}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditDeal(deal)}
                        disabled={deal.Owner?.Id !== userId}
                        className={deal.Owner?.Id !== userId ? "opacity-50 cursor-not-allowed" : ""}
                      >
                        <ApperIcon name="Edit2" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDeal(deal.Id)}
                        disabled={deal.Owner?.Id !== userId}
                        className={`text-red-600 hover:bg-red-50 ${deal.Owner?.Id !== userId ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>

<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-secondary mb-1">Value</p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(deal.value_c)}
                      </p>
                    </div>
                    <div>
                    <p className="text-sm text-secondary mb-1">Stage</p>
                    <Badge variant={deal.stage_c}>
                      {deal.stage_c.charAt(0).toUpperCase() + deal.stage_c.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-secondary mb-1">Probability</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {deal.probability_c}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary mb-1">Expected Close</p>
                    <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                      <ApperIcon name="Calendar" size={14} />
                      {format(new Date(deal.expected_close_date_c), "MMM d, yyyy")}
</p>
                  </div>
                  </div>

                  {deal.notes_c && (
                    <p className="mt-4 text-sm text-secondary border-t pt-4">
                      {deal.notes_c}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
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

export default Deals;