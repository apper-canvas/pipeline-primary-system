import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import activityService from "@/services/api/activityService";
import contactService from "@/services/api/contactService";
import dealService from "@/services/api/dealService";
import { format } from "date-fns";
import { motion } from "framer-motion";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [sortField, setSortField] = useState("timestamp_c");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    setLoading(true);
    setError("");
    try {
      const [activitiesData, contactsData, dealsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll(),
        dealService.getAll(),
      ]);
      setActivities(activitiesData);
      setContacts(contactsData);
      setDeals(dealsData);
      setFilteredActivities(activitiesData);
    } catch (err) {
      setError(err.message || "Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredActivities(activities);
      return;
    }

    const searchLower = query.toLowerCase();
    const filtered = activities.filter((activity) =>
      activity.description_c?.toLowerCase().includes(searchLower)
    );
    setFilteredActivities(filtered);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleAddActivity = () => {
    setSelectedActivity(null);
    setModalOpen(true);
  };

  const handleEditActivity = (activity) => {
    setSelectedActivity(activity);
    setModalOpen(true);
  };

  const handleSaveActivity = async (activityData) => {
    try {
      if (selectedActivity) {
        toast.info("Activity updates not yet implemented");
      } else {
        const created = await activityService.create(activityData);
        if (created) {
          toast.success("Activity created successfully");
          await loadActivities();
        } else {
          toast.error("Failed to create activity");
        }
      }
      setModalOpen(false);
      setSelectedActivity(null);
    } catch (err) {
      toast.error(err.message || "Failed to save activity");
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;

    try {
      const success = await activityService.delete(activityId);
      if (success) {
        toast.success("Activity deleted successfully");
        await loadActivities();
      } else {
        toast.error("Failed to delete activity");
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete activity");
    }
  };

  const getContact = (contactId) => {
    return contacts.find((c) => c.Id === contactId);
  };

  const getDeal = (dealId) => {
    return deals.find((d) => d.Id === dealId);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "email":
        return "Mail";
      case "call":
        return "Phone";
      case "meeting":
        return "Users";
      case "note":
        return "FileText";
      default:
        return "Activity";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "email":
        return "blue";
      case "call":
        return "green";
      case "meeting":
        return "purple";
      case "note":
        return "orange";
      default:
        return "gray";
    }
  };

  const sortedActivities = [...filteredActivities].sort((a, b) => {
    let aVal, bVal;

    switch (sortField) {
      case "timestamp_c":
        aVal = new Date(a.timestamp_c);
        bVal = new Date(b.timestamp_c);
        break;
      case "type_c":
        aVal = a.type_c || "";
        bVal = b.type_c || "";
        break;
      case "description_c":
        aVal = a.description_c || "";
        bVal = b.description_c || "";
        break;
      default:
        return 0;
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadActivities} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Activities</h1>
          <p className="text-secondary">
            Track all interactions with contacts and deals
          </p>
        </div>
        <Button onClick={handleAddActivity} className="shrink-0">
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Add Activity
        </Button>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search activities..."
            onSearch={handleSearch}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={sortField}
            onChange={(e) => handleSort(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="timestamp_c">Sort by Date</option>
            <option value="type_c">Sort by Type</option>
            <option value="description_c">Sort by Description</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
          >
            <ApperIcon
              name={sortDirection === "asc" ? "ArrowUp" : "ArrowDown"}
              size={16}
            />
          </Button>
        </div>
      </div>

      {/* Activities List */}
      {filteredActivities.length === 0 ? (
        <Empty
          message="No activities found"
          action={{
            label: "Add Activity",
            onClick: handleAddActivity,
          }}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 divide-y divide-gray-100">
          {sortedActivities.map((activity, index) => {
            const contact = getContact(activity.contactId);
            const deal = getDeal(activity.dealId);
            return (
              <motion.div
                key={activity.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full bg-${getActivityColor(
                        activity.type_c
                      )}-100 text-${getActivityColor(activity.type_c)}-600`}
                    >
                      <ApperIcon
                        name={getActivityIcon(activity.type_c)}
                        size={20}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={getActivityColor(activity.type_c)}>
                          {activity.type_c?.charAt(0).toUpperCase() +
                            activity.type_c?.slice(1)}
                        </Badge>
                        <span className="text-sm text-secondary">
                          {format(
                            new Date(activity.timestamp_c),
                            "MMM d, yyyy 'at' h:mm a"
                          )}
                        </span>
                      </div>
                      <p className="text-gray-900 mb-2">
                        {activity.description_c}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-secondary">
                        {contact && (
                          <span className="flex items-center gap-1">
                            <ApperIcon name="User" size={14} />
                            {contact.name_c}
                          </span>
                        )}
                        {deal && (
                          <span className="flex items-center gap-1">
                            <ApperIcon name="DollarSign" size={14} />
                            {deal.title_c}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditActivity(activity)}
                    >
                      <ApperIcon name="Edit2" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteActivity(activity.Id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Activities;