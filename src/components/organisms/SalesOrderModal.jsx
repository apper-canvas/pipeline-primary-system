import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import quoteService from "@/services/api/quoteService";
import companyService from "@/services/api/companyService";
import contactService from "@/services/api/contactService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";

export default function SalesOrderModal({ isOpen, onClose, onCreate, onUpdate, editingOrder = null }) {
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
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
    quoteId: "",
  });
useEffect(() => {
    if (editingOrder) {
      setFormData({
        orderNumber: editingOrder.order_number_c || "",
        orderDate: editingOrder.order_date_c || "",
        customerId: editingOrder.customer_c?.Id || editingOrder.customer_c || "",
        contactId: editingOrder.contact_c?.Id || editingOrder.contact_c || "",
        totalAmount: editingOrder.total_amount_c || "",
        status: editingOrder.status_c || "draft",
        shippingAddress: editingOrder.shipping_address_c || "",
        billingAddress: editingOrder.billing_address_c || "",
        notes: editingOrder.notes_c || "",
        quoteId: editingOrder.quotes_c?.Id || "",
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
        quoteId: "",
      });
    }
  }, [editingOrder]);

  useEffect(() => {
    const loadData = async () => {
      const [companiesData, contactsData, quotesData] = await Promise.all([
        companyService.getAll(),
        contactService.getAll(),
        quoteService.getAll()
      ]);
      setCompanies(companiesData);
      setContacts(contactsData);
      setQuotes(quotesData);
    };
loadData();
  }, []);

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

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const orderData = {
        ...formData,
        totalAmount: parseFloat(formData.totalAmount),
        customerId: parseInt(formData.customerId),
        contactId: parseInt(formData.contactId),
        quoteId: formData.quoteId ? parseInt(formData.quoteId) : null,
      };

      if (editingOrder) {
        await onUpdate(editingOrder.Id, orderData);
        toast.success("Sales order updated successfully");
      } else {
        await onCreate(orderData);
        toast.success("Sales order created successfully");
      }
      onClose();
    } catch (error) {
      console.error("Error saving sales order:", error);
      toast.error(error.message || "Failed to save sales order");
    } finally {
      setLoading(false);
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
              {editingOrder ? "Edit Sales Order" : "Add New Sales Order"}
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
            <FormField
              label="Quote"
              error={errors.quoteId}
            >
              <select
                value={formData.quoteId}
                onChange={(e) => setFormData({ ...formData, quoteId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a quote</option>
                {quotes.map((quote) => (
                  <option key={quote.Id} value={quote.Id}>
                    {quote.Name}
                  </option>
                ))}
              </select>
            </FormField>

<div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                <ApperIcon name="Save" size={16} className="mr-2" />
                {loading ? "Saving..." : editingOrder ? "Update Order" : "Add Order"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};