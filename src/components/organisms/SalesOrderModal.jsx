import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";

const SalesOrderModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  order = null, 
  companies = [], 
  contacts = [] 
}) => {
  const [formData, setFormData] = useState({
    orderNumber: "",
    orderDate: "",
    customerId: "",
    contactId: "",
    totalAmount: "",
    status: "draft",
    shippingAddress: "",
    billingAddress: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (order) {
      setFormData({
        orderNumber: order.order_number_c || "",
        orderDate: order.order_date_c || "",
        customerId: order.customer_c?.Id || order.customer_c || "",
        contactId: order.contact_c?.Id || order.contact_c || "",
        totalAmount: order.total_amount_c || "",
        status: order.status_c || "draft",
        shippingAddress: order.shipping_address_c || "",
        billingAddress: order.billing_address_c || "",
        notes: order.notes_c || "",
      });
    } else {
      setFormData({
        orderNumber: "",
        orderDate: "",
        customerId: "",
        contactId: "",
        totalAmount: "",
        status: "draft",
        shippingAddress: "",
        billingAddress: "",
        notes: "",
      });
    }
    setErrors({});
  }, [order, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.orderNumber.trim()) {
      newErrors.orderNumber = "Order number is required";
    }
    if (!formData.orderDate) {
      newErrors.orderDate = "Order date is required";
    }
    if (!formData.customerId) {
      newErrors.customerId = "Customer is required";
    }
    if (!formData.contactId) {
      newErrors.contactId = "Contact is required";
    }
    if (!formData.totalAmount || formData.totalAmount <= 0) {
      newErrors.totalAmount = "Total amount must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        totalAmount: parseFloat(formData.totalAmount),
        customerId: parseInt(formData.customerId),
        contactId: parseInt(formData.contactId),
      });
    }
  };

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
              {order ? "Edit Sales Order" : "Add New Sales Order"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Order Number"
                name="orderNumber"
                value={formData.orderNumber}
                onChange={handleChange}
                error={errors.orderNumber}
                required
                placeholder="SO-2024-001"
              />

              <FormField
                label="Order Date"
                name="orderDate"
                type="date"
                value={formData.orderDate}
                onChange={handleChange}
                error={errors.orderDate}
                required
              />
            </div>

            <FormField label="Customer" required error={errors.customerId}>
              <select
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a customer</option>
                {companies.map((company) => (
                  <option key={company.Id} value={company.Id}>
                    {company.name_c}
                  </option>
                ))}
              </select>
            </FormField>

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
                    {contact.name_c} - {contact.company_c?.Name || contact.company_c}
                  </option>
                ))}
              </select>
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Total Amount"
                name="totalAmount"
                type="number"
                step="0.01"
                value={formData.totalAmount}
                onChange={handleChange}
                error={errors.totalAmount}
                required
                placeholder="5000.00"
              />

              <FormField label="Status" required>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </FormField>
            </div>

            <FormField label="Shipping Address">
              <textarea
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleChange}
                rows={3}
                placeholder="Enter shipping address..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </FormField>

            <FormField label="Billing Address">
              <textarea
                name="billingAddress"
                value={formData.billingAddress}
                onChange={handleChange}
                rows={3}
                placeholder="Enter billing address..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </FormField>

            <FormField label="Notes">
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Add notes about this order..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </FormField>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                <ApperIcon name="Save" size={16} className="mr-2" />
                {order ? "Update Order" : "Add Order"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SalesOrderModal;