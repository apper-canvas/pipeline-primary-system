import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import SalesOrderModal from "@/components/organisms/SalesOrderModal";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import salesOrderService from "@/services/api/salesOrderService";
import companyService from "@/services/api/companyService";
import contactService from "@/services/api/contactService";

const SalesOrders = () => {
  const authMethods = useContext(AuthContext);
  const { isInitialized, userId } = authMethods || {};
  const [orders, setOrders] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortField, setSortField] = useState("totalAmount");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const [ordersData, companiesData, contactsData] = await Promise.all([
        salesOrderService.getAll(),
        companyService.getAll(),
        contactService.getAll(),
      ]);
      setOrders(ordersData);
      setCompanies(companiesData);
      setContacts(contactsData);
      setFilteredOrders(ordersData);
    } catch (err) {
      setError(err.message || "Failed to load sales orders");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredOrders(orders);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = orders.filter((order) => {
      const customer = companies.find((c) => c.Id === order.customer_c?.Id);
      const contact = contacts.find((c) => c.Id === order.contact_c?.Id);
      return (
        order.order_number_c?.toLowerCase().includes(lowerQuery) ||
        customer?.name_c?.toLowerCase().includes(lowerQuery) ||
        contact?.name_c?.toLowerCase().includes(lowerQuery)
      );
    });
    setFilteredOrders(filtered);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1;
    if (sortField === "totalAmount") {
      return (a.total_amount_c - b.total_amount_c) * direction;
    }
    if (sortField === "orderDate") {
      return (new Date(a.order_date_c) - new Date(b.order_date_c)) * direction;
    }
    return 0;
  });

  const handleAddOrder = () => {
    setSelectedOrder(null);
    setModalOpen(true);
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleSaveOrder = async (orderData) => {
    try {
      if (selectedOrder) {
        await salesOrderService.update(selectedOrder.Id, orderData);
        toast.success("Sales order updated successfully!");
      } else {
        await salesOrderService.create(orderData);
        toast.success("Sales order added successfully!");
      }
      setModalOpen(false);
      setSelectedOrder(null);
      loadOrders();
    } catch (err) {
      toast.error("Failed to save sales order");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this sales order?")) {
      try {
        await salesOrderService.delete(orderId);
        toast.success("Sales order deleted successfully!");
        loadOrders();
      } catch (err) {
        toast.error("Failed to delete sales order");
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const getCustomer = (customerId) => {
    return companies.find((c) => c.Id === customerId);
  };

  const getContact = (contactId) => {
    return contacts.find((c) => c.Id === contactId);
  };

  const getStatusVariant = (status) => {
    const variants = {
      draft: "secondary",
      confirmed: "primary",
      shipped: "accent",
      delivered: "success",
      cancelled: "error",
    };
    return variants[status] || "secondary";
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadOrders} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Orders</h1>
          <p className="text-secondary">
            Manage and track all your sales orders
          </p>
        </div>
        <Button onClick={handleAddOrder}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Sales Order
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <SearchBar placeholder="Search orders..." onSearch={handleSearch} />
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <Empty
          title="No sales orders found"
          description="Create your first sales order to start tracking your sales."
          icon="ShoppingCart"
          action={{
            label: "Add Sales Order",
            icon: "Plus",
            onClick: handleAddOrder,
          }}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleSort("totalAmount")}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary"
              >
                Sort by Amount
                <ApperIcon
                  name={sortDirection === "asc" ? "ArrowUp" : "ArrowDown"}
                  size={14}
                />
              </button>
              <button
                onClick={() => handleSort("orderDate")}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary"
              >
                Sort by Date
                <ApperIcon
                  name={sortDirection === "asc" ? "ArrowUp" : "ArrowDown"}
                  size={14}
                />
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {sortedOrders.map((order, index) => {
              const customer = getCustomer(order.customer_c?.Id);
              const contact = getContact(order.contact_c?.Id);
              return (
                <motion.div
                  key={order.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {order.order_number_c}
                      </h3>
                      {customer && (
                        <p className="text-sm text-secondary flex items-center gap-2">
                          <ApperIcon name="Building2" size={14} />
                          {customer.name_c}
                        </p>
                      )}
                      {contact && (
                        <p className="text-sm text-secondary flex items-center gap-2 mt-1">
                          <ApperIcon name="User" size={14} />
                          {contact.name_c}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditOrder(order)}
                        disabled={order.Owner?.Id !== userId}
                        className={order.Owner?.Id !== userId ? "opacity-50 cursor-not-allowed" : ""}
                      >
                        <ApperIcon name="Edit2" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteOrder(order.Id)}
                        disabled={order.Owner?.Id !== userId}
                        className={`text-red-600 hover:bg-red-50 ${order.Owner?.Id !== userId ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-secondary mb-1">Total Amount</p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(order.total_amount_c)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-secondary mb-1">Status</p>
                      <Badge variant={getStatusVariant(order.status_c)}>
                        {order.status_c.charAt(0).toUpperCase() + order.status_c.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-secondary mb-1">Order Date</p>
                      <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                        <ApperIcon name="Calendar" size={14} />
                        {format(new Date(order.order_date_c), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  {(order.shipping_address_c || order.billing_address_c) && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                      {order.shipping_address_c && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Shipping Address</p>
                          <p className="text-sm text-secondary whitespace-pre-line">
                            {order.shipping_address_c}
                          </p>
                        </div>
                      )}
                      {order.billing_address_c && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Billing Address</p>
                          <p className="text-sm text-secondary whitespace-pre-line">
                            {order.billing_address_c}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {order.notes_c && (
                    <p className="mt-4 text-sm text-secondary border-t pt-4">
                      {order.notes_c}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sales Order Modal */}
      <SalesOrderModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedOrder(null);
        }}
        onSave={handleSaveOrder}
        order={selectedOrder}
        companies={companies}
        contacts={contacts}
      />
    </div>
  );
};

export default SalesOrders;