// src/pages/application/CRM.tsx

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Home, Users, Target, TrendingUp, BarChart3, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Hooks
import { useContacts } from '../../hooks/crm/useContacts';
import { useLeads } from '../../hooks/crm/useLeads';
import { useSales } from '../../hooks/crm/useSales';
import { useProducts } from '../../hooks/crm/useProducts';
import { useActivities } from '../../hooks/crm/useActivities';

// Tab Components
import { OverviewTab } from '../../components/crm/OverviewTab';
import { ContactsTab } from '../../components/crm/ContactsTab';
import { LeadsTab } from '../../components/crm/LeadsTab';
import { SalesTab } from '../../components/crm/SalesTab';
import { ReportsTab } from '../../components/crm/ReportsTab';

// Modal Components
import { ContactFormModal } from '../../components/crm/ContactFormModal';
import { LeadFormModal } from '../../components/crm/LeadFormModal';
import { SaleFormModal } from '../../components/crm/SaleFormModal';

// Types
import type { Contact } from '../../interfaces/crm/contact.interface';
import type { Lead } from '../../interfaces/crm/lead.interface';
import type { Sale } from '../../interfaces/crm/sale.interface';

type CRMTab = 'overview' | 'contacts' | 'leads' | 'sales' | 'reports';

const navItems: Array<{ id: CRMTab; label: string; icon: React.ElementType }> = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'leads', label: 'Leads', icon: Target },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'sales', label: 'Sales', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
];

export const CRM: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<CRMTab>('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [showContactForm, setShowContactForm] = useState(false);
    const [showLeadForm, setShowLeadForm] = useState(false);
    const [showSaleForm, setShowSaleForm] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const [editingSale, setEditingSale] = useState<Sale | null>(null);

    // Hooks
    const { contacts, fetchContacts, createContact, updateContact, deleteContact, loading: contactsLoading } = useContacts();
    const { leads, fetchLeads, createLead, updateLead, updateLeadStage, deleteLead, loading: leadsLoading } = useLeads();
    const { sales, fetchSales, createSale, updateSale, deleteSale, loading: salesLoading } = useSales();
    const { products, fetchProducts, loading: productsLoading } = useProducts();
    const { activities, fetchRecentActivities, loading: activitiesLoading } = useActivities();

    const loading = contactsLoading || leadsLoading || salesLoading || productsLoading || activitiesLoading;

    // Calculate stats
    const stats = {
        totalContacts: contacts.length,
        totalLeads: leads.length,
        totalSales: sales.length,
        totalSalesAmount: sales.reduce((total, sale) => total + sale.amount, 0),
        monthlySalesAmount: sales
            .filter(sale => {
                const saleDate = new Date(sale.date);
                const now = new Date();
                return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
            })
            .reduce((total, sale) => total + sale.amount, 0),
        conversionRate: leads.length > 0 
            ? Math.round((sales.filter(s => s.status === 'Completed').length / leads.length) * 100)
            : 0,
    };

    // Load data
    useEffect(() => {
        const loadData = async () => {
            console.log('Loading CRM data...');
            try {
                await Promise.all([
                    fetchContacts(),
                    fetchLeads(),
                    fetchSales(),
                    fetchProducts(),
                ]);
                await fetchRecentActivities(10);
                console.log('CRM data loaded successfully');
            } catch (error) {
                console.error('Error loading CRM data:', error);
            }
        };
        loadData();
    }, []);

    // Handlers
    const handleQuickAction = (action: 'contact' | 'lead' | 'sale') => {
        console.log('Quick action triggered:', action);
        setShowContactForm(false);
        setShowLeadForm(false);
        setShowSaleForm(false);
        setEditingContact(null);
        setEditingLead(null);
        setEditingSale(null);

        if (action === 'contact') {
            setActiveTab('contacts');
            setShowContactForm(true);
        } else if (action === 'lead') {
            setActiveTab('leads');
            setShowLeadForm(true);
        } else {
            setActiveTab('sales');
            setShowSaleForm(true);
        }
    };

    const handleContactSubmit = async (data: any) => {
        console.log('Contact submit called with data:', data);
        try {
            if (editingContact) {
                await updateContact(editingContact.id, data);
            } else {
                await createContact(data);
            }
            setShowContactForm(false);
            setEditingContact(null);
        } catch (error) {
            console.error('Error saving contact:', error);
        }
    };

    const handleLeadSubmit = async (data: any) => {
        console.log('Lead submit called with data:', data);
        try {
            if (editingLead) {
                await updateLead(editingLead.id, data);
            } else {
                await createLead(data);
            }
            setShowLeadForm(false);
            setEditingLead(null);
        } catch (error) {
            console.error('Error saving lead:', error);
        }
    };

    const handleSaleSubmit = async (data: any) => {
        console.log('Sale submit called with data:', data);
        try {
            if (editingSale) {
                await updateSale(editingSale.id, data);
            } else {
                await createSale(data);
            }
            setShowSaleForm(false);
            setEditingSale(null);
        } catch (error) {
            console.error('Error saving sale:', error);
        }
    };

    const handleLeadStageChange = async (lead: Lead, stage: string) => {
        console.log('Lead stage change:', lead.id, stage);
        await updateLeadStage(lead.id, stage as any);
    };

    // Debug: Log current state
    console.log('CRM State:', {
        activeTab,
        contactsCount: contacts.length,
        leadsCount: leads.length,
        salesCount: sales.length,
        productsCount: products.length,
        showContactForm,
        showLeadForm,
        showSaleForm,
    });

    // Render active tab
    const renderTab = () => {
        console.log('Rendering tab:', activeTab);
        switch (activeTab) {
            case 'overview':
                return (
                    <OverviewTab
                        stats={stats}
                        activities={activities}
                        onQuickAction={handleQuickAction}
                    />
                );
            case 'contacts':
                return (
                    <ContactsTab
                        contacts={contacts}
                        loading={loading}
                        onAdd={() => {
                            console.log('Add contact clicked from ContactsTab');
                            setEditingContact(null);
                            setShowContactForm(true);
                        }}
                        onEdit={(contact) => {
                            console.log('Edit contact from ContactsTab:', contact);
                            setEditingContact(contact);
                            setShowContactForm(true);
                        }}
                        onDelete={deleteContact}
                    />
                );
            case 'leads':
                return (
                    <LeadsTab
                        leads={leads}
                        loading={loading}
                        onAdd={() => {
                            console.log('Add lead clicked from LeadsTab');
                            setEditingLead(null);
                            setShowLeadForm(true);
                        }}
                        onEdit={(lead) => {
                            console.log('Edit lead from LeadsTab:', lead);
                            setEditingLead(lead);
                            setShowLeadForm(true);
                        }}
                        onDelete={deleteLead}
                        onStageChange={handleLeadStageChange}
                    />
                );
            case 'sales':
                return (
                    <SalesTab
                        sales={sales}
                        products={products}
                        contacts={contacts}
                        loading={loading}
                        onAdd={() => {
                            console.log('Add sale clicked from SalesTab');
                            setEditingSale(null);
                            setShowSaleForm(true);
                        }}
                        onEdit={(sale) => {
                            console.log('Edit sale from SalesTab:', sale);
                            setEditingSale(sale);
                            setShowSaleForm(true);
                        }}
                        onDelete={deleteSale}
                    />
                );
            case 'reports':
                return <ReportsTab leads={leads} sales={sales} />;
            default:
                return null;
        }
    };

    // Search logic
    const searchResults = [
        ...contacts.map(c => ({ label: c.name, description: 'Contact', action: () => { setActiveTab('contacts'); setSearchTerm(''); } })),
        ...leads.map(l => ({ label: l.name, description: 'Lead', action: () => { setActiveTab('leads'); setSearchTerm(''); } })),
        ...sales.map(s => ({ label: `R${s.amount}`, description: `Sale - ${s.customerName}`, action: () => { setActiveTab('sales'); setSearchTerm(''); } })),
    ].filter(result => 
        searchTerm.trim() && 
        `${result.label} ${result.description}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
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
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                    {searchTerm.trim() && searchResults.length > 0 && (
                        <div className="absolute right-0 top-11 z-40 w-full rounded-xl border border-gray-100 bg-white shadow-lg">
                            <div className="max-h-72 overflow-y-auto py-2">
                                {searchResults.map((result) => (
                                    <button
                                        key={`${result.label}-${result.description}`}
                                        type="button"
                                        onClick={() => {
                                            console.log('Search result clicked:', result.label);
                                            result.action();
                                        }}
                                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <p className="text-sm font-semibold text-gray-900">{result.label}</p>
                                        <p className="text-xs text-gray-500 mt-1">{result.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
                <nav className="flex flex-wrap items-center gap-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.label}
                                onClick={() => {
                                    console.log('Tab clicked:', item.id);
                                    setActiveTab(item.id);
                                    setShowContactForm(false);
                                    setShowLeadForm(false);
                                    setShowSaleForm(false);
                                }}
                                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
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

            {/* Content */}
            {renderTab()}

            {/* Modals */}
            <ContactFormModal
                isOpen={showContactForm}
                onClose={() => {
                    console.log('Contact form closed');
                    setShowContactForm(false);
                    setEditingContact(null);
                }}
                onSubmit={handleContactSubmit}
                initialData={editingContact}
                loading={loading}
            />

            <LeadFormModal
                isOpen={showLeadForm}
                onClose={() => {
                    console.log('Lead form closed');
                    setShowLeadForm(false);
                    setEditingLead(null);
                }}
                onSubmit={handleLeadSubmit}
                initialData={editingLead}
                loading={loading}
            />

            <SaleFormModal
                isOpen={showSaleForm}
                onClose={() => {
                    console.log('Sale form closed');
                    setShowSaleForm(false);
                    setEditingSale(null);
                }}
                onSubmit={handleSaleSubmit}
                initialData={editingSale}
                products={products}
                contacts={contacts}
                loading={loading}
            />
        </div>
    );
};

export default CRM;