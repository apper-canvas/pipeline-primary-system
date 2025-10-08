import dealsData from "../mockData/deals.json";

let deals = [...dealsData];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const dealService = {
  getAll: async () => {
    await delay(300);
    return [...deals];
  },

  getById: async (id) => {
    await delay(200);
    const deal = deals.find((d) => d.Id === parseInt(id));
    return deal ? { ...deal } : null;
  },

  getByContactId: async (contactId) => {
    await delay(200);
    return deals.filter((d) => d.contactId === parseInt(contactId));
  },

  getByStage: async (stage) => {
    await delay(200);
    return deals.filter((d) => d.stage === stage);
  },

  create: async (dealData) => {
    await delay(300);
    const maxId = deals.reduce((max, d) => Math.max(max, d.Id), 0);
    const newDeal = {
      Id: maxId + 1,
      ...dealData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    deals.push(newDeal);
    return { ...newDeal };
  },

  update: async (id, dealData) => {
    await delay(300);
    const index = deals.findIndex((d) => d.Id === parseInt(id));
    if (index !== -1) {
      deals[index] = {
        ...deals[index],
        ...dealData,
        Id: deals[index].Id,
        updatedAt: new Date().toISOString(),
      };
      return { ...deals[index] };
    }
    return null;
  },

  updateStage: async (id, newStage) => {
    await delay(200);
    const index = deals.findIndex((d) => d.Id === parseInt(id));
    if (index !== -1) {
      deals[index] = {
        ...deals[index],
        stage: newStage,
        updatedAt: new Date().toISOString(),
      };
      return { ...deals[index] };
    }
    return null;
  },

  delete: async (id) => {
    await delay(300);
    const index = deals.findIndex((d) => d.Id === parseInt(id));
    if (index !== -1) {
      deals.splice(index, 1);
      return true;
    }
    return false;
  },
};

export default dealService;