const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const companyService = {
  getAll: async () => {
    try {
      const response = await apperClient.fetchRecords('companies_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "website_c"}}
        ],
        where: []
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(company => ({
        ...company,
        tags: company.Tags ? company.Tags.split(',') : []
      }));
    } catch (error) {
      console.error("Error fetching companies:", error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const response = await apperClient.getRecordById('companies_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "website_c"}}
        ]
      });

      if (!response.success || !response.data) {
        return null;
      }

      return {
        ...response.data,
        tags: response.data.Tags ? response.data.Tags.split(',') : []
      };
    } catch (error) {
      console.error(`Error fetching company ${id}:`, error);
      return null;
    }
  },

  create: async (companyData) => {
    try {
      const payload = {
        records: [{
          Name: companyData.name || '',
          name_c: companyData.name || '',
          description_c: companyData.description || '',
          website_c: companyData.website || '',
          Tags: Array.isArray(companyData.tags) ? companyData.tags.join(',') : companyData.tags || ''
        }]
      };

      const response = await apperClient.createRecord('companies_c', payload);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} companies:`, failed);
        }
        
        if (successful.length > 0) {
          const created = successful[0].data;
          return {
            ...created,
            tags: created.Tags ? created.Tags.split(',') : []
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating company:", error);
      return null;
    }
  },

  update: async (id, companyData) => {
    try {
      const payload = {
        records: [{
          Id: parseInt(id),
          Name: companyData.name || '',
          name_c: companyData.name || '',
          description_c: companyData.description || '',
          website_c: companyData.website || '',
          Tags: Array.isArray(companyData.tags) ? companyData.tags.join(',') : companyData.tags || ''
        }]
      };

      const response = await apperClient.updateRecord('companies_c', payload);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} companies:`, failed);
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            ...updated,
            tags: updated.Tags ? updated.Tags.split(',') : []
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating company:", error);
      return null;
    }
  },

  delete: async (id) => {
    try {
      const response = await apperClient.deleteRecord('companies_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete company:`, failed);
          return false;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting company:", error);
      return false;
    }
  },

  search: async (query) => {
    try {
      const response = await apperClient.fetchRecords('companies_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "website_c"}}
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
                {"fieldName": "description_c", "operator": "Contains", "values": [query]}
              ]
            },
            {
              conditions: [
                {"fieldName": "website_c", "operator": "Contains", "values": [query]}
              ]
            }
          ]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(company => ({
        ...company,
        tags: company.Tags ? company.Tags.split(',') : []
      }));
    } catch (error) {
      console.error("Error searching companies:", error);
      return [];
    }
  }
};

export default companyService;