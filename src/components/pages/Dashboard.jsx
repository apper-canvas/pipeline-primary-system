import { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import contactService from "@/services/api/contactService";
import dealService from "@/services/api/dealService";
import activityService from "@/services/api/activityService";
import DealCard from "@/components/organisms/DealCard";
import ApperIcon from "@/components/ApperIcon";

const Dashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [contactsData, dealsData, activitiesData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll(),
      ]);
      setContacts(contactsData);
      setDeals(dealsData);
      setActivities(activitiesData);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
const totalValue = deals.reduce((sum, deal) => sum + deal.value_c, 0);
    const avgDealSize = deals.length > 0 ? totalValue / deals.length : 0;
    const wonDeals = deals.filter((d) => d.stage_c === "closed").length;
    const conversionRate = deals.length > 0 ? (wonDeals / deals.length) * 100 : 0;

    return {
      totalDeals: deals.length,
      totalValue,
      avgDealSize,
      conversionRate,
    };
  };

  const getAtRiskDeals = () => {
    const now = new Date();
return deals.filter((deal) => {
      const closeDate = new Date(deal.expected_close_date_c);
      const daysUntilClose = Math.ceil((closeDate - now) / (1000 * 60 * 60 * 24));
      return daysUntilClose <= 14 && daysUntilClose >= 0 && deal.stage_c !== "closed";
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) return <Loading type="stats" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const stats = calculateStats();
  const atRiskDeals = getAtRiskDeals();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-secondary">
          Welcome back! Here's what's happening with your pipeline.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Deals"
          value={stats.totalDeals}
          icon="DollarSign"
          color="blue"
          trend={{ value: 12, label: "vs last month" }}
        />
        <StatCard
          title="Pipeline Value"
          value={formatCurrency(stats.totalValue)}
          icon="TrendingUp"
          color="green"
          trend={{ value: 8, label: "vs last month" }}
        />
        <StatCard
          title="Avg Deal Size"
          value={formatCurrency(stats.avgDealSize)}
          icon="Target"
          color="orange"
          trend={{ value: -3, label: "vs last month" }}
        />
        <StatCard
          title="Win Rate"
          value={`${stats.conversionRate.toFixed(1)}%`}
          icon="Award"
color="blue"
          trend={{ value: 5, label: "vs last month" }}
        />
      </div>

      {/* Deals by Stage */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Deals by Stage
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {["lead", "qualified", "proposal", "negotiation", "closed"].map(
            (stage) => {
const stageDeals = deals.filter((d) => d.stage_c === stage);
            const stageValue = stageDeals.reduce(
              (sum, d) => sum + d.value_c,
              0
            );
            const stageColors = {
              lead: "blue",
              qualified: "yellow",
              proposal: "orange",
              negotiation: "purple",
              closed: "green",
            };

            return (
              <div
                key={stage}
                className={`bg-${stageColors[stage]}-50 rounded-lg p-4 border border-${stageColors[stage]}-200`}
              >
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {stage.charAt(0).toUpperCase() + stage.slice(1)}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stageDeals.length}
                </p>
                <p className="text-sm text-gray-600">
                  {formatCurrency(stageValue)}
                </p>
              </div>
            );
          }
        )}
        </div>
      </div>

      {/* At Risk Deals */}
      {atRiskDeals.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <ApperIcon name="AlertCircle" className="text-orange-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">
              Deals Closing Soon
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {atRiskDeals.map((deal) => {
              const contact = contacts.find((c) => c.Id === deal.contactId);
              return (
                <DealCard
                  key={deal.Id}
                  deal={deal}
                  contact={contact}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {activities.slice(0, 5).map((activity) => {
const contact = contacts.find((c) => c.Id === activity.contactId);
          return (
            <div
              key={activity.Id}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-primary rounded-full">
                <ApperIcon
                  name={
                    activity.type_c === "email"
                      ? "Mail"
                      : activity.type_c === "call"
                      ? "Phone"
                      : activity.type_c === "meeting"
                      ? "Users"
                      : "FileText"
                  }
                  size={18}
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {activity.description_c}
                </p>
                {contact && (
                  <p className="text-sm text-secondary">
                    {contact.name_c} - {contact.company_c}
                  </p>
                )}
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;