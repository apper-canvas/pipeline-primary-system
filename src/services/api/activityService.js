const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const activityService = {
  getAll: async () => {
    try {
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}}
        ],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(activity => ({
        ...activity,
        contactId: activity.contact_id_c?.Id || activity.contact_id_c,
        dealId: activity.deal_id_c?.Id || activity.deal_id_c
      }));
    } catch (error) {
      console.error("Error fetching activities:", error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const response = await apperClient.getRecordById('activity_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}}
        ]
      });

      if (!response.success || !response.data) {
        return null;
      }

      return {
        ...response.data,
        contactId: response.data.contact_id_c?.Id || response.data.contact_id_c,
        dealId: response.data.deal_id_c?.Id || response.data.deal_id_c
      };
    } catch (error) {
      console.error(`Error fetching activity ${id}:`, error);
      return null;
    }
  },

  getByContactId: async (contactId) => {
    try {
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}}
        ],
        where: [
          {"FieldName": "contact_id_c", "Operator": "EqualTo", "Values": [parseInt(contactId)]}
        ],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(activity => ({
        ...activity,
        contactId: activity.contact_id_c?.Id || activity.contact_id_c,
        dealId: activity.deal_id_c?.Id || activity.deal_id_c
      }));
    } catch (error) {
      console.error("Error fetching activities by contact:", error);
      return [];
    }
  },

  getByDealId: async (dealId) => {
    try {
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}}
        ],
        where: [
          {"FieldName": "deal_id_c", "Operator": "EqualTo", "Values": [parseInt(dealId)]}
        ],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(activity => ({
        ...activity,
        contactId: activity.contact_id_c?.Id || activity.contact_id_c,
        dealId: activity.deal_id_c?.Id || activity.deal_id_c
      }));
    } catch (error) {
      console.error("Error fetching activities by deal:", error);
      return [];
    }
  },

  create: async (activityData) => {
    try {
      const payload = {
        records: [{
          type_c: activityData.type,
          description_c: activityData.description,
          timestamp_c: new Date().toISOString(),
          contact_id_c: parseInt(activityData.contactId),
          deal_id_c: activityData.dealId ? parseInt(activityData.dealId) : null
        }]
      };

      const response = await apperClient.createRecord('activity_c', payload);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} activities:`, failed);
        }
        
        if (successful.length > 0) {
          const created = successful[0].data;
          return {
            ...created,
            contactId: created.contact_id_c?.Id || created.contact_id_c,
            dealId: created.deal_id_c?.Id || created.deal_id_c
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating activity:", error);
      return null;
    }
  },

  delete: async (id) => {
    try {
      const response = await apperClient.deleteRecord('activity_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete activity:`, failed);
          return false;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting activity:", error);
      return false;
    }
  },
};

export default activityService;