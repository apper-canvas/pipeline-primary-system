import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ContactTable from "@/components/organisms/ContactTable";
import ContactModal from "@/components/organisms/ContactModal";
import ContactDetailPanel from "@/components/organisms/ContactDetailPanel";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import contactService from "@/services/api/contactService";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [detailContact, setDetailContact] = useState(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await contactService.getAll();
      setContacts(data);
      setFilteredContacts(data);
    } catch (err) {
      setError(err.message || "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredContacts(contacts);
      return;
    }

    const lowerQuery = query.toLowerCase();
const filtered = contacts.filter(
      (c) =>
        c.name_c.toLowerCase().includes(lowerQuery) ||
        c.company_c.toLowerCase().includes(lowerQuery) ||
        c.email_c.toLowerCase().includes(lowerQuery)
    );
    setFilteredContacts(filtered);
  };

  const handleAddContact = () => {
    setSelectedContact(null);
    setModalOpen(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setModalOpen(true);
    setDetailPanelOpen(false);
  };

  const handleViewContact = (contact) => {
    setDetailContact(contact);
    setDetailPanelOpen(true);
  };

  const handleSaveContact = async (contactData) => {
    try {
      if (selectedContact) {
        await contactService.update(selectedContact.Id, contactData);
        toast.success("Contact updated successfully!");
      } else {
        await contactService.create(contactData);
        toast.success("Contact added successfully!");
      }
      setModalOpen(false);
      setSelectedContact(null);
      loadContacts();
    } catch (err) {
      toast.error("Failed to save contact");
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await contactService.delete(contactId);
        toast.success("Contact deleted successfully!");
        loadContacts();
      } catch (err) {
        toast.error("Failed to delete contact");
      }
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadContacts} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contacts</h1>
          <p className="text-secondary">
            Manage your contacts and relationships
          </p>
        </div>
        <Button onClick={handleAddContact}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <SearchBar
          placeholder="Search contacts..."
          onSearch={handleSearch}
        />
      </div>

      {/* Contacts Table */}
      {filteredContacts.length === 0 ? (
        <Empty
          title="No contacts found"
          description="Get started by adding your first contact to begin tracking relationships."
          icon="Users"
          action={{
            label: "Add Contact",
            icon: "Plus",
            onClick: handleAddContact,
          }}
        />
      ) : (
        <ContactTable
          contacts={filteredContacts}
          onEdit={handleEditContact}
          onDelete={handleDeleteContact}
          onView={handleViewContact}
        />
      )}

      {/* Contact Modal */}
      <ContactModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedContact(null);
        }}
        onSave={handleSaveContact}
        contact={selectedContact}
      />

      {/* Contact Detail Panel */}
      {detailPanelOpen && (
        <ContactDetailPanel
          contact={detailContact}
          onClose={() => {
            setDetailPanelOpen(false);
            setDetailContact(null);
          }}
          onEdit={handleEditContact}
        />
      )}
    </div>
  );
};

export default Contacts;