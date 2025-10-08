import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
const DealModal = ({ isOpen, onClose, onSave, deal = null, contacts = [] }) => {
  const [formData, setFormData] = useState({
    title: "",
    contactId: "",
    value: "",
    stage: "lead",
    probability: "",
    expectedCloseDate: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

const [originalStage, setOriginalStage] = useState("");
  const [generatingEmail, setGeneratingEmail] = useState(false);

  useEffect(() => {
    if (deal) {
      const dealStage = deal.stage || "lead";
      setFormData({
        title: deal.title || "",
        contactId: deal.contactId || "",
        value: deal.value || "",
        stage: dealStage,
        probability: deal.probability || "",
        expectedCloseDate: deal.expectedCloseDate || "",
        notes: deal.notes || "",
      });
      setOriginalStage(dealStage);
    } else {
      setFormData({
        title: "",
        contactId: "",
        value: "",
        stage: "lead",
        probability: "",
        expectedCloseDate: "",
        notes: "",
      });
      setOriginalStage("");
    }
    setErrors({});
    setGeneratingEmail(false);
  }, [deal, isOpen]);

const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Detect stage change and generate email template
    if (name === 'stage' && value !== originalStage && formData.title && deal) {
      setGeneratingEmail(true);
      try {
        const { ApperClient } = window.ApperSDK;
        const apperClient = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });

        const result = await apperClient.functions.invoke(
          import.meta.env.VITE_GENERATE_DEAL_EMAIL,
          {
            body: JSON.stringify({
              dealTitle: formData.title,
              stage: value
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (result.success && result.emailTemplate) {
          setFormData((prev) => ({
            ...prev,
            notes: result.emailTemplate
          }));
          toast.success("Email template generated successfully!");
        } else {
          console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_GENERATE_DEAL_EMAIL}. The response body is: ${JSON.stringify(result)}.`);
          toast.error(result.message || "Failed to generate email template");
        }
      } catch (error) {
        console.info(`apper_info: Got this error in this function: ${import.meta.env.VITE_GENERATE_DEAL_EMAIL}. The error is: ${error.message}`);
        toast.error("Failed to generate email template");
      } finally {
        setGeneratingEmail(false);
      }
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Deal title is required";
    }
    if (!formData.contactId) {
      newErrors.contactId = "Contact is required";
    }
    if (!formData.value || formData.value <= 0) {
      newErrors.value = "Deal value must be greater than 0";
    }
    if (!formData.probability || formData.probability < 0 || formData.probability > 100) {
      newErrors.probability = "Probability must be between 0 and 100";
    }
    if (!formData.expectedCloseDate) {
      newErrors.expectedCloseDate = "Expected close date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        value: parseFloat(formData.value),
        contactId: parseInt(formData.contactId),
        probability: parseInt(formData.probability),
      });
    }
  };

// Show generating message in notes field
  const notesPlaceholder = generatingEmail 
    ? "Generating email template..." 
    : "Add notes about this deal...";

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 0 }}
          className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {deal ? "Edit Deal" : "Add New Deal"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <FormField
              label="Deal Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              required
              placeholder="Enterprise Software Package"
            />

            <FormField label="Contact" required error={errors.contactId}>
              <select
                name="contactId"
                value={formData.contactId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a contact</option>
                {contacts.map((contact) => (
                  <option key={contact.Id} value={contact.Id}>
                    {contact.name} - {contact.company}
                  </option>
                ))}
              </select>
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Deal Value"
                name="value"
                type="number"
                value={formData.value}
                onChange={handleChange}
                error={errors.value}
                required
                placeholder="50000"
              />

              <FormField
                label="Probability (%)"
                name="probability"
                type="number"
                value={formData.probability}
                onChange={handleChange}
                error={errors.probability}
                required
                placeholder="70"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Stage" required>
                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="lead">Lead</option>
                  <option value="qualified">Qualified</option>
                  <option value="proposal">Proposal</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="closed">Closed Won</option>
                </select>
              </FormField>

              <FormField
                label="Expected Close Date"
                name="expectedCloseDate"
                type="date"
                value={formData.expectedCloseDate}
                onChange={handleChange}
                error={errors.expectedCloseDate}
                required
              />
            </div>

            <FormField label="Notes">
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Add notes about this deal..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </FormField>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                <ApperIcon name="Save" size={16} className="mr-2" />
                {deal ? "Update Deal" : "Add Deal"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DealModal;