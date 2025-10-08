import activitiesData from "../mockData/activities.json";

let activities = [...activitiesData];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const activityService = {
  getAll: async () => {
    await delay(300);
    return [...activities];
  },

  getById: async (id) => {
    await delay(200);
    const activity = activities.find((a) => a.Id === parseInt(id));
    return activity ? { ...activity } : null;
  },

  getByContactId: async (contactId) => {
    await delay(200);
    return activities.filter((a) => a.contactId === parseInt(contactId));
  },

  getByDealId: async (dealId) => {
    await delay(200);
    return activities.filter((a) => a.dealId === parseInt(dealId));
  },

  create: async (activityData) => {
    await delay(300);
    const maxId = activities.reduce((max, a) => Math.max(max, a.Id), 0);
    const newActivity = {
      Id: maxId + 1,
      ...activityData,
      timestamp: new Date().toISOString(),
    };
    activities.push(newActivity);
    return { ...newActivity };
  },

  delete: async (id) => {
    await delay(300);
    const index = activities.findIndex((a) => a.Id === parseInt(id));
    if (index !== -1) {
      activities.splice(index, 1);
      return true;
    }
    return false;
  },
};

export default activityService;