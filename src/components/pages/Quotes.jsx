import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import QuoteModal from "@/components/organisms/QuoteModal";
import quoteService from "@/services/api/quoteService";
import companyService from "@/services/api/companyService";
import contactService from "@/services/api/contactService";
import dealService from "@/services/api/dealService";

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [quotesData, companiesData, contactsData, dealsData] = await Promise.all([
        quoteService.getAll(),
        companyService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ]);
      
      setQuotes(quotesData);
      setCompanies(companiesData);
      setContacts(contactsData);
      setDeals(dealsData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load quotes");
      toast.error("Failed to load quotes");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedQuote(null);
    setShowModal(true);
  };

  const handleEdit = (quote) => {
    setSelectedQuote(quote);
    setShowModal(true);
  };

  const handleSave = async (quoteData) => {
    try {
      let result;
      if (selectedQuote) {
        result = await quoteService.update(selectedQuote.Id, quoteData);
        if (result) {
          toast.success("Quote updated successfully");
          setQuotes(prev => prev.map(q => q.Id === selectedQuote.Id ? result : q));
        } else {
          toast.error("Failed to update quote");
          return;
        }
      } else {
        result = await quoteService.create(quoteData);
        if (result) {
          toast.success("Quote created successfully");
          setQuotes(prev => [...prev, result]);
        } else {
          toast.error("Failed to create quote");
          return;
        }
      }
      setShowModal(false);
      setSelectedQuote(null);
    } catch (err) {
      console.error("Error saving quote:", err);
      toast.error("Failed to save quote");
    }
  };

  const handleDelete = async (quoteId) => {
    if (!window.confirm("Are you sure you want to delete this quote?")) {
      return;
    }

    try {
      const success = await quoteService.delete(quoteId);
      if (success) {
        toast.success("Quote deleted successfully");
        setQuotes(prev => prev.filter(q => q.Id !== quoteId));
      } else {
        toast.error("Failed to delete quote");
      }
    } catch (err) {
      console.error("Error deleting quote:", err);
      toast.error("Failed to delete quote");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quotes</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your quotes and proposals
            </p>
          </div>
          <Button onClick={handleCreate}>
            <ApperIcon name="Plus" size={20} className="mr-2" />
            Add Quote
          </Button>
        </div>

        {quotes.length === 0 ? (
          <Empty message="No quotes found. Create your first quote to get started." />
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quote Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expires On
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quotes.map((quote) => (
                    <tr key={quote.Id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {quote.Name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {quote.company_c?.Name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {quote.contact_c?.Name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {quote.deal_c?.Name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {quote.quote_date_c || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={quote.status_c?.toLowerCase()}>
                          {quote.status_c || 'Draft'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {quote.expires_on_c || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(quote)}
                          className="text-primary hover:text-primary-dark mr-4"
                        >
                          <ApperIcon name="Edit" size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(quote.Id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <ApperIcon name="Trash2" size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showModal && (
          <QuoteModal
            quote={selectedQuote}
            onClose={() => {
              setShowModal(false);
              setSelectedQuote(null);
            }}
            onSave={handleSave}
            companies={companies}
            contacts={contacts}
            deals={deals}
          />
        )}
      </div>
    </div>
  );
};

export default Quotes;