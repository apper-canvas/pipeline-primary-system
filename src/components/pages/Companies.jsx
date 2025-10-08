import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import companyService from "@/services/api/companyService";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import CompanyTable from "@/components/organisms/CompanyTable";
import CompanyModal from "@/components/organisms/CompanyModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const loadCompanies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await companyService.getAll();
      setCompanies(data);
      setFilteredCompanies(data);
    } catch (err) {
      setError("Failed to load companies");
      console.error("Error loading companies:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  useEffect(() => {
    const searchCompanies = async () => {
      if (!searchQuery.trim()) {
        setFilteredCompanies(companies);
        return;
      }

      try {
        const results = await companyService.search(searchQuery);
        setFilteredCompanies(results);
      } catch (err) {
        console.error("Error searching companies:", err);
        setFilteredCompanies(companies);
      }
    };

    const timeoutId = setTimeout(searchCompanies, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, companies]);

  const handleAddCompany = () => {
    setSelectedCompany(null);
    setIsModalOpen(true);
  };

  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleDeleteCompany = async (id) => {
    if (!confirm("Are you sure you want to delete this company?")) {
      return;
    }

    try {
      const success = await companyService.delete(id);
      if (success) {
        toast.success("Company deleted successfully");
        loadCompanies();
      } else {
        toast.error("Failed to delete company");
      }
    } catch (err) {
      console.error("Error deleting company:", err);
      toast.error("Failed to delete company");
    }
  };

  const handleSaveCompany = async (companyData) => {
    try {
      if (selectedCompany) {
        const updated = await companyService.update(selectedCompany.Id, companyData);
        if (updated) {
          toast.success("Company updated successfully");
          setIsModalOpen(false);
          loadCompanies();
        } else {
          toast.error("Failed to update company");
        }
      } else {
        const created = await companyService.create(companyData);
        if (created) {
          toast.success("Company created successfully");
          setIsModalOpen(false);
          loadCompanies();
        } else {
          toast.error("Failed to create company");
        }
      }
    } catch (err) {
      console.error("Error saving company:", err);
      toast.error("Failed to save company");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadCompanies} />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
          <Button onClick={handleAddCompany} className="flex items-center gap-2">
            <ApperIcon name="Plus" size={20} />
            Add Company
          </Button>
        </div>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search companies..."
        />
      </div>

      {filteredCompanies.length === 0 ? (
        <Empty
          title="No companies found"
          description={
            searchQuery
              ? "Try adjusting your search criteria"
              : "Get started by adding your first company"
          }
        />
      ) : (
        <CompanyTable
          companies={filteredCompanies}
          onEdit={handleEditCompany}
          onDelete={handleDeleteCompany}
        />
      )}

      {isModalOpen && (
        <CompanyModal
          company={selectedCompany}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCompany}
        />
      )}
    </div>
  );
};

export default Companies;