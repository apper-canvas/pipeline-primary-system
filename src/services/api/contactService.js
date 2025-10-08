const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const contactService = {
  getAll: async () => {
    try {
      const response = await apperClient.fetchRecords('contact_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(contact => ({
        ...contact,
        tags: contact.tags_c ? contact.tags_c.split(',') : []
      }));
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const response = await apperClient.getRecordById('contact_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      });

      if (!response.success || !response.data) {
        return null;
      }

      return {
        ...response.data,
        tags: response.data.tags_c ? response.data.tags_c.split(',') : []
      };
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error);
      return null;
    }
  },

  create: async (contactData) => {
    try {
      const payload = {
        records: [{
          name_c: contactData.name,
          company_c: contactData.company,
          email_c: contactData.email,
          phone_c: contactData.phone,
          status_c: contactData.status,
          tags_c: Array.isArray(contactData.tags) ? contactData.tags.join(',') : contactData.tags,
          notes_c: contactData.notes || ''
        }]
      };

      const response = await apperClient.createRecord('contact_c', payload);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} contacts:`, failed);
        }
        
        if (successful.length > 0) {
          const created = successful[0].data;
          return {
            ...created,
            tags: created.tags_c ? created.tags_c.split(',') : []
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating contact:", error);
      return null;
    }
  },

  update: async (id, contactData) => {
    try {
      const payload = {
        records: [{
          Id: parseInt(id),
          name_c: contactData.name,
          company_c: contactData.company,
          email_c: contactData.email,
          phone_c: contactData.phone,
          status_c: contactData.status,
          tags_c: Array.isArray(contactData.tags) ? contactData.tags.join(',') : contactData.tags,
          notes_c: contactData.notes || ''
        }]
      };

      const response = await apperClient.updateRecord('contact_c', payload);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} contacts:`, failed);
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            ...updated,
            tags: updated.tags_c ? updated.tags_c.split(',') : []
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating contact:", error);
      return null;
    }
  },

  delete: async (id) => {
    try {
      const response = await apperClient.deleteRecord('contact_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete contact:`, failed);
          return false;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting contact:", error);
      return false;
    }
  },

  search: async (query) => {
    try {
      const response = await apperClient.fetchRecords('contact_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {"fieldName": "name_c", "operator": "Contains", "values": [query]}
              ]
            },
            {
              conditions: [
                {"fieldName": "company_c", "operator": "Contains", "values": [query]}
              ]
            },
            {
              conditions: [
                {"fieldName": "email_c", "operator": "Contains", "values": [query]}
              ]
            }
          ]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(contact => ({
        ...contact,
        tags: contact.tags_c ? contact.tags_c.split(',') : []
      }));
    } catch (error) {
      console.error("Error searching contacts:", error);
      return [];
    }
  },
};

export default contactService;