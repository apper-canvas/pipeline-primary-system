const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const quoteService = {
  getAll: async () => {
    try {
      const response = await apperClient.fetchRecords('quote_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "deal_c"}},
          {"field": {"Name": "quote_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "delivery_method_c"}},
          {"field": {"Name": "expires_on_c"}},
          {"field": {"Name": "billing_name_c"}},
          {"field": {"Name": "billing_street_c"}},
          {"field": {"Name": "billing_city_c"}},
          {"field": {"Name": "billing_state_c"}},
          {"field": {"Name": "billing_country_c"}},
          {"field": {"Name": "billing_pincode_c"}},
          {"field": {"Name": "shipping_name_c"}},
          {"field": {"Name": "shipping_street_c"}},
          {"field": {"Name": "shipping_city_c"}},
          {"field": {"Name": "shipping_state_c"}},
          {"field": {"Name": "shipping_country_c"}},
          {"field": {"Name": "shipping_pincode_c"}},
          {"field": {"Name": "Owner"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching quotes:", error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const response = await apperClient.getRecordById('quote_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "deal_c"}},
          {"field": {"Name": "quote_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "delivery_method_c"}},
          {"field": {"Name": "expires_on_c"}},
          {"field": {"Name": "billing_name_c"}},
          {"field": {"Name": "billing_street_c"}},
          {"field": {"Name": "billing_city_c"}},
          {"field": {"Name": "billing_state_c"}},
          {"field": {"Name": "billing_country_c"}},
          {"field": {"Name": "billing_pincode_c"}},
          {"field": {"Name": "shipping_name_c"}},
          {"field": {"Name": "shipping_street_c"}},
          {"field": {"Name": "shipping_city_c"}},
          {"field": {"Name": "shipping_state_c"}},
          {"field": {"Name": "shipping_country_c"}},
          {"field": {"Name": "shipping_pincode_c"}},
          {"field": {"Name": "Owner"}}
        ]
      });

      if (!response.success || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching quote ${id}:`, error);
      return null;
    }
  },

  create: async (quoteData) => {
    try {
      const payload = {
        records: [{
          Name: quoteData.name,
          Tags: Array.isArray(quoteData.tags) ? quoteData.tags.join(',') : quoteData.tags || '',
          company_c: parseInt(quoteData.companyId),
          contact_c: parseInt(quoteData.contactId),
          deal_c: parseInt(quoteData.dealId),
          quote_date_c: quoteData.quoteDate,
          status_c: quoteData.status,
          delivery_method_c: quoteData.deliveryMethod || '',
          expires_on_c: quoteData.expiresOn || '',
          billing_name_c: quoteData.billingName || '',
          billing_street_c: quoteData.billingStreet || '',
          billing_city_c: quoteData.billingCity || '',
          billing_state_c: quoteData.billingState || '',
          billing_country_c: quoteData.billingCountry || '',
          billing_pincode_c: quoteData.billingPincode || '',
          shipping_name_c: quoteData.shippingName || '',
          shipping_street_c: quoteData.shippingStreet || '',
          shipping_city_c: quoteData.shippingCity || '',
          shipping_state_c: quoteData.shippingState || '',
          shipping_country_c: quoteData.shippingCountry || '',
          shipping_pincode_c: quoteData.shippingPincode || ''
        }]
      };

      const response = await apperClient.createRecord('quote_c', payload);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} quotes:`, failed);
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating quote:", error);
      return null;
    }
  },

  update: async (id, quoteData) => {
    try {
      const payload = {
        records: [{
          Id: parseInt(id),
          Name: quoteData.name,
          Tags: Array.isArray(quoteData.tags) ? quoteData.tags.join(',') : quoteData.tags || '',
          company_c: parseInt(quoteData.companyId),
          contact_c: parseInt(quoteData.contactId),
          deal_c: parseInt(quoteData.dealId),
          quote_date_c: quoteData.quoteDate,
          status_c: quoteData.status,
          delivery_method_c: quoteData.deliveryMethod || '',
          expires_on_c: quoteData.expiresOn || '',
          billing_name_c: quoteData.billingName || '',
          billing_street_c: quoteData.billingStreet || '',
          billing_city_c: quoteData.billingCity || '',
          billing_state_c: quoteData.billingState || '',
          billing_country_c: quoteData.billingCountry || '',
          billing_pincode_c: quoteData.billingPincode || '',
          shipping_name_c: quoteData.shippingName || '',
          shipping_street_c: quoteData.shippingStreet || '',
          shipping_city_c: quoteData.shippingCity || '',
          shipping_state_c: quoteData.shippingState || '',
          shipping_country_c: quoteData.shippingCountry || '',
          shipping_pincode_c: quoteData.shippingPincode || ''
        }]
      };

      const response = await apperClient.updateRecord('quote_c', payload);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} quotes:`, failed);
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating quote:", error);
      return null;
    }
  },

  delete: async (id) => {
    try {
      const response = await apperClient.deleteRecord('quote_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete quote:`, failed);
          return false;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting quote:", error);
      return false;
    }
  }
};

export default quoteService;