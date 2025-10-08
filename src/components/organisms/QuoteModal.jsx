import { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const QuoteModal = ({ quote, onClose, onSave, companies = [], contacts = [], deals = [] }) => {
  const [formData, setFormData] = useState({
    name: "",
    tags: "",
    companyId: "",
    contactId: "",
    dealId: "",
    quoteDate: "",
    status: "Draft",
    deliveryMethod: "",
    expiresOn: "",
    billingName: "",
    billingStreet: "",
    billingCity: "",
    billingState: "",
    billingCountry: "",
    billingPincode: "",
    shippingName: "",
    shippingStreet: "",
    shippingCity: "",
    shippingState: "",
    shippingCountry: "",
    shippingPincode: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (quote) {
      setFormData({
        name: quote.Name || "",
        tags: quote.Tags || "",
        companyId: quote.company_c?.Id || quote.company_c || "",
        contactId: quote.contact_c?.Id || quote.contact_c || "",
        dealId: quote.deal_c?.Id || quote.deal_c || "",
        quoteDate: quote.quote_date_c || "",
        status: quote.status_c || "Draft",
        deliveryMethod: quote.delivery_method_c || "",
        expiresOn: quote.expires_on_c || "",
        billingName: quote.billing_name_c || "",
        billingStreet: quote.billing_street_c || "",
        billingCity: quote.billing_city_c || "",
        billingState: quote.billing_state_c || "",
        billingCountry: quote.billing_country_c || "",
        billingPincode: quote.billing_pincode_c || "",
        shippingName: quote.shipping_name_c || "",
        shippingStreet: quote.shipping_street_c || "",
        shippingCity: quote.shipping_city_c || "",
        shippingState: quote.shipping_state_c || "",
        shippingCountry: quote.shipping_country_c || "",
        shippingPincode: quote.shipping_pincode_c || ""
      });
    }
  }, [quote]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.companyId) {
      newErrors.companyId = "Company is required";
    }
    if (!formData.contactId) {
      newErrors.contactId = "Contact is required";
    }
    if (!formData.dealId) {
      newErrors.dealId = "Deal is required";
    }
    if (!formData.quoteDate) {
      newErrors.quoteDate = "Quote date is required";
    }
    if (!formData.status) {
      newErrors.status = "Status is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      const quoteData = {
        name: formData.name.trim(),
        tags: formData.tags.split(",").map(t => t.trim()).filter(t => t),
        companyId: formData.companyId,
        contactId: formData.contactId,
        dealId: formData.dealId,
        quoteDate: formData.quoteDate,
        status: formData.status,
        deliveryMethod: formData.deliveryMethod.trim(),
        expiresOn: formData.expiresOn,
        billingName: formData.billingName.trim(),
        billingStreet: formData.billingStreet.trim(),
        billingCity: formData.billingCity.trim(),
        billingState: formData.billingState.trim(),
        billingCountry: formData.billingCountry.trim(),
        billingPincode: formData.billingPincode.trim(),
        shippingName: formData.shippingName.trim(),
        shippingStreet: formData.shippingStreet.trim(),
        shippingCity: formData.shippingCity.trim(),
        shippingState: formData.shippingState.trim(),
        shippingCountry: formData.shippingCountry.trim(),
        shippingPincode: formData.shippingPincode.trim()
      };
      
      await onSave(quoteData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {quote ? "Edit Quote" : "Add Quote"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <ApperIcon name="X" size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Quote name"
                  error={errors.name}
                  disabled={loading}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <Input
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="Separate tags with commas"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company *
                </label>
                <select
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  <option value="">Select company</option>
                  {companies.map((company) => (
                    <option key={company.Id} value={company.Id}>
                      {company.name_c || company.Name}
                    </option>
                  ))}
                </select>
                {errors.companyId && (
                  <p className="mt-1 text-sm text-red-600">{errors.companyId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact *
                </label>
                <select
                  name="contactId"
                  value={formData.contactId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  <option value="">Select contact</option>
                  {contacts.map((contact) => (
                    <option key={contact.Id} value={contact.Id}>
                      {contact.name_c}
                    </option>
                  ))}
                </select>
                {errors.contactId && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deal *
                </label>
                <select
                  name="dealId"
                  value={formData.dealId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  <option value="">Select deal</option>
                  {deals.map((deal) => (
                    <option key={deal.Id} value={deal.Id}>
                      {deal.title_c}
                    </option>
                  ))}
                </select>
                {errors.dealId && (
                  <p className="mt-1 text-sm text-red-600">{errors.dealId}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quote Date *
                </label>
                <Input
                  type="date"
                  name="quoteDate"
                  value={formData.quoteDate}
                  onChange={handleChange}
                  error={errors.quoteDate}
                  disabled={loading}
                />
                {errors.quoteDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.quoteDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expires On
                </label>
                <Input
                  type="date"
                  name="expiresOn"
                  value={formData.expiresOn}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Method
                </label>
                <select
                  name="deliveryMethod"
                  value={formData.deliveryMethod}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  <option value="">Select method</option>
                  <option value="Email">Email</option>
                  <option value="Mail">Mail</option>
                  <option value="In Person">In Person</option>
                </select>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bill To Name
                  </label>
                  <Input
                    name="billingName"
                    value={formData.billingName}
                    onChange={handleChange}
                    placeholder="Recipient name"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street
                  </label>
                  <Input
                    name="billingStreet"
                    value={formData.billingStreet}
                    onChange={handleChange}
                    placeholder="Street address"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <Input
                    name="billingCity"
                    value={formData.billingCity}
                    onChange={handleChange}
                    placeholder="City"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <Input
                    name="billingState"
                    value={formData.billingState}
                    onChange={handleChange}
                    placeholder="State"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <Input
                    name="billingCountry"
                    value={formData.billingCountry}
                    onChange={handleChange}
                    placeholder="Country"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode
                  </label>
                  <Input
                    name="billingPincode"
                    value={formData.billingPincode}
                    onChange={handleChange}
                    placeholder="Pincode"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ship To Name
                  </label>
                  <Input
                    name="shippingName"
                    value={formData.shippingName}
                    onChange={handleChange}
                    placeholder="Recipient name"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street
                  </label>
                  <Input
                    name="shippingStreet"
                    value={formData.shippingStreet}
                    onChange={handleChange}
                    placeholder="Street address"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <Input
                    name="shippingCity"
                    value={formData.shippingCity}
                    onChange={handleChange}
                    placeholder="City"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <Input
                    name="shippingState"
                    value={formData.shippingState}
                    onChange={handleChange}
                    placeholder="State"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <Input
                    name="shippingCountry"
                    value={formData.shippingCountry}
                    onChange={handleChange}
                    placeholder="Country"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode
                  </label>
                  <Input
                    name="shippingPincode"
                    value={formData.shippingPincode}
                    onChange={handleChange}
                    placeholder="Pincode"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading ? "Saving..." : quote ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuoteModal;