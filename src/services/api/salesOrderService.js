const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const salesOrderService = {
  getAll: async () => {
    try {
      const response = await apperClient.fetchRecords('sales_order_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "order_number_c"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "customer_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "billing_address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "Owner"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching sales orders:", error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const response = await apperClient.getRecordById('sales_order_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "order_number_c"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "customer_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "billing_address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "Owner"}}
        ]
      });

      if (!response.success || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching sales order ${id}:`, error);
      return null;
    }
  },

  create: async (orderData) => {
    try {
      const payload = {
        records: [{
          order_number_c: orderData.orderNumber,
          order_date_c: orderData.orderDate,
          customer_c: parseInt(orderData.customerId),
          contact_c: parseInt(orderData.contactId),
          total_amount_c: parseFloat(orderData.totalAmount),
          status_c: orderData.status,
          shipping_address_c: orderData.shippingAddress || '',
          billing_address_c: orderData.billingAddress || '',
          notes_c: orderData.notes || ''
        }]
      };

      const response = await apperClient.createRecord('sales_order_c', payload);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} sales orders:`, failed);
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating sales order:", error);
      return null;
    }
  },

  update: async (id, orderData) => {
    try {
      const payload = {
        records: [{
          Id: parseInt(id),
          order_number_c: orderData.orderNumber,
          order_date_c: orderData.orderDate,
          customer_c: parseInt(orderData.customerId),
          contact_c: parseInt(orderData.contactId),
          total_amount_c: parseFloat(orderData.totalAmount),
          status_c: orderData.status,
          shipping_address_c: orderData.shippingAddress || '',
          billing_address_c: orderData.billingAddress || '',
          notes_c: orderData.notes || ''
        }]
      };

      const response = await apperClient.updateRecord('sales_order_c', payload);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} sales orders:`, failed);
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating sales order:", error);
      return null;
    }
  },

  delete: async (id) => {
    try {
      const response = await apperClient.deleteRecord('sales_order_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete sales order:`, failed);
          return false;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting sales order:", error);
      return false;
    }
  },
};

export default salesOrderService;