import { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const ActivityModal = ({ isOpen, onClose, onSave, activity, contacts = [], deals = [] }) => {
  const [formData, setFormData] = useState({
    type_c: "",
    description_c: "",
    contactId_c: "",
    dealId_c: "",
    timestamp_c: new Date().toISOString().slice(0, 16),
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        type_c: activity.type_c || "",
        description_c: activity.description_c || "",
        contactId_c: activity.contactId_c || "",
        dealId_c: activity.dealId_c || "",
        timestamp_c: activity.timestamp_c
          ? new Date(activity.timestamp_c).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
      });
    } else {
      setFormData({
        type_c: "",
        description_c: "",
        contactId_c: "",
        dealId_c: "",
        timestamp_c: new Date().toISOString().slice(0, 16),
      });
    }
  }, [activity, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.type_c || !formData.description_c) {
      return;
    }
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {activity ? "Edit Activity" : "Add Activity"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activity Type *
            </label>
            <select
              value={formData.type_c}
              onChange={(e) => handleChange("type_c", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="">Select type...</option>
              <option value="email">Email</option>
              <option value="call">Call</option>
              <option value="meeting">Meeting</option>
              <option value="note">Note</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description_c}
              onChange={(e) => handleChange("description_c", e.target.value)}
              placeholder="Describe the activity..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Related Contact
            </label>
            <select
              value={formData.contactId_c}
              onChange={(e) => handleChange("contactId_c", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select contact...</option>
              {contacts.map((contact) => (
                <option key={contact.Id} value={contact.Id}>
                  {contact.name_c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Related Deal
            </label>
            <select
              value={formData.dealId_c}
              onChange={(e) => handleChange("dealId_c", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select deal...</option>
              {deals.map((deal) => (
                <option key={deal.Id} value={deal.Id}>
                  {deal.title_c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date & Time *
            </label>
            <input
              type="datetime-local"
              value={formData.timestamp_c}
              onChange={(e) => handleChange("timestamp_c", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <ApperIcon name="Save" size={20} className="mr-2" />
              Save Activity
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivityModal;