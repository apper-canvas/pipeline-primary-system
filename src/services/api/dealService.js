const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const dealService = {
getAll: async () => {
    try {
      const response = await apperClient.fetchRecords('deal_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "Owner"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(deal => ({
        ...deal,
        contactId: deal.contact_id_c?.Id || deal.contact_id_c
      }));
    } catch (error) {
      console.error("Error fetching deals:", error);
      return [];
    }
  },

getById: async (id) => {
    try {
      const response = await apperClient.getRecordById('deal_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "Owner"}}
        ]
      });

      if (!response.success || !response.data) {
        return null;
      }

      return {
        ...response.data,
        contactId: response.data.contact_id_c?.Id || response.data.contact_id_c
      };
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error);
      return null;
    }
  },

  getByContactId: async (contactId) => {
    try {
      const response = await apperClient.fetchRecords('deal_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "contact_id_c"}}
        ],
        where: [
          {"FieldName": "contact_id_c", "Operator": "EqualTo", "Values": [parseInt(contactId)]}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(deal => ({
        ...deal,
        contactId: deal.contact_id_c?.Id || deal.contact_id_c
      }));
    } catch (error) {
      console.error("Error fetching deals by contact:", error);
      return [];
    }
  },

  getByStage: async (stage) => {
    try {
      const response = await apperClient.fetchRecords('deal_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "contact_id_c"}}
        ],
        where: [
          {"FieldName": "stage_c", "Operator": "EqualTo", "Values": [stage]}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(deal => ({
        ...deal,
        contactId: deal.contact_id_c?.Id || deal.contact_id_c
      }));
    } catch (error) {
      console.error("Error fetching deals by stage:", error);
      return [];
    }
  },

  create: async (dealData) => {
    try {
      const payload = {
        records: [{
          title_c: dealData.title,
          value_c: parseFloat(dealData.value),
          stage_c: dealData.stage,
          probability_c: parseInt(dealData.probability),
          expected_close_date_c: dealData.expectedCloseDate,
          notes_c: dealData.notes || '',
          contact_id_c: parseInt(dealData.contactId)
        }]
      };

      const response = await apperClient.createRecord('deal_c', payload);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} deals:`, failed);
        }
        
        if (successful.length > 0) {
          const created = successful[0].data;
          return {
            ...created,
            contactId: created.contact_id_c?.Id || created.contact_id_c
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating deal:", error);
      return null;
    }
  },

  update: async (id, dealData) => {
    try {
      const payload = {
        records: [{
          Id: parseInt(id),
          title_c: dealData.title,
          value_c: parseFloat(dealData.value),
          stage_c: dealData.stage,
          probability_c: parseInt(dealData.probability),
          expected_close_date_c: dealData.expectedCloseDate,
          notes_c: dealData.notes || '',
          contact_id_c: parseInt(dealData.contactId)
        }]
      };

      const response = await apperClient.updateRecord('deal_c', payload);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} deals:`, failed);
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            ...updated,
            contactId: updated.contact_id_c?.Id || updated.contact_id_c
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating deal:", error);
      return null;
    }
  },

  updateStage: async (id, newStage) => {
    try {
      const payload = {
        records: [{
          Id: parseInt(id),
          stage_c: newStage
        }]
      };

      const response = await apperClient.updateRecord('deal_c', payload);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} deal stages:`, failed);
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            ...updated,
            contactId: updated.contact_id_c?.Id || updated.contact_id_c
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating deal stage:", error);
      return null;
    }
  },

  delete: async (id) => {
    try {
      const response = await apperClient.deleteRecord('deal_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete deal:`, failed);
          return false;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting deal:", error);
      return false;
    }
  },
};

export default dealService;