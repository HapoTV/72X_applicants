import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BarChart3,
  CreditCard,
  FileText,
  Home,
  Search,
  Shield,
} from 'lucide-react';

// Hooks
import { useQuotes, useInvoices, useExpenses, useFinanceStats } from '../../hooks/finance';

// Components
import {
  OverviewTab,
  QuotesTab,
  InvoicesTab,
  ExpensesTab,
  ReportsTab,
  QuoteFormModal,
  InvoiceFormModal,
  ExpenseFormModal,
} from '../../components/finance';

// Types
import type { FinanceTab, Contact } from '../../interfaces/FinanceData';

// Load CRM contacts from localStorage
const loadCrmContacts = (): Contact[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem('crm_contacts');
    return stored ? (JSON.parse(stored) as Contact[]) : [];
  } catch {
    return [];
  }
};

const navItems = [
  { id: 'overview' as FinanceTab, label: 'Overview', icon: Home },
  { id: 'quotes' as FinanceTab, label: 'Quotes', icon: FileText },
  { id: 'invoices' as FinanceTab, label: 'Invoices', icon: CreditCard },
  { id: 'expenses' as FinanceTab, label: 'Expenses', icon: Shield },
  { id: 'reports' as FinanceTab, label: 'Reports', icon: BarChart3 },
];

