import React, { useEffect, useState } from 'react';
import { ArrowLeft, BarChart3, Home, Pencil, Plus, Search, Target, Trash2, TrendingUp, Users, X, Star, HelpCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const statConfigs = [
  {
    label: 'Total Contacts',
    value: '-',
    icon: Users,
    cardBg: 'bg-white',
    borderColor: 'border-gray-100',
    iconBg: 'bg-purple-100',
    iconColor: 'text-primary-600',
  },
  {
    label: 'Total Leads',
    value: '-',
    icon: Target,
    cardBg: 'bg-white',
    borderColor: 'border-gray-100',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    label: 'Sales This Month',
    value: '-',
    icon: 'R',
    cardBg: 'bg-white',
    borderColor: 'border-gray-100',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    label: 'Conversion Rate',
    value: '-',
    icon: TrendingUp,
    cardBg: 'bg-white',
    borderColor: 'border-gray-100',
    iconBg: 'bg-fuchsia-100',
    iconColor: 'text-purple-600',
  },
];

type CrmTab = 'overview' | 'contacts' | 'leads' | 'sales' | 'reports';
type QuickActionTarget = 'contact' | 'lead' | 'sale';

const navItems: Array<{ id: CrmTab; label: string; icon: React.ElementType }> = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'leads', label: 'Leads', icon: Target },
  { id: 'contacts', label: 'Contacts', icon: Users },
  { id: 'sales', label: 'Sales', icon: TrendingUp },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
];

const quickActions = [
  {
    label: 'Add New Contact',
    icon: Users,
    primary: true,
    target: 'contact',
  },
  {
    label: 'Create Lead',
    icon: Target,
    target: 'lead',
  },
  {
    label: 'Record Sale',
    icon: 'R',
    target: 'sale',
  },
] as Array<{ label: string; icon: React.ElementType | string; target: QuickActionTarget; primary?: boolean }>;

type Contact = {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  notes: string;
};

type Lead = {
  id: number;
  name: string;
  email: string;
  phone: string;
  source: string;
  stage: string;
  notes: string;
};

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
};

type Sale = {
  id: number;
  customerId: number;
  customerName: string;
  productId: number;
  productName: string;
  amount: number;
  paymentMethod: string;
  date: string;
  status: string;
  notes: string;
};

type Activity = {
  id: number;
  message: string;
  timestamp: string;
};

const CRM_STORAGE_KEYS = {
  contacts: 'crm_contacts',
  leads: 'crm_leads',
  sales: 'crm_sales',
  activities: 'crm_activities',
  products: 'crm_products',
};

const loadCrmStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? (JSON.parse(storedValue) as T) : fallback;
  } catch {
    return fallback;
  }
};

const saveCrmStorage = <T,>(key: string, value: T) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};

