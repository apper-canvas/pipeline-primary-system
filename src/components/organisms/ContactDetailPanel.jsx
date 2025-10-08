import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ActivityTimeline from "@/components/organisms/ActivityTimeline";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import activityService from "@/services/api/activityService";
import dealService from "@/services/api/dealService";

const ContactDetailPanel = ({ contact, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [activities, setActivities] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contact) {
      loadContactData();
    }
  }, [contact]);

  const loadContactData = async () => {
    setLoading(true);
    try {
      const [contactActivities, contactDeals] = await Promise.all([
        activityService.getByContactId(contact.Id),
        dealService.getByContactId(contact.Id),
      ]);
      setActivities(contactActivities);
      setDeals(contactDeals);
    } catch (error) {
      console.error("Error loading contact data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (!contact) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, y: "100%", scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: "100%", scale: 0.95 }}
          className="relative bg-white rounded-t-2xl sm:rounded-lg shadow-xl w-full sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
<div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-blue-700 rounded-full text-white text-xl font-bold">
                {contact.name_c
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {contact.name_c}
                </h2>
                <p className="text-secondary">{contact.company_c}</p>
              </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => onEdit(contact)}>
                  <ApperIcon name="Edit2" size={16} className="mr-2" />
                  Edit
                </Button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200 -mb-[1px]">
              {["info", "deals", "activity"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 px-1 font-medium text-sm transition-colors border-b-2 ${
                    activeTab === tab
                      ? "text-primary border-primary"
                      : "text-secondary border-transparent hover:text-gray-900"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "info" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
<div className="flex items-center gap-3 text-secondary">
                    <ApperIcon name="Mail" size={18} />
                    <a
                      href={`mailto:${contact.email_c}`}
                      className="hover:text-primary"
                    >
                      {contact.email_c}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-secondary">
                    <ApperIcon name="Phone" size={18} />
                    <a
                      href={`tel:${contact.phone_c}`}
                      className="hover:text-primary"
                    >
                      {contact.phone_c}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-secondary">
                    <ApperIcon name="Building2" size={18} />
                    <span>{contact.company_c}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
                  Status
                </h3>
                <Badge variant={contact.status_c}>
                  {contact.status_c.charAt(0).toUpperCase() +
                    contact.status_c.slice(1)}
                </Badge>
              </div>

{contact.tags && contact.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {contact.tags.map((tag, i) => (
                      <Badge key={i} variant="default">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {contact.notes_c && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
                    Notes
                  </h3>
                  <p className="text-secondary">{contact.notes_c}</p>
                </div>
              )}
              </div>
            )}

            {activeTab === "deals" && (
              <div className="space-y-4">
                {loading ? (
                  <Loading type="default" />
                ) : deals.length === 0 ? (
                  <div className="text-center py-12">
                    <ApperIcon
                      name="DollarSign"
                      size={48}
                      className="text-gray-300 mx-auto mb-3"
                    />
                    <p className="text-secondary">No deals found</p>
                  </div>
                ) : (
                  deals.map((deal) => (
                    <div
                      key={deal.Id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
<h4 className="font-semibold text-gray-900">
                      {deal.title_c}
                    </h4>
                    <Badge variant={deal.stage_c}>
                      {deal.stage_c.charAt(0).toUpperCase() +
                        deal.stage_c.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    {formatCurrency(deal.value_c)}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-secondary">
                    <span className="flex items-center gap-1">
                      <ApperIcon name="Target" size={14} />
                      {deal.probability_c}% probability
                    </span>
                    <span className="flex items-center gap-1">
                      <ApperIcon name="Calendar" size={14} />
                      Close: {deal.expected_close_date_c}
                    </span>
                  </div>
                </div>
              ))
                  ))
                )}
              </div>
            )}

            {activeTab === "activity" && (
              <div>
                {loading ? (
                  <Loading type="default" />
                ) : (
                  <ActivityTimeline activities={activities} />
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ContactDetailPanel;