const FinanceManager: React.FC = () => {
  const navigate = useNavigate();

  // Hooks
  const { quotes, createQuote, updateQuote, deleteQuote, updateQuoteStatus } = useQuotes();
  const { invoices, createInvoice, updateInvoice, deleteInvoice, updateInvoiceStatus } =
    useInvoices();
  const { expenses, createExpense, updateExpense, deleteExpense } = useExpenses();

  // State
  const [activeTab, setActiveTab] = useState<FinanceTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Quote form state
  const [quoteFormMode, setQuoteFormMode] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [quoteFilter, setQuoteFilter] = useState<'All' | 'Draft' | 'Sent' | 'Declined' | 'Accepted'>(
    'All'
  );

  // Invoice form state
  const [invoiceFormMode, setInvoiceFormMode] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [invoiceFilter, setInvoiceFilter] = useState<
    'All' | 'Draft' | 'Awaiting Payment' | 'Paid' | 'Overdue'
  >('All');

  // Expense form state
  const [expenseFormMode, setExpenseFormMode] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);

  // Get CRM contacts
  const crmContacts = useMemo(() => loadCrmContacts(), []);

  // Calculate stats
  const stats = useFinanceStats(quotes, invoices, expenses);

  // Filter quotes
  const filteredQuotes = useMemo(() => {
    if (quoteFilter === 'All') return quotes;
    if (quoteFilter === 'Declined') {
      return quotes.filter((q) => q.status === 'Rejected');
    }
    return quotes.filter((q) => q.status === quoteFilter);
  }, [quotes, quoteFilter]);

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    if (invoiceFilter === 'All') return invoices;
    return invoices.filter((i) => i.status === invoiceFilter);
  }, [invoices, invoiceFilter]);

  // Calculate cash balance
  const cashBalance = useMemo(() => {
    const paidTotal = invoices
      .filter((i) => i.status === 'Paid')
      .reduce((sum, i) => sum + i.total, 0);
    const expenseTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
    return paidTotal - expenseTotal;
  }, [invoices, expenses]);

  // Quote handlers
  const handleCreateQuote = async (quoteData: any) => {
    try {
      await createQuote({
        client: quoteData.client || 'New Customer',
        reference: quoteData.reference || 'Reference not set',
        total: quoteData.total,
        items: quoteData.items,
        status: quoteData.status,
        createdAt: quoteData.createdAt,
        expiresAt: quoteData.expiresAt,
      });
      setQuoteFormMode('list');
      setSelectedQuoteId(null);
    } catch (error) {
      console.error('Error creating quote:', error);
    }
  };

  const handleUpdateQuote = async (quoteData: any) => {
    try {
      if (selectedQuoteId) {
        await updateQuote(selectedQuoteId, {
          client: quoteData.client,
          reference: quoteData.reference,
          total: quoteData.total,
          items: quoteData.items,
          status: quoteData.status,
          createdAt: quoteData.createdAt,
          expiresAt: quoteData.expiresAt,
        });
      }
      setQuoteFormMode('list');
      setSelectedQuoteId(null);
    } catch (error) {
      console.error('Error updating quote:', error);
    }
  };

  const handleDeleteQuote = async () => {
    try {
      if (selectedQuoteId) {
        await deleteQuote(selectedQuoteId);
      }
      setQuoteFormMode('list');
      setSelectedQuoteId(null);
    } catch (error) {
      console.error('Error deleting quote:', error);
    }
  };

  const handleOpenEditQuote = (quote: any) => {
    setQuoteFormMode('edit');
    setSelectedQuoteId(quote.id);
  };

  // Invoice handlers
  const handleCreateInvoice = async (invoiceData: any) => {
    try {
      await createInvoice({
        customer: invoiceData.customer || 'New Customer',
        invoiceNumber: invoiceData.invoiceNumber || '',
        reference: invoiceData.reference || '',
        total: invoiceData.total,
        items: invoiceData.items,
        status: invoiceData.status,
        issuedAt: invoiceData.issuedAt,
        dueAt: invoiceData.dueAt,
      });
      setInvoiceFormMode('list');
      setSelectedInvoiceId(null);
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const handleUpdateInvoice = async (invoiceData: any) => {
    try {
      if (selectedInvoiceId) {
        await updateInvoice(selectedInvoiceId, {
          customer: invoiceData.customer,
          invoiceNumber: invoiceData.invoiceNumber,
          reference: invoiceData.reference,
          total: invoiceData.total,
          items: invoiceData.items,
          status: invoiceData.status,
          issuedAt: invoiceData.issuedAt,
          dueAt: invoiceData.dueAt,
        });
      }
      setInvoiceFormMode('list');
      setSelectedInvoiceId(null);
    } catch (error) {
      console.error('Error updating invoice:', error);
    }
  };

  const handleDeleteInvoice = async () => {
    try {
      if (selectedInvoiceId) {
        await deleteInvoice(selectedInvoiceId);
      }
      setInvoiceFormMode('list');
      setSelectedInvoiceId(null);
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const handleOpenEditInvoice = (invoice: any) => {
    setInvoiceFormMode('edit');
    setSelectedInvoiceId(invoice.id);
  };

  // Expense handlers
  const handleCreateExpense = async (expenseData: any) => {
    try {
      await createExpense({
        amount: expenseData.amount,
        description: expenseData.description,
        spentAt: expenseData.spentAt,
        spentOn: expenseData.spentOn,
        proof: expenseData.proof,
      });
      setExpenseFormMode('list');
      setSelectedExpenseId(null);
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  };

  const handleUpdateExpense = async (expenseData: any) => {
    try {
      if (selectedExpenseId) {
        await updateExpense(selectedExpenseId, {
          amount: expenseData.amount,
          description: expenseData.description,
          spentAt: expenseData.spentAt,
          spentOn: expenseData.spentOn,
          proof: expenseData.proof,
        });
      }
      setExpenseFormMode('list');
      setSelectedExpenseId(null);
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleDeleteExpense = async () => {
    try {
      if (selectedExpenseId) {
        await deleteExpense(selectedExpenseId);
      }
      setExpenseFormMode('list');
      setSelectedExpenseId(null);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleOpenEditExpense = (expense: any) => {
    setExpenseFormMode('edit');
    setSelectedExpenseId(expense.id);
  };

  // Print handlers
  const openPrintableWindow = (title: string, content: string) => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;
    printWindow.document.write(
      `<!DOCTYPE html><html><head><title>${title}</title><style>body{font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;margin:24px;color:#111827;}h1,h2,h3,p{margin:0;}table{width:100%;border-collapse:collapse;margin-top:16px;}th,td{padding:10px 8px;border:1px solid #E5E7EB;text-align:left;}th{background:#F3F4F6;font-weight:600;} .header {display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:24px;} .section {margin-top:24px;} .meta {margin-top:8px;color:#4B5563;} </style></head><body><div class="header"><div><h1>${title}</h1></div></div>${content}</body></html>`
    );
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handlePrintQuote = (quote: any) => {
    const itemsHtml = (quote.items ?? [])
      .map(
        (item: any) =>
          `<tr><td>${item.description || '-'}</td><td>${item.quantity}</td><td>R${item.unitPrice.toLocaleString()}</td><td>R${(
            item.quantity * item.unitPrice
          ).toLocaleString()}</td></tr>`
      )
      .join('');
    const content = `
      <div>
        <div class="section">
          <h2>Quote details</h2>
          <p class="meta">Quote #: ${quote.id}</p>
          <p class="meta">Reference: ${quote.reference}</p>
          <p class="meta">Customer: ${quote.client}</p>
          <p class="meta">Issue date: ${quote.createdAt}</p>
          <p class="meta">Expiration date: ${quote.expiresAt}</p>
          <p class="meta">Status: ${quote.status}</p>
        </div>
        <div class="section">
          <table>
            <thead><tr><th>Description</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <p class="meta">Subtotal: R${quote.total.toLocaleString()}</p>
        </div>
      </div>`;
    openPrintableWindow(`Quote ${quote.id}`, content);
  };

  const handlePrintInvoice = (invoice: any) => {
    const itemsHtml = (invoice.items ?? [])
      .map(
        (item: any) =>
          `<tr><td>${item.description || '-'}</td><td>${item.quantity}</td><td>R${item.unitPrice.toLocaleString()}</td><td>R${(
            item.quantity * item.unitPrice
          ).toLocaleString()}</td></tr>`
      )
      .join('');
    const content = `
      <div>
        <div class="section">
          <h2>Invoice details</h2>
          <p class="meta">Invoice #: ${invoice.invoiceNumber || invoice.id}</p>
          <p class="meta">Reference: ${invoice.reference}</p>
          <p class="meta">Customer: ${invoice.customer}</p>
          <p class="meta">Issue date: ${invoice.issuedAt}</p>
          <p class="meta">Due date: ${invoice.dueAt}</p>
          <p class="meta">Status: ${invoice.status}</p>
        </div>
        <div class="section">
          <table>
            <thead><tr><th>Description</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <p class="meta">Total: R${invoice.total.toLocaleString()}</p>
        </div>
      </div>`;
    openPrintableWindow(`Invoice ${invoice.invoiceNumber || invoice.id}`, content);
  };
  // Render
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
              <h1 className="text-2xl font-bold text-gray-900">Finance Manager</h1>
            </div>
          </div>
          <p className="text-gray-600 mt-2">
            Manage quotes, invoices, expenses, and financial health in one place.
          </p>
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search finance records..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
        <nav className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
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

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab
          stats={stats}
          quotes={quotes}
          invoices={invoices}
          cashBalance={cashBalance}
        />
      )}

      {activeTab === 'quotes' && (
  <QuotesTab
    quotes={quotes}
    filteredQuotes={filteredQuotes}
    filter={quoteFilter}
    onFilterChange={setQuoteFilter}
    onStatusChange={updateQuoteStatus}
    onEdit={handleOpenEditQuote}
    onCreateNew={() => {
      setQuoteFormMode('create');
      setSelectedQuoteId(null);
    }}
  />
)}

      {activeTab === 'invoices' && (
  <InvoicesTab
    invoices={invoices}
    filteredInvoices={filteredInvoices}
    filter={invoiceFilter}
    onFilterChange={setInvoiceFilter}
    onStatusChange={updateInvoiceStatus}
    onEdit={handleOpenEditInvoice}
    onCreateNew={() => {
      setInvoiceFormMode('create');
      setSelectedInvoiceId(null);
    }}
  />
)}

      {activeTab === 'expenses' && (
  <ExpensesTab
    expenses={expenses}
    onEdit={handleOpenEditExpense}
    onCreateNew={() => {
      setExpenseFormMode('create');
      setSelectedExpenseId(null);
    }}
  />
)}

      {activeTab === 'reports' && (
  <ReportsTab
    stats={stats}
    invoices={invoices}
    cashBalance={cashBalance}
  />
)}

            {/* Modals */}

      {activeTab === 'quotes' && quoteFormMode !== 'list' && (
        <QuoteFormModal
         isOpen={true}
          mode={quoteFormMode}
          quote={
            selectedQuoteId
              ? quotes.find((q) => q.id === selectedQuoteId)
              : undefined
          }
          crmContacts={crmContacts}
          onClose={() => {
            setQuoteFormMode('list');
            setSelectedQuoteId(null);
          }}
          onSave={
            quoteFormMode === 'create'
              ? handleCreateQuote
              : handleUpdateQuote
          }
          onDelete={handleDeleteQuote}
          onSaveAndPrint={handleCreateQuote}
        />
      )}

      {activeTab === 'invoices' && invoiceFormMode !== 'list' && (
        <InvoiceFormModal
          isOpen={true}
          mode={invoiceFormMode}
          invoice={
            selectedInvoiceId
              ? invoices.find((i) => i.id === selectedInvoiceId)
              : undefined
          }
          quotes={quotes}
          onClose={() => {
            setInvoiceFormMode('list');
            setSelectedInvoiceId(null);
          }}
          onSave={
            invoiceFormMode === 'create'
              ? handleCreateInvoice
              : handleUpdateInvoice
          }
          onDelete={handleDeleteInvoice}
          onPrint={handlePrintInvoice}
        />
      )}

      {activeTab === 'expenses' && expenseFormMode !== 'list' && (
        <ExpenseFormModal
          isOpen={true}
          mode={expenseFormMode}
          expense={
            selectedExpenseId
              ? expenses.find((expense) => expense.id === selectedExpenseId)
              : undefined
          }
          onClose={() => {
            setExpenseFormMode('list');
            setSelectedExpenseId(null);
          }}
          onSave={
            expenseFormMode === 'create'
              ? handleCreateExpense
              : handleUpdateExpense
          }
          onDelete={handleDeleteExpense}
        />
      )}
    </div>
  );
};

export default FinanceManager;