const CRM: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<CrmTab>('overview');
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts, setContacts] = useState<Contact[]>(() => loadCrmStorage<Contact[]>(CRM_STORAGE_KEYS.contacts, []));
  const [leads, setLeads] = useState<Lead[]>(() => loadCrmStorage<Lead[]>(CRM_STORAGE_KEYS.leads, []));
  const [sales, setSales] = useState<Sale[]>(() => loadCrmStorage<Sale[]>(CRM_STORAGE_KEYS.sales, []));
  const [products, setProducts] = useState<Product[]>(() => loadCrmStorage<Product[]>(CRM_STORAGE_KEYS.products, []));
  const [activities, setActivities] = useState<Activity[]>(() => loadCrmStorage<Activity[]>(CRM_STORAGE_KEYS.activities, []));
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);

  const addActivity = (message: string) => {
    setActivities((currentActivities) => [
      {
        id: Date.now(),
        message,
        timestamp: new Date().toLocaleString(),
      },
      ...currentActivities,
    ]);
  };

  useEffect(() => {
    saveCrmStorage(CRM_STORAGE_KEYS.contacts, contacts);
  }, [contacts]);

  useEffect(() => {
    saveCrmStorage(CRM_STORAGE_KEYS.leads, leads);
  }, [leads]);

  useEffect(() => {
    saveCrmStorage(CRM_STORAGE_KEYS.sales, sales);
  }, [sales]);

  useEffect(() => {
    saveCrmStorage(CRM_STORAGE_KEYS.products, products);
  }, [products]);

  useEffect(() => {
    saveCrmStorage(CRM_STORAGE_KEYS.activities, activities);
  }, [activities]);

  const currentMonthSalesTotal = sales.reduce((total, sale) => {
    const saleDate = new Date(sale.date);
    const now = new Date();

    if (saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear()) {
      return total + sale.amount;
    }

    return total;
  }, 0);

  const conversionRate = leads.length === 0 ? 0 : Math.round((sales.length / leads.length) * 100);

  const stats = statConfigs.map((stat) => {
    if (stat.label === 'Total Contacts') {
      return { ...stat, value: String(contacts.length) };
    }

    if (stat.label === 'Total Leads') {
      return { ...stat, value: String(leads.length) };
    }

    if (stat.label === 'Sales This Month') {
      return { ...stat, value: `R${currentMonthSalesTotal.toLocaleString()}` };
    }

    return { ...stat, value: `${conversionRate}%` };
  });

  const searchResults = [
    {
      label: 'Overview',
      description: 'Dashboard metrics, recent activity, quick actions',
      keywords: 'overview dashboard metrics totals activity quick actions stats',
      action: () => setActiveTab('overview'),
    },
    {
      label: 'Contacts',
      description: 'Manage contacts and customer records',
      keywords: 'contacts customers people business contacts manage contact records',
      action: () => setActiveTab('contacts'),
    },
    {
      label: 'Add New Contact',
      description: 'Open the add contact form',
      keywords: 'add contact new contact create contact save contact customer',
      action: () => {
        setActiveTab('contacts');
        setIsContactFormOpen(true);
      },
    },
    {
      label: 'Leads',
      description: 'Track and manage sales leads',
      keywords: 'leads prospects pipeline lead records sales leads',
      action: () => setActiveTab('leads'),
    },
    {
      label: 'Create Lead',
      description: 'Open the add lead form',
      keywords: 'create lead add lead new lead source status value',
      action: () => {
        setActiveTab('leads');
        setIsLeadModalOpen(true);
      },
    },
    {
      label: 'Sales',
      description: 'Monitor sales and recorded deals',
      keywords: 'sales deals completed sales amount rands revenue pipeline',
      action: () => setActiveTab('sales'),
    },
    {
      label: 'Record Sale',
      description: 'Open the record sale form',
      keywords: 'record sale save sale add sale amount date completed rands',
      action: () => {
        setActiveTab('sales');
        setIsSaleModalOpen(true);
      },
    },
    {
      label: 'Reports',
      description: 'Sales overview and lead conversion reports',
      keywords: 'reports analytics conversion rate sales overview lead conversion totals',
      action: () => setActiveTab('reports'),
    },
    ...contacts.map((contact) => ({
      label: contact.name,
      description: 'Saved contact',
      keywords: `contact customer ${contact.name}`,
      action: () => setActiveTab('contacts'),
    })),
    ...leads.map((lead) => ({
      label: lead.name,
      description: 'Saved lead',
      keywords: `lead prospect ${lead.name}`,
      action: () => setActiveTab('leads'),
    })),
    ...sales.map((sale) => ({
      label: `Sale R${sale.amount.toLocaleString()}`,
      description: `Recorded sale on ${sale.date}`,
      keywords: `sale sales r${sale.amount} ${sale.amount} ${sale.date}`,
      action: () => setActiveTab('sales'),
    })),
  ].filter((result) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return false;
    }

    return `${result.label} ${result.description} ${result.keywords}`.toLowerCase().includes(normalizedSearch);
  });

  const handleContactSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') || 'New contact');
    const company = String(formData.get('company') || '');
    const email = String(formData.get('email') || '');
    const phone = String(formData.get('phone') || '');
    const notes = String(formData.get('notes') || '');

    if (editingContact) {
      setContacts((currentContacts) =>
        currentContacts.map((contact) =>
          contact.id === editingContact.id ? { ...contact, name, company, email, phone, notes } : contact
        )
      );
      addActivity(`Contact updated: ${name}`);
    } else {
      setContacts((currentContacts) => [...currentContacts, { id: Date.now(), name, company, email, phone, notes }]);
      addActivity(`Contact added: ${name}`);
    }

    setEditingContact(null);
    setIsContactFormOpen(false);
    event.currentTarget.reset();
  };

  const handleLeadSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') || 'New lead');
    const email = String(formData.get('email') || '');
    const phone = String(formData.get('phone') || '');
    const source = String(formData.get('source') || '');
    const stage = String(formData.get('stage') || 'New');
    const notes = String(formData.get('notes') || '');

    if (editingLead) {
      setLeads((currentLeads) =>
        currentLeads.map((lead) =>
          lead.id === editingLead.id ? { ...lead, name, email, phone, source, stage, notes } : lead
        )
      );
      // If stage is being set to Active, add as contact if not already exists
      if (stage === 'Active') {
        const existingContact = contacts.find((c) => c.email === email);
        if (!existingContact) {
          setContacts((currentContacts) => [
            ...currentContacts,
            {
              id: Date.now(),
              name,
              company: '',
              email,
              phone,
              notes,
            },
          ]);
          addActivity(`Lead "${name}" converted to contact`);
        }
      }
      addActivity(`Lead updated: ${name}`);
    } else {
      setLeads((currentLeads) => [...currentLeads, { id: Date.now(), name, email, phone, source, stage, notes }]);
      // If stage is Active, add as contact immediately
      if (stage === 'Active') {
        const existingContact = contacts.find((c) => c.email === email);
        if (!existingContact) {
          setContacts((currentContacts) => [
            ...currentContacts,
            {
              id: Date.now(),
              name,
              company: '',
              email,
              phone,
              notes,
            },
          ]);
          addActivity(`Lead "${name}" converted to contact`);
        }
      }
      addActivity(`Lead created: ${name}`);
    }

    setEditingLead(null);
    setActiveTab('leads');
    setIsLeadModalOpen(false);
    event.currentTarget.reset();
  };

  const handleLeadStageChange = (lead: Lead, newStage: string) => {
    // Update lead stage
    setLeads((currentLeads) =>
      currentLeads.map((l) =>
        l.id === lead.id ? { ...l, stage: newStage } : l
      )
    );

    // If stage changed to "Active", add as contact
    if (newStage === 'Active') {
      const existingContact = contacts.find((c) => c.email === lead.email);
      if (!existingContact) {
        setContacts((currentContacts) => [
          ...currentContacts,
          {
            id: Date.now(),
            name: lead.name,
            company: '',
            email: lead.email,
            phone: lead.phone,
            notes: lead.notes,
          },
        ]);
        addActivity(`Lead "${lead.name}" converted to contact`);
      }
    }

    addActivity(`Lead "${lead.name}" stage changed to ${newStage}`);
  };

  const handleAddProduct = (productName: string, productPrice: number, productDescription?: string) => {
    const newProduct: Product = {
      id: Date.now(),
      name: productName,
      description: productDescription || '',
      price: productPrice,
    };
    setProducts((currentProducts) => [...currentProducts, newProduct]);
    addActivity(`Product added: ${productName}`);
    return newProduct.id;
  };

  const handleSaleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const customerId = Number(formData.get('customerId') || 0);
    const customerName = String(formData.get('customerName') || '');
    const product = String(formData.get('productName') || '');
    const amount = Number(formData.get('amount') || 0);
    const paymentMethod = String(formData.get('paymentMethod') || '');
    const date = String(formData.get('date') || new Date().toISOString().split('T')[0]);
    const status = String(formData.get('status') || 'Pending');
    const notes = String(formData.get('notes') || '');

    if (editingSale) {
      setSales((currentSales) =>
        currentSales.map((sale) =>
          sale.id === editingSale.id ? { ...sale, customerId, customerName, productId: Number(formData.get('productId')), productName: product, amount, paymentMethod, date, status, notes } : sale
        )
      );
      addActivity(`Sale updated: ${customerName} - R${amount.toLocaleString()}`);
    } else {
      setSales((currentSales) => [...currentSales, { id: Date.now(), customerId, customerName, productId: Number(formData.get('productId')), productName: product, amount, paymentMethod, date, status, notes }]);
      addActivity(`Sale recorded: ${customerName} - R${amount.toLocaleString()}`);
    }

    setEditingSale(null);
    setActiveTab('sales');
    setIsSaleModalOpen(false);
    event.currentTarget.reset();
  };

  const handleQuickAction = (target: QuickActionTarget) => {
    setIsContactFormOpen(false);
    setIsLeadModalOpen(false);
    setIsSaleModalOpen(false);
    setEditingContact(null);
    setEditingLead(null);
    setEditingSale(null);

    if (target === 'contact') {
      setActiveTab('contacts');
      setIsContactFormOpen(true);
      return;
    }

    if (target === 'lead') {
      setActiveTab('leads');
      setIsLeadModalOpen(true);
      return;
    }

    setActiveTab('sales');
    setIsSaleModalOpen(true);
  };

  const openContactCreate = () => {
    setEditingContact(null);
    setIsContactFormOpen(true);
  };

  const openContactEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsContactFormOpen(true);
  };

  const deleteContact = (contact: Contact) => {
    setContacts((currentContacts) => currentContacts.filter((item) => item.id !== contact.id));
    addActivity(`Contact deleted: ${contact.name}`);
  };

  const openLeadCreate = () => {
    setEditingLead(null);
    setIsLeadModalOpen(true);
  };

  const openLeadEdit = (lead: Lead) => {
    setEditingLead(lead);
    setIsLeadModalOpen(true);
  };

  const deleteLead = (lead: Lead) => {
    setLeads((currentLeads) => currentLeads.filter((item) => item.id !== lead.id));
    addActivity(`Lead deleted: ${lead.name}`);
  };

  const openSaleCreate = () => {
    setEditingSale(null);
    setIsSaleModalOpen(true);
  };

  const openSaleEdit = (sale: Sale) => {
    setEditingSale(sale);
    setIsSaleModalOpen(true);
  };

  const deleteSale = (sale: Sale) => {
    setSales((currentSales) => currentSales.filter((item) => item.id !== sale.id));
    addActivity(`Sale deleted: R${sale.amount.toLocaleString()}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => navigate('/dashboard/overview')}
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Main Dashboard
            </button>

            <div className="flex items-center gap-2 sm:ml-4">
              <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white text-xs font-bold">
                72X
              </div>
              <h1 className="text-2xl font-bold text-gray-900">CRM</h1>
            </div>
          </div>
          <p className="text-gray-600 mt-2">Manage customer relationships, leads, sales, and business activity.</p>
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
          {searchTerm.trim() && (
            <div className="absolute right-0 top-11 z-40 w-full rounded-xl border border-gray-100 bg-white shadow-lg">
              {searchResults.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">No CRM results found.</div>
              ) : (
                <div className="max-h-72 overflow-y-auto py-2">
                  {searchResults.map((result) => (
                    <button
                      key={`${result.label}-${result.description}`}
                      type="button"
                      onClick={() => {
                        result.action();
                        setSearchTerm('');
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <p className="text-sm font-semibold text-gray-900">{result.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{result.description}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
        <nav className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsContactFormOpen(false);
                  setIsLeadModalOpen(false);
                  setIsSaleModalOpen(false);
                }}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {activeTab === 'overview' && (
        <>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Overview</h2>
            <p className="text-sm text-gray-600">Welcome back! Here's what's happening with your business today.</p>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className={`${stat.cardBg} rounded-xl p-6 shadow-sm border ${stat.borderColor}`}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-gray-900">{stat.label}</p>
                    <div className={`w-8 h-8 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                      {typeof Icon === 'string' ? (
                        <span className={`text-sm font-bold ${stat.iconColor}`}>{Icon}</span>
                      ) : (
                        <Icon className={`w-4 h-4 ${stat.iconColor}`} />
                      )}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              );
            })}
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-h-[245px]">
              <h3 className="text-lg font-semibold text-gray-900 mb-10">Recent Activity</h3>
              {activities.length === 0 ? (
                <div className="h-32 flex items-center justify-center">
                  <p className="text-sm text-gray-400">Recent activity will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {activities.map((activity) => (
                    <div key={activity.id} className="rounded-lg bg-gray-50 px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-5">Quick Actions</h3>
              <div className="space-y-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action.target)}
                      className={`w-full h-12 rounded-lg px-4 flex items-center gap-3 text-sm font-semibold transition-colors ${
                        action.primary
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-95'
                          : 'bg-white/80 text-gray-900 hover:bg-white'
                      }`}
                    >
                      {typeof Icon === 'string' ? (
                        <span className="w-5 h-5 inline-flex items-center justify-center text-sm font-bold">{Icon}</span>
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                      {action.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === 'contacts' && (
        <>
          <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Contacts</h2>
              <p className="text-sm text-gray-600">Manage your business contacts</p>
            </div>
            <button
              onClick={openContactCreate}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Contact
            </button>
          </section>


            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-h-[255px]">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </div>

              <div className="flex min-h-[175px] flex-col items-center justify-center text-center">
                {contacts.length === 0 ? (
                  <>
                    <Users className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-sm text-gray-500">No contacts yet. Add your first contact to get started!</p>
                  </>
                ) : (
                  <div className="w-full space-y-3 text-left">
                    {contacts.map((contact) => (
                      <div key={contact.id} className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-primary-100 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-sm font-bold text-primary-600">
                            {contact.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{contact.name}</p>
                            <p className="text-xs text-gray-500">{contact.company || 'No company added'}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                          <div className="rounded-xl bg-gray-50 px-4 py-2">
                            <span className="block font-medium text-gray-500">Email</span>
                            <span className="text-gray-900">{contact.email || '-'}</span>
                          </div>
                          <div className="rounded-xl bg-gray-50 px-4 py-2">
                            <span className="block font-medium text-gray-500">Phone</span>
                            <span className="text-gray-900">{contact.phone || '-'}</span>
                          </div>
                          <div className="rounded-xl bg-gray-50 px-4 py-2 sm:col-span-2">
                            <span className="block font-medium text-gray-500">Notes</span>
                            <span className="text-gray-900">{contact.notes || '-'}</span>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openContactEdit(contact)}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteContact(contact)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

          {isContactFormOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
              <section className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{editingContact ? 'Edit Contact' : 'Add New Contact'}</h3>
                    <p className="text-sm text-gray-600">{editingContact ? 'Update this business contact record.' : 'Create a new business contact record.'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingContact(null);
                      setIsContactFormOpen(false);
                    }}
                    className="rounded-lg p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form className="space-y-5" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contact-name">
                      Full Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      defaultValue={editingContact?.name || ''}
                      placeholder="Enter full name"
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contact-company">
                      Company
                    </label>
                    <input
                      id="contact-company"
                      name="company"
                      type="text"
                      defaultValue={editingContact?.company || ''}
                      placeholder="Enter company name"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contact-email">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      defaultValue={editingContact?.email || ''}
                      placeholder="Enter email address"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contact-phone">
                      Phone
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      defaultValue={editingContact?.phone || ''}
                      placeholder="Enter phone number"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contact-notes">
                    Notes
                  </label>
                  <textarea
                    id="contact-notes"
                    name="notes"
                    rows={4}
                    defaultValue={editingContact?.notes || ''}
                    placeholder="Add notes about this contact"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingContact(null);
                      setIsContactFormOpen(false);
                    }}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
                  >
                    {editingContact ? 'Update Contact' : 'Save Contact'}
                  </button>
                </div>
                </form>
              </section>
            </div>
          )}
        </>
      )}

      {activeTab === 'leads' && (
        <>
          <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Leads</h2>
              <p className="text-sm text-gray-600">Track and manage your sales leads</p>
            </div>
            <button
              onClick={openLeadCreate}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Lead
            </button>
          </section>

          <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-h-[255px]">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search leads..."
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div className="flex min-h-[175px] flex-col items-center justify-center text-center">
              {leads.length === 0 ? (
                <>
                  <Target className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500">No leads yet. Add your first lead to get started!</p>
                </>
              ) : (
                <div className="w-full space-y-3 text-left">
                  {leads.map((lead) => (
                    <div key={lead.id} className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-blue-100 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                          <Target className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{lead.name}</p>
                          <p className="text-xs text-gray-500">{lead.email || '-'}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl bg-gray-50 px-4 py-2">
                          <span className="block font-medium text-gray-500">Phone</span>
                          <span className="text-gray-900">{lead.phone || '-'}</span>
                        </div>
                        <div className="rounded-xl bg-gray-50 px-4 py-2">
                          <span className="block font-medium text-gray-500">Source</span>
                          <span className="text-gray-900">{lead.source || '-'}</span>
                        </div>
                        <div className="rounded-xl bg-gray-50 px-4 py-2">
                          <span className="block font-medium text-gray-500">Stage</span>
                          <select
                            value={lead.stage || 'New'}
                            onChange={(e) => handleLeadStageChange(lead, e.target.value)}
                            className="mt-1 rounded-lg border border-gray-300 px-2 py-1 text-xs font-medium focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                          >
                            <option value="New">New</option>
                            <option value="Considering">Considering</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                        <div className="rounded-xl bg-gray-50 px-4 py-2">
                          <span className="block font-medium text-gray-500">Notes</span>
                          <span className="text-gray-900 truncate">{lead.notes || '-'}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => openLeadEdit(lead)}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteLead(lead)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {isLeadModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
              <section className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-gray-100">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold text-gray-900">{editingLead ? 'Edit Lead' : 'Add New Lead'}</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingLead(null);
                      setIsLeadModalOpen(false);
                    }}
                    className="rounded-lg p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form className="space-y-4" onSubmit={handleLeadSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="lead-name">
                      Name *
                    </label>
                    <input
                      id="lead-name"
                      name="name"
                      type="text"
                      defaultValue={editingLead?.name || ''}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="lead-email">
                      Email
                    </label>
                    <input
                      id="lead-email"
                      name="email"
                      type="email"
                      defaultValue={editingLead?.email || ''}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="lead-phone">
                      Phone
                    </label>
                    <input
                      id="lead-phone"
                      name="phone"
                      type="tel"
                      defaultValue={editingLead?.phone || ''}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="lead-source">
                      Source
                    </label>
                    <input
                      id="lead-source"
                      name="source"
                      type="text"
                      defaultValue={editingLead?.source || ''}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="lead-stage">
                      Stage
                    </label>
                    <select
                      id="lead-stage"
                      name="stage"
                      defaultValue={editingLead?.stage || 'New'}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    >
                      <option value="New">New</option>
                      <option value="Considering">Considering</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="lead-notes">
                      Notes
                    </label>
                    <textarea
                      id="lead-notes"
                      name="notes"
                      rows={3}
                      defaultValue={editingLead?.notes || ''}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingLead(null);
                        setIsLeadModalOpen(false);
                      }}
                      className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
                    >
                      {editingLead ? 'Update Lead' : 'Add Lead'}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          )}
        </>
      )}

      {activeTab === 'sales' && (
        <>
          <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Sales</h2>
              <p className="text-sm text-gray-600">Monitor your sales pipeline</p>
            </div>
            <button
              onClick={openSaleCreate}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Record Sale
            </button>
          </section>

          <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-h-[255px]">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search sales..."
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div className="flex min-h-[175px] flex-col items-center justify-center text-center">
              {sales.length === 0 ? (
                <>
                  <TrendingUp className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500">No sales yet. Record your first sale to get started!</p>
                </>
              ) : (
                <div className="w-full space-y-3 text-left">
                  {sales.map((sale) => (
                    <div key={sale.id} className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-green-100 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-sm font-bold text-green-600">
                          R
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{sale.customerName}</p>
                          <p className="text-xs text-gray-500">{sale.productName}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl bg-gray-50 px-4 py-2">
                          <span className="block font-medium text-gray-500">Amount</span>
                          <span className="font-semibold text-gray-900">R{sale.amount.toLocaleString()}</span>
                        </div>
                        <div className="rounded-xl bg-gray-50 px-4 py-2">
                          <span className="block font-medium text-gray-500">Payment Method</span>
                          <span className="text-gray-900">{sale.paymentMethod || '-'}</span>
                        </div>
                        <div className="rounded-xl bg-gray-50 px-4 py-2">
                          <span className="block font-medium text-gray-500">Date</span>
                          <span className="text-gray-900">{sale.date}</span>
                        </div>
                        <div className="rounded-xl bg-gray-50 px-4 py-2">
                          <span className="block font-medium text-gray-500">Notes</span>
                          <span className="text-gray-900 truncate">{sale.notes || '-'}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">{sale.status}</span>
                        <button
                          type="button"
                          onClick={() => openSaleEdit(sale)}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSale(sale)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {isSaleModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
              <section className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">{editingSale ? 'Edit Sale' : 'Record Sale'}</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSale(null);
                      setIsSaleModalOpen(false);
                    }}
                    className="rounded-lg p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form className="space-y-5" onSubmit={handleSaleSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="sale-customer">
                      Customer *
                    </label>
                    <select
                      id="sale-customer"
                      name="customerId"
                      required
                      defaultValue={editingSale?.customerId || ''}
                      onChange={(e) => {
                        const selectedContact = contacts.find((c) => c.id === Number(e.target.value));
                        const customerNameInput = document.querySelector('input[name="customerName"]') as HTMLInputElement;
                        if (selectedContact && customerNameInput) {
                          customerNameInput.value = selectedContact.name;
                        }
                      }}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      autoFocus
                    >
                      <option value="">Select a customer...</option>
                      {contacts.map((contact) => (
                        <option key={contact.id} value={contact.id}>
                          {contact.name} ({contact.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <input
                    type="hidden"
                    name="customerName"
                    defaultValue={editingSale?.customerName || ''}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="sale-product">
                      Product / Service *
                    </label>
                    <div className="flex gap-2">
                      <select
                        id="sale-product"
                        name="productId"
                        defaultValue={editingSale?.productId || ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            const selectedProduct = products.find((p) => p.id === Number(e.target.value));
                            const productNameInput = document.querySelector('input[name="productName"]') as HTMLInputElement;
                            if (selectedProduct && productNameInput) {
                              productNameInput.value = selectedProduct.name;
                            }
                          }
                        }}
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      >
                        <option value="">Select a product...</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} {product.price ? `- R${product.price.toLocaleString()}` : ''}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setIsProductModalOpen(true)}
                        className="inline-flex items-center justify-center rounded-lg border border-primary-500 px-3 py-2 text-sm font-semibold text-primary-500 hover:bg-primary-50 transition-colors"
                        title="Add new product"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <input
                    type="hidden"
                    name="productName"
                    defaultValue={editingSale?.productName || ''}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="sale-amount">
                      Amount (R) *
                    </label>
                    <input
                      id="sale-amount"
                      name="amount"
                      type="number"
                      min="0"
                      defaultValue={editingSale?.amount || ''}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="sale-paymentMethod">
                      Payment Method *
                    </label>
                    <input
                      id="sale-paymentMethod"
                      name="paymentMethod"
                      type="text"
                      defaultValue={editingSale?.paymentMethod || ''}
                      required
                      placeholder="e.g., Cash, Card, Bank Transfer"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="sale-status">
                        Status *
                      </label>
                      <select
                        id="sale-status"
                        name="status"
                        defaultValue={editingSale?.status || 'Pending'}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="sale-date">
                        Sale Date *
                      </label>
                      <input
                        id="sale-date"
                        name="date"
                        type="date"
                        defaultValue={editingSale?.date || new Date().toISOString().split('T')[0]}
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="sale-notes">
                      Notes
                    </label>
                    <textarea
                      id="sale-notes"
                      name="notes"
                      rows={3}
                      defaultValue={editingSale?.notes || ''}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSale(null);
                        setIsSaleModalOpen(false);
                      }}
                      className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
                    >
                      {editingSale ? 'Update Sale' : 'Save Sale'}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          )}

          {isProductModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
              <section className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-gray-100">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold text-gray-900">Add New Product</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProductModalOpen(false);
                      setNewProductName('');
                      setNewProductPrice('');
                      setNewProductDescription('');
                    }}
                    className="rounded-lg p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const newId = handleAddProduct(newProductName, Number(newProductPrice) || 0, newProductDescription);
                    // Update the hidden product name input
                    const productNameInput = document.querySelector('input[name="productName"]') as HTMLInputElement;
                    if (productNameInput) {
                      productNameInput.value = newProductName;
                    }
                    // Update the product dropdown
                    const productSelect = document.querySelector('select[name="productId"]') as HTMLSelectElement;
                    if (productSelect) {
                      productSelect.value = String(newId);
                    }
                    setIsProductModalOpen(false);
                    setNewProductName('');
                    setNewProductPrice('');
                    setNewProductDescription('');
                  }}
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="new-product-name">
                      Product Name *
                    </label>
                    <input
                      id="new-product-name"
                      type="text"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="new-product-price">
                      Price (R) *
                    </label>
                    <input
                      id="new-product-price"
                      type="number"
                      min="0"
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(e.target.value)}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="new-product-description">
                      Description
                    </label>
                    <textarea
                      id="new-product-description"
                      value={newProductDescription}
                      onChange={(e) => setNewProductDescription(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProductModalOpen(false);
                        setNewProductName('');
                        setNewProductPrice('');
                        setNewProductDescription('');
                      }}
                      className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
                    >
                      Add Product
                    </button>
                  </div>
                </form>
              </section>
            </div>
          )}
        </>
      )}

      {activeTab === 'reports' && (
        <>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Reports</h2>
            <p className="text-sm text-gray-600">Analyze your business performance</p>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-8">Sales Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Sales Amount</span>
                  <span className="font-medium text-gray-900">R{sales.filter(s => s.status === 'Completed').reduce((total, sale) => total + sale.amount, 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Completed Sales</span>
                  <span className="font-medium text-gray-900">{sales.filter(s => s.status === 'Completed').length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Pending Amount</span>
                  <span className="font-medium text-gray-900">R{sales.filter(s => s.status === 'Pending').reduce((total, sale) => total + sale.amount, 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-8">Lead Conversion</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Leads</span>
                  <span className="font-medium text-gray-900">{leads.length}</span>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-xs font-semibold text-gray-700 mb-3">Leads by Stage</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-600">New</span>
                    </div>
                    <span className="font-semibold text-gray-900">{leads.filter(l => l.stage === 'New').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-600">Considering</span>
                    </div>
                    <span className="font-semibold text-gray-900">{leads.filter(l => l.stage === 'Considering').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-600">Active</span>
                    </div>
                    <span className="font-semibold text-gray-900">{leads.filter(l => l.stage === 'Active').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-gray-600">Inactive</span>
                    </div>
                    <span className="font-semibold text-gray-900">{leads.filter(l => l.stage === 'Inactive').length}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Conversion Rate</span>
                  <span className="font-medium text-gray-900">{leads.length > 0 ? Math.round((leads.filter(l => l.stage === 'Active').length / leads.length) * 100) : 0}%</span>
                </div>
              </div>
            </div>
          </section>

        </>
      )}
    </div>
  );
};

export default CRM;






