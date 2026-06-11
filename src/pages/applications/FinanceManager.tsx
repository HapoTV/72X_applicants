import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  CreditCard,
  FileText,
  FilePlus,
  Home,
  Search,
  Shield,
  TrendingUp,
} from "lucide-react";

type FinanceTab = "overview" | "quotes" | "invoices" | "expenses" | "reports";

type Quote = {
  id: string;
  client: string;
  reference: string;
  total: number;
  items?: QuoteItem[];
  status: "Draft" | "Sent" | "Accepted" | "Rejected";
  createdAt: string;
  expiresAt: string;
};

type QuoteItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

type Invoice = {
  id: string;
  customer: string;
  invoiceNumber: string;
  reference: string;
  total: number;
  items?: QuoteItem[];
  status: "Draft" | "Awaiting Payment" | "Paid" | "Overdue";
  issuedAt: string;
  dueAt: string;
};

type InvoiceFilter = "All" | "Draft" | "Awaiting Payment" | "Paid" | "Overdue";

type Contact = {
  id: number | string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
};

type Expense = {
  id: string;
  amount: number;
  description: string;
  spentAt: string;
  spentOn: string;
  proof?: string;
};

const STORAGE_KEYS = {
  quotes: "finance_manager_quotes",
  invoices: "finance_manager_invoices",
  expenses: "finance_manager_expenses",
  crmContacts: "crm_contacts",
};

const loadStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
};

const saveStorage = <T,>(key: string, value: T) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const RandIcon = ({
  className,
}: {
  className?: string;
}) => <span className={`text-base font-bold ${className || ""}`}>R</span>;

const FinanceManager: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FinanceTab>("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [quoteFormMode, setQuoteFormMode] = useState<"list" | "create" | "edit">("list");
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [quoteDraft, setQuoteDraft] = useState<{
    client: string;
    quoteNumber: string;
    reference: string;
    total: number;
    items: QuoteItem[];
    status: Quote["status"];
    createdAt: string;
    expiresAt: string;
  }>({
    client: "",
    quoteNumber: "",
    reference: "",
    total: 0,
    items: [{ description: "", quantity: 1, unitPrice: 0 }],
    status: "Draft",
    createdAt: new Date().toISOString().slice(0, 10),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
  });
  const [invoiceFormMode, setInvoiceFormMode] = useState<"list" | "create" | "edit">("list");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [invoiceDraft, setInvoiceDraft] = useState<{
    customer: string;
    invoiceNumber: string;
    reference: string;
    total: number;
    items: QuoteItem[];
    status: Invoice["status"];
    issuedAt: string;
    dueAt: string;
  }>({
    customer: "",
    invoiceNumber: "",
    reference: "",
    total: 0,
    items: [{ description: "", quantity: 1, unitPrice: 0 }],
    status: "Draft",
    issuedAt: new Date().toISOString().slice(0, 10),
    dueAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
  });

  const [expenseFormMode, setExpenseFormMode] = useState<"list" | "create" | "edit">("list");
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [expenseDraft, setExpenseDraft] = useState<Expense>({
    id: "",
    amount: 0,
    description: "",
    spentAt: "",
    spentOn: new Date().toISOString().slice(0, 10),
    proof: "",
  });

  const [invoiceFilter, setInvoiceFilter] = useState<InvoiceFilter>("All");
  const invoiceFilterOptions: InvoiceFilter[] = [
    "All",
    "Draft",
    "Awaiting Payment",
    "Paid",
    "Overdue",
  ];
  const [quoteFilter, setQuoteFilter] = useState<"All" | "Draft" | "Sent" | "Declined" | "Accepted">("All");
  const quoteFilterOptions = ["All", "Draft", "Sent", "Declined", "Accepted"] as const;
  const [showQuoteSaveMenu, setShowQuoteSaveMenu] = useState(false);
  const [showInvoiceSaveMenu, setShowInvoiceSaveMenu] = useState(false);

  const todayString = new Date().toISOString().slice(0, 10);

  const [quotes, setQuotes] = useState<Quote[]>(() =>
    loadStorage<Quote[]>(STORAGE_KEYS.quotes, [
      {
        id: "Q-001",
        client: "Maputo Retail Co.",
        reference: "Retail Launch",
        total: 7800,
        status: "Sent",
        createdAt: "2026-05-12",
        expiresAt: "2026-06-12",
      },
      {
        id: "Q-002",
        client: "Sunrise Bakery",
        reference: "Bakery Refurb",
        total: 12450,
        status: "Draft",
        createdAt: "2026-05-25",
        expiresAt: "2026-06-25",
      },
    ]),
  );
  const [crmContacts] = useState<Contact[]>(() =>
    loadStorage<Contact[]>(STORAGE_KEYS.crmContacts, []),
  );
  const [invoices, setInvoices] = useState<Invoice[]>(() =>
    loadStorage<Invoice[]>(STORAGE_KEYS.invoices, [
      {
        id: "INV-1024",
        customer: "Maputo Retail Co.",
        invoiceNumber: "INV-1024",
        reference: "Store launch",
        total: 7800,
        status: "Awaiting Payment",
        issuedAt: "2026-05-15",
        dueAt: "2026-06-15",
      },
      {
        id: "INV-1025",
        customer: "Greenfield Services",
        invoiceNumber: "INV-1025",
        reference: "Consulting fee",
        total: 2300,
        status: "Paid",
        issuedAt: "2026-05-05",
        dueAt: "2026-05-20",
      },
    ]),
  );
  const [expenses, setExpenses] = useState<Expense[]>(() =>
    loadStorage<Expense[]>(STORAGE_KEYS.expenses, [
      {
        id: "EXP-001",
        amount: 450,
        description: "Printer cartridges and notepads",
        spentAt: "Stationery World",
        spentOn: "2026-05-28",
        proof: "receipt-stationery.pdf",
      },
      {
        id: "EXP-002",
        amount: 1280,
        description: "Delivery route fuel",
        spentAt: "FuelStop",
        spentOn: "2026-05-26",
        proof: "fuel-slip.jpg",
      },
    ]),
  );

  useEffect(() => saveStorage(STORAGE_KEYS.quotes, quotes), [quotes]);
  useEffect(() => saveStorage(STORAGE_KEYS.invoices, invoices), [invoices]);
  useEffect(() => saveStorage(STORAGE_KEYS.expenses, expenses), [expenses]);

  const filteredInvoices = useMemo(() => {
    if (invoiceFilter === "All") {
      return invoices;
    }
    if (invoiceFilter === "Draft") {
      return invoices.filter((invoice) => invoice.status === "Draft");
    }
    if (invoiceFilter === "Paid") {
      return invoices.filter((invoice) => invoice.status === "Paid");
    }
    if (invoiceFilter === "Awaiting Payment") {
      return invoices.filter((invoice) => invoice.status === "Awaiting Payment");
    }
    if (invoiceFilter === "Overdue") {
      return invoices.filter((invoice) => invoice.status === "Overdue");
    }
    return invoices;
  }, [invoiceFilter, invoices]);

  const filteredQuotes = useMemo(() => {
    switch (quoteFilter) {
      case "Draft":
        return quotes.filter((quote) => quote.status === "Draft");
      case "Sent":
        return quotes.filter((quote) => quote.status === "Sent");
      case "Declined":
        return quotes.filter((quote) => quote.status === "Rejected");
      case "Accepted":
        return quotes.filter((quote) => quote.status === "Accepted");
      default:
        return quotes;
    }
  }, [quoteFilter, quotes]);

  const cashBalance = useMemo(
    () =>
      invoices.reduce(
        (sum, invoice) =>
          invoice.status === "Paid" ? sum + invoice.total : sum,
        0,
      ) - expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [invoices, expenses],
  );

  const openQuotes = useMemo(
    () =>
      quotes.filter(
        (quote) => quote.status !== "Accepted" && quote.status !== "Rejected",
      ).length,
    [quotes],
  );
  const awaitingInvoices = useMemo(
    () => invoices.filter((invoice) => invoice.status === "Awaiting Payment").length,
    [invoices],
  );
  const overdueInvoices = useMemo(
    () => invoices.filter((invoice) => invoice.status === "Overdue").length,
    [invoices],
  );
  const monthlyExpenses = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses],
  );

  const summaryCards = [
    {
      label: "Cash Balance",
      value: `R${cashBalance.toLocaleString()}`,
      icon: RandIcon,
      cardBg: "bg-white",
      borderColor: "border-gray-100",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
    },
    {
      label: "Open Quotes",
      value: String(openQuotes),
      icon: FileText,
      cardBg: "bg-white",
      borderColor: "border-gray-100",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
    },
    {
      label: "Awaiting Payment",
      value: String(awaitingInvoices),
      icon: CreditCard,
      cardBg: "bg-white",
      borderColor: "border-gray-100",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-700",
    },
    {
      label: "Overdue",
      value: String(overdueInvoices),
      icon: CreditCard,
      cardBg: "bg-white",
      borderColor: "border-gray-100",
      iconBg: "bg-red-100",
      iconColor: "text-red-700",
    },
    {
      label: "Expenses This Month",
      value: `R${monthlyExpenses.toLocaleString()}`,
      icon: Shield,
      cardBg: "bg-white",
      borderColor: "border-gray-100",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-700",
    },
  ];

  const handleOpenCreateQuote = () => {
    setQuoteFormMode("create");
    setSelectedQuoteId(null);
    setQuoteDraft({
      client: "",
      quoteNumber: "",
      reference: "",
      total: 0,
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
      status: "Draft",
      createdAt: todayString,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
    });
  };

  const handleOpenEditQuote = (quote: Quote) => {
    setQuoteFormMode("edit");
    setSelectedQuoteId(quote.id);
    setQuoteDraft({
      client: quote.client,
      quoteNumber: quote.id,
      reference: quote.reference || "",
      total: quote.total,
      items: quote.items ?? [{ description: "", quantity: 1, unitPrice: 0 }],
      status: quote.status,
      createdAt: quote.createdAt,
      expiresAt: quote.expiresAt,
    });
  };

  const handleSaveQuote = () => {
    // compute total from items
    const items = quoteDraft.items ?? [];
    const computedTotal = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);

    const nextQuote: Quote = {
      id:
        quoteDraft.quoteNumber ||
        (quoteFormMode === "edit" && selectedQuoteId
          ? selectedQuoteId
          : `Q-${(quotes.length + 1).toString().padStart(3, "0")}`),
      client: quoteDraft.client || "New Customer",
      reference: quoteDraft.reference || "Reference not set",
      total: computedTotal,
      items,
      status: quoteDraft.status,
      createdAt: quoteDraft.createdAt,
      expiresAt: quoteDraft.expiresAt,
    };

    if (quoteFormMode === "edit" && selectedQuoteId) {
      setQuotes((prev) =>
        prev.map((quote) => (quote.id === selectedQuoteId ? nextQuote : quote)),
      );
    } else {
      setQuotes((prev) => [nextQuote, ...prev]);
    }

    setQuoteFormMode("list");
    setSelectedQuoteId(null);
  };

  const handleDeleteQuote = () => {
    if (!selectedQuoteId) return;
    setQuotes((prev) => prev.filter((quote) => quote.id !== selectedQuoteId));
    setQuoteFormMode("list");
    setSelectedQuoteId(null);
  };

  const handleUpdateQuoteStatus = (quoteId: string, status: Quote["status"]) => {
    setQuotes((prev) =>
      prev.map((quote) => (quote.id === quoteId ? { ...quote, status } : quote)),
    );
  };

  const handleUpdateInvoiceStatus = (invoiceId: string, status: Invoice["status"]) => {
    setInvoices((prev) =>
      prev.map((invoice) => (invoice.id === invoiceId ? { ...invoice, status } : invoice)),
    );
  };

  const openPrintableWindow = (title: string, content: string) => {
    if (typeof window === "undefined") return;
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html><html><head><title>${title}</title><style>body{font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;margin:24px;color:#111827;}h1,h2,h3,p{margin:0;}table{width:100%;border-collapse:collapse;margin-top:16px;}th,td{padding:10px 8px;border:1px solid #E5E7EB;text-align:left;}th{background:#F3F4F6;font-weight:600;} .header {display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:24px;} .section {margin-top:24px;} .meta {margin-top:8px;color:#4B5563;} </style></head><body><div class="header"><div><h1>${title}</h1></div></div>${content}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const createQuoteFromDraft = (): Quote => {
    const items = quoteDraft.items ?? [];
    const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    return {
      id:
        quoteDraft.quoteNumber ||
        (quoteFormMode === "edit" && selectedQuoteId
          ? selectedQuoteId
          : `Q-${(quotes.length + 1).toString().padStart(3, "0")}`),
      client: quoteDraft.client || "New Customer",
      reference: quoteDraft.reference || "Reference not set",
      total,
      items,
      status: quoteDraft.status,
      createdAt: quoteDraft.createdAt,
      expiresAt: quoteDraft.expiresAt,
    };
  };

  const createInvoiceFromDraft = (): Invoice => {
    const items = invoiceDraft.items ?? [];
    const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    return {
      id:
        invoiceDraft.invoiceNumber ||
        (invoiceFormMode === "edit" && selectedInvoiceId
          ? selectedInvoiceId
          : `INV-${(invoices.length + 1024).toString()}`),
      customer: invoiceDraft.customer || "New Customer",
      invoiceNumber: invoiceDraft.invoiceNumber || "",
      reference: invoiceDraft.reference || "",
      total,
      items,
      status: invoiceDraft.status,
      issuedAt: invoiceDraft.issuedAt,
      dueAt: invoiceDraft.dueAt,
    };
  };

  const printQuoteDraft = (quote: Quote) => {
    const itemsHtml = (quote.items ?? [])
      .map(
        (item) =>
          `<tr><td>${item.description || "-"}</td><td>${item.quantity}</td><td>R${item.unitPrice.toLocaleString()}</td><td>R${(
            item.quantity * item.unitPrice
          ).toLocaleString()}</td></tr>`,
      )
      .join("");
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

  const printInvoiceDraft = (invoice: Invoice) => {
    const itemsHtml = (invoice.items ?? [])
      .map(
        (item) =>
          `<tr><td>${item.description || "-"}</td><td>${item.quantity}</td><td>R${item.unitPrice.toLocaleString()}</td><td>R${(
            item.quantity * item.unitPrice
          ).toLocaleString()}</td></tr>`,
      )
      .join("");
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

  const handleSaveQuoteAndPrint = () => {
    const quote = createQuoteFromDraft();
    handleSaveQuote();
    printQuoteDraft(quote);
    setShowQuoteSaveMenu(false);
  };

  const handleSaveInvoiceAndPrint = () => {
    const invoice = createInvoiceFromDraft();
    handleSaveInvoice();
    printInvoiceDraft(invoice);
    setShowInvoiceSaveMenu(false);
  };

  const handleToggleQuoteMenu = () => setShowQuoteSaveMenu((prev) => !prev);
  const handleToggleInvoiceMenu = () => setShowInvoiceSaveMenu((prev) => !prev);

  const handleOpenEditInvoice = (invoice: Invoice) => {
    setInvoiceFormMode("edit");
    setSelectedInvoiceId(invoice.id);
    setInvoiceDraft({
      customer: invoice.customer,
      invoiceNumber: invoice.invoiceNumber || invoice.id,
      reference: invoice.reference || "",
      total: invoice.total,
      items: invoice.items ?? [{ description: "", quantity: 1, unitPrice: 0 }],
      status: invoice.status,
      issuedAt: invoice.issuedAt,
      dueAt: invoice.dueAt,
    });
  };

  const handleSaveInvoice = () => {
    const items = invoiceDraft.items ?? [];
    const computedTotal = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);

    const nextInvoice: Invoice = {
      id:
        invoiceDraft.invoiceNumber ||
        (invoiceFormMode === "edit" && selectedInvoiceId
          ? selectedInvoiceId
          : `INV-${(invoices.length + 1024).toString()}`),
      customer: invoiceDraft.customer || "New Customer",
      invoiceNumber: invoiceDraft.invoiceNumber || "",
      reference: invoiceDraft.reference || "",
      total: computedTotal,
      items,
      status: invoiceDraft.status,
      issuedAt: invoiceDraft.issuedAt,
      dueAt: invoiceDraft.dueAt,
    };

    if (invoiceFormMode === "edit" && selectedInvoiceId) {
      setInvoices((prev) =>
        prev.map((invoice) =>
          invoice.id === selectedInvoiceId ? nextInvoice : invoice,
        ),
      );
    } else {
      setInvoices((prev) => [nextInvoice, ...prev]);
    }

    setInvoiceFormMode("list");
    setSelectedInvoiceId(null);
  };

  const handleDeleteInvoice = () => {
    if (!selectedInvoiceId) return;
    setInvoices((prev) => prev.filter((invoice) => invoice.id !== selectedInvoiceId));
    setInvoiceFormMode("list");
    setSelectedInvoiceId(null);
  };

  const handleOpenCreateInvoice = () => {
    setInvoiceFormMode("create");
    setSelectedInvoiceId(null);
    setInvoiceDraft({
      customer: "",
      invoiceNumber: "",
      reference: "",
      total: 0,
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
      status: "Draft",
      issuedAt: todayString,
      dueAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
    });
  };

  const handleOpenCreateExpense = () => {
    setExpenseFormMode("create");
    setSelectedExpenseId(null);
    setExpenseDraft({
      id: "",
      amount: 0,
      description: "",
      spentAt: "",
      spentOn: todayString,
      proof: "",
    });
  };

  const handleOpenEditExpense = (expense: Expense) => {
    setExpenseFormMode("edit");
    setSelectedExpenseId(expense.id);
    setExpenseDraft({ ...expense });
  };

  const handleSaveExpense = () => {
    const nextExpense: Expense = {
      ...expenseDraft,
      id:
        expenseDraft.id ||
        `EXP-${(expenses.length + 1).toString().padStart(3, "0")}`,
    };

    if (expenseFormMode === "edit" && selectedExpenseId) {
      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === selectedExpenseId ? nextExpense : expense,
        ),
      );
    } else {
      setExpenses((prev) => [nextExpense, ...prev]);
    }

    setExpenseFormMode("list");
    setSelectedExpenseId(null);
  };

  const handleDeleteExpense = () => {
    if (!selectedExpenseId) return;
    setExpenses((prev) => prev.filter((expense) => expense.id !== selectedExpenseId));
    setExpenseFormMode("list");
    setSelectedExpenseId(null);
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
        <nav className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "overview"
                ? "bg-primary-500 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Home className="w-4 h-4" />
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("quotes")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "quotes"
                ? "bg-primary-500 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <FileText className="w-4 h-4" />
            Quotes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("invoices")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "invoices"
                ? "bg-primary-500 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Invoices
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("expenses")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "expenses"
                ? "bg-primary-500 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Shield className="w-4 h-4" />
            Expenses
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reports")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "reports"
                ? "bg-primary-500 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Reports
          </button>
        </nav>
      </div>

      {activeTab === "overview" && (
        <section className="space-y-6">
          <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-2">
            {summaryCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className={`${card.cardBg} rounded-xl p-6 shadow-sm border ${card.borderColor}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{card.label}</p>
                      <p className="mt-3 text-2xl font-semibold text-gray-900">{card.value}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                      {typeof Icon === 'string' ? (
                        <span className={`text-sm font-bold ${card.iconColor}`}>{Icon}</span>
                      ) : (
                        <Icon className={`w-4 h-4 ${card.iconColor}`} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Financial activities
                  </h2>
                  <p className="text-sm text-gray-500">
                    A quick view of the latest quote and invoice activity.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl bg-blue-50 p-4">
                  <p className="text-sm text-blue-700">Recent Quote</p>
                  <p className="mt-2 text-base font-semibold text-gray-900">
                    {quotes[0]?.id} • {quotes[0]?.client}
                  </p>
                  <p className="text-sm text-gray-600">
                    Expires {quotes[0]?.expiresAt}
                  </p>
                </div>
                <div className="rounded-2xl bg-green-50 p-4">
                  <p className="text-sm text-green-700">Recent Paid Invoice</p>
                  <p className="mt-2 text-base font-semibold text-gray-900">
                    {invoices.find((invoice) => invoice.status === "Paid")
                      ?.id || "None yet"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {invoices.find((invoice) => invoice.status === "Paid")
                      ? `Paid on ${invoices.find((invoice) => invoice.status === "Paid")?.issuedAt}`
                      : "No paid invoices available"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Performance trends
                  </h2>
                  <p className="text-sm text-gray-500">
                    Compare revenue and spending over the month.
                  </p>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  Updated today
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Revenue vs expenses</span>
                    <span>70%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full w-[70%] rounded-full bg-blue-600" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Invoice collection</span>
                    <span>42%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full w-[42%] rounded-full bg-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === "quotes" && (
        <section className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Quotes</h2>
              <p className="text-sm text-gray-500">
                Create, edit, and monitor all of your quotes from one dashboard.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              onClick={handleOpenCreateQuote}
            >
              <FilePlus className="h-4 w-4" />
              New Quote
            </button>
          </div>

          {quoteFormMode !== "list" && (
            <section className="space-y-4 rounded-3xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    {quoteFormMode === "create" ? "New Quote" : "Edit Quote"}
                  </h3>
                  <p className="text-sm text-blue-700">
                    Use the quote section to add line items, client details, and quote metadata.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setQuoteFormMode("list");
                      setSelectedQuoteId(null);
                    }}
                    className="rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
                  >
                    Cancel
                  </button>
                  {quoteFormMode === "edit" && selectedQuoteId && (
                    <button
                      type="button"
                      onClick={handleDeleteQuote}
                      className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                    >
                      Delete Quote
                    </button>
                  )}
                  <div className="relative inline-flex">
                    <button
                      type="button"
                      onClick={handleSaveQuote}
                      className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Save Quote
                    </button>
                    <button
                      type="button"
                      onClick={handleToggleQuoteMenu}
                      aria-label="Quote save options"
                      className="-ml-1 rounded-r-full rounded-l-none border border-transparent bg-transparent px-3 py-2 text-sm font-semibold text-black hover:bg-gray-100"
                    >
                      ⋮
                    </button>
                    {showQuoteSaveMenu && (
                      <div className="absolute right-0 top-full z-10 mt-2 w-36 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
                        <button
                          type="button"
                          onClick={handleSaveQuoteAndPrint}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Save as PDF
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <div className="space-y-4 rounded-3xl border border-blue-100 bg-white p-4 shadow-sm">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Select customer</label>
                    <select
                      value={quoteDraft.client}
                      onChange={(event) =>
                        setQuoteDraft((prev) => ({ ...prev, client: event.target.value }))
                      }
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    >
                      <option value="">Choose a CRM contact or enter a name</option>
                      {crmContacts.map((contact) => (
                        <option key={contact.id} value={contact.name}>
                          {contact.name}{contact.company ? ` — ${contact.company}` : ''}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={quoteDraft.client}
                      onChange={(event) =>
                        setQuoteDraft((prev) => ({ ...prev, client: event.target.value }))
                      }
                      placeholder="Customer name"
                      className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900">Quote Number</label>
                    <input
                      type="text"
                      value={quoteDraft.quoteNumber}
                      onChange={(event) =>
                        setQuoteDraft((prev) => ({ ...prev, quoteNumber: event.target.value }))
                      }
                      placeholder="Q-003"
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                </div>

                <div className="space-y-4 rounded-3xl border border-blue-100 bg-white p-4 shadow-sm">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Reference</label>
                    <input
                      type="text"
                      value={quoteDraft.reference}
                      onChange={(event) =>
                        setQuoteDraft((prev) => ({ ...prev, reference: event.target.value }))
                      }
                      placeholder="Quote reference"
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900">Status</label>
                    <select
                      value={quoteDraft.status}
                      onChange={(event) =>
                        setQuoteDraft((prev) => ({
                          ...prev,
                          status: event.target.value as Quote["status"],
                        }))
                      }
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Sent">Sent</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 rounded-3xl border border-blue-100 bg-white p-4 shadow-sm">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Issue date</label>
                    <input
                      type="date"
                      value={quoteDraft.createdAt}
                      onChange={(event) =>
                        setQuoteDraft((prev) => ({ ...prev, createdAt: event.target.value }))
                      }
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900">Expiration date</label>
                    <input
                      type="date"
                      value={quoteDraft.expiresAt}
                      onChange={(event) =>
                        setQuoteDraft((prev) => ({ ...prev, expiresAt: event.target.value }))
                      }
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-blue-100 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-base font-semibold text-gray-900">Line items</h4>
                    <p className="text-sm text-gray-500">Add quoted services or products in the table below.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setQuoteDraft((prev) => ({
                        ...prev,
                        items: [...prev.items, { description: "", quantity: 1, unitPrice: 0 }],
                      }))
                    }
                    className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                  >
                    + Add line
                  </button>
                </div>
                <div className="overflow-auto rounded-3xl border border-gray-200 bg-white">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-600">
                        <th className="px-3 py-2">Description</th>
                        <th className="px-3 py-2">Qty</th>
                        <th className="px-3 py-2">Unit Price</th>
                        <th className="px-3 py-2">Line Total</th>
                        <th className="px-3 py-2">&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quoteDraft.items.map((item, idx) => {
                        const lineTotal = item.quantity * item.unitPrice;
                        return (
                          <tr key={idx} className="border-t border-gray-100">
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) =>
                                  setQuoteDraft((prev) => ({
                                    ...prev,
                                    items: prev.items.map((it, i) =>
                                      i === idx ? { ...it, description: e.target.value } : it,
                                    ),
                                  }))
                                }
                                placeholder="Item description"
                                className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm"
                              />
                            </td>
                            <td className="px-3 py-2 w-24">
                              <input
                                type="number"
                                min={0}
                                value={item.quantity}
                                onChange={(e) =>
                                  setQuoteDraft((prev) => ({
                                    ...prev,
                                    items: prev.items.map((it, i) =>
                                      i === idx ? { ...it, quantity: Number(e.target.value) || 0 } : it,
                                    ),
                                  }))
                                }
                                className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm"
                              />
                            </td>
                            <td className="px-3 py-2 w-36">
                              <input
                                type="number"
                                min={0}
                                step="0.01"
                                value={item.unitPrice}
                                onChange={(e) =>
                                  setQuoteDraft((prev) => ({
                                    ...prev,
                                    items: prev.items.map((it, i) =>
                                      i === idx ? { ...it, unitPrice: Number(e.target.value) || 0 } : it,
                                    ),
                                  }))
                                }
                                className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm"
                              />
                            </td>
                            <td className="px-3 py-2 w-36">R{lineTotal.toLocaleString()}</td>
                            <td className="px-3 py-2 w-20 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  setQuoteDraft((prev) => ({
                                    ...prev,
                                    items: prev.items.filter((_, i) => i !== idx),
                                  }))
                                }
                                className="text-sm text-red-600 hover:underline"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    R{quoteDraft.items.reduce((s, it) => s + it.quantity * it.unitPrice, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </section>
          )}

          <div className="flex flex-wrap items-center gap-2 rounded-3xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            {quoteFilterOptions.map((filterOption) => (
              <button
                key={filterOption}
                type="button"
                onClick={() => setQuoteFilter(filterOption)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  quoteFilter === filterOption
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filterOption}
              </button>
            ))}
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="grid grid-cols-7 gap-4 items-center border-b border-gray-200 px-6 py-4 text-sm uppercase tracking-wide text-gray-500">
              <span>Number</span>
              <span>Reference</span>
              <span>Customer</span>
              <span>Issue date</span>
              <span>Expiration date</span>
              <span>Status</span>
              <span className="text-right">Amount</span>
            </div>
            <div className="space-y-2 px-6 py-4">
              {filteredQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className="grid grid-cols-7 gap-4 rounded-2xl bg-gray-50 px-4 py-3 items-center"
                >
                  <div>
                    <button
                      type="button"
                      onClick={() => handleOpenEditQuote(quote)}
                      className="text-sm font-semibold text-blue-600 hover:underline"
                    >
                      {quote.id}
                    </button>
                  </div>
                  <div className="text-sm text-gray-900">{quote.reference}</div>
                  <div>
                    <p className="font-semibold text-gray-900">{quote.client}</p>
                  </div>
                  <div className="text-sm text-gray-600">{quote.createdAt}</div>
                  <div className="text-sm text-gray-600">{quote.expiresAt}</div>
                  <div className="flex justify-center">
                    <select
                      value={quote.status}
                      onChange={(event) =>
                        handleUpdateQuoteStatus(
                          quote.id,
                          event.target.value as Quote["status"],
                        )
                      }
                      className="block w-32 max-w-full rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Sent">Sent</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="text-right font-semibold text-gray-900">R{quote.total.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


      {activeTab === "invoices" && (
        <section className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Invoices</h2>
              <p className="text-sm text-gray-500">
                Review invoice statuses and due dates in one place.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              onClick={handleOpenCreateInvoice}
            >
              <FilePlus className="h-4 w-4" />
              New Invoice
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-3xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            {invoiceFilterOptions.map((filterOption) => (
              <button
                key={filterOption}
                type="button"
                onClick={() => setInvoiceFilter(filterOption)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  invoiceFilter === filterOption
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filterOption}
              </button>
            ))}
          </div>

          {invoiceFormMode !== "list" && (
            <section className="space-y-4 rounded-3xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    {invoiceFormMode === "create" ? "New Invoice" : "Edit Invoice"}
                  </h3>
                  <p className="text-sm text-blue-700">
                    Use the invoice section to add customer details, dates, and line items.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setInvoiceFormMode("list");
                      setSelectedInvoiceId(null);
                    }}
                    className="rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
                  >
                    Cancel
                  </button>
                  {invoiceFormMode === "edit" && selectedInvoiceId && (
                    <button
                      type="button"
                      onClick={handleDeleteInvoice}
                      className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                    >
                      Delete Invoice
                    </button>
                  )}
                  <div className="relative inline-flex">
                    <button
                      type="button"
                      onClick={handleSaveInvoice}
                      className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Save Invoice
                    </button>
                    <button
                      type="button"
                      onClick={handleToggleInvoiceMenu}
                      aria-label="Invoice save options"
                      className="-ml-1 rounded-r-full rounded-l-none border border-transparent bg-transparent px-3 py-2 text-sm font-semibold text-black hover:bg-gray-100"
                    >
                      ⋮
                    </button>
                    {showInvoiceSaveMenu && (
                      <div className="absolute right-0 top-full z-10 mt-2 w-36 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
                        <button
                          type="button"
                          onClick={handleSaveInvoiceAndPrint}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Save as PDF
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <div className="space-y-4 rounded-3xl border border-blue-100 bg-white p-4 shadow-sm">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Choose from accepted quotes</label>
                    <select
                      onChange={(e) => {
                        const qid = e.target.value;
                        const selected = quotes.find((q) => q.id === qid);
                        if (selected) {
                          setInvoiceDraft((prev) => ({
                            ...prev,
                            customer: selected.client,
                            reference: selected.reference || prev.reference,
                            items: selected.items?.map((it) => ({ ...it })) ?? prev.items,
                          }));
                        }
                      }}
                      defaultValue=""
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    >
                      <option value="">— Select accepted quote —</option>
                      {quotes
                        .filter((q) => q.status === "Accepted")
                        .map((q) => (
                          <option key={q.id} value={q.id}>
                            {q.id} • {q.client}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900">Customer</label>
                    <input
                      type="text"
                      value={invoiceDraft.customer}
                      onChange={(event) =>
                        setInvoiceDraft((prev) => ({ ...prev, customer: event.target.value }))
                      }
                      placeholder="Customer name"
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900">Invoice number</label>
                    <input
                      type="text"
                      value={invoiceDraft.invoiceNumber}
                      onChange={(event) =>
                        setInvoiceDraft((prev) => ({ ...prev, invoiceNumber: event.target.value }))
                      }
                      placeholder="INV-0001"
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                </div>

                <div className="space-y-4 rounded-3xl border border-blue-100 bg-white p-4 shadow-sm">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Reference</label>
                    <input
                      type="text"
                      value={invoiceDraft.reference}
                      onChange={(event) =>
                        setInvoiceDraft((prev) => ({ ...prev, reference: event.target.value }))
                      }
                      placeholder="Invoice reference"
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900">Status</label>
                    <select
                      value={invoiceDraft.status}
                      onChange={(event) =>
                        setInvoiceDraft((prev) => ({
                          ...prev,
                          status: event.target.value as Invoice["status"],
                        }))
                      }
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Awaiting Payment">Awaiting Payment</option>
                      <option value="Overdue">Overdue</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 rounded-3xl border border-blue-100 bg-white p-4 shadow-sm">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Issue date</label>
                    <input
                      type="date"
                      value={invoiceDraft.issuedAt}
                      onChange={(event) =>
                        setInvoiceDraft((prev) => ({ ...prev, issuedAt: event.target.value }))
                      }
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900">Due date</label>
                    <input
                      type="date"
                      value={invoiceDraft.dueAt}
                      onChange={(event) =>
                        setInvoiceDraft((prev) => ({ ...prev, dueAt: event.target.value }))
                      }
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-blue-100 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-base font-semibold text-gray-900">Line items</h4>
                    <p className="text-sm text-gray-500">Add invoice products or services below.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setInvoiceDraft((prev) => ({
                        ...prev,
                        items: [...prev.items, { description: "", quantity: 1, unitPrice: 0 }],
                      }))
                    }
                    className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                  >
                    + Add line
                  </button>
                </div>
                <div className="overflow-auto rounded-3xl border border-gray-200 bg-white">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-600">
                        <th className="px-3 py-2">Description</th>
                        <th className="px-3 py-2">Qty</th>
                        <th className="px-3 py-2">Unit Price</th>
                        <th className="px-3 py-2">Line Total</th>
                        <th className="px-3 py-2">&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceDraft.items.map((item, idx) => {
                        const lineTotal = item.quantity * item.unitPrice;
                        return (
                          <tr key={idx} className="border-t border-gray-100">
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) =>
                                  setInvoiceDraft((prev) => ({
                                    ...prev,
                                    items: prev.items.map((it, i) =>
                                      i === idx ? { ...it, description: e.target.value } : it,
                                    ),
                                  }))
                                }
                                placeholder="Description"
                                className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm"
                              />
                            </td>
                            <td className="px-3 py-2 w-24">
                              <input
                                type="number"
                                min={0}
                                value={item.quantity}
                                onChange={(e) =>
                                  setInvoiceDraft((prev) => ({
                                    ...prev,
                                    items: prev.items.map((it, i) =>
                                      i === idx ? { ...it, quantity: Number(e.target.value) || 0 } : it,
                                    ),
                                  }))
                                }
                                className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm"
                              />
                            </td>
                            <td className="px-3 py-2 w-36">
                              <input
                                type="number"
                                min={0}
                                step="0.01"
                                value={item.unitPrice}
                                onChange={(e) =>
                                  setInvoiceDraft((prev) => ({
                                    ...prev,
                                    items: prev.items.map((it, i) =>
                                      i === idx ? { ...it, unitPrice: Number(e.target.value) || 0 } : it,
                                    ),
                                  }))
                                }
                                className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm"
                              />
                            </td>
                            <td className="px-3 py-2 w-36">R{lineTotal.toLocaleString()}</td>
                            <td className="px-3 py-2 w-20 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  setInvoiceDraft((prev) => ({
                                    ...prev,
                                    items: prev.items.filter((_, i) => i !== idx),
                                  }))
                                }
                                className="text-sm text-red-600 hover:underline"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="grid grid-cols-7 gap-4 items-center border-b border-gray-200 px-6 py-4 text-sm uppercase tracking-wide text-gray-500">
              <span>Number</span>
              <span>Ref</span>
              <span>To</span>
              <span>Date</span>
              <span>Due Date</span>
              <span>Amount</span>
              <span>Status</span>
            </div>
            <div className="space-y-2 px-6 py-4">
              {filteredInvoices.map((invoice) => {
                const paidAmount = invoice.status === "Paid" ? invoice.total : 0;
                return (
                  <div
                    key={invoice.id}
                    className="grid grid-cols-7 gap-4 rounded-2xl bg-gray-50 px-4 py-3 items-center"
                  >
                    <div>
                      <button
                        type="button"
                        onClick={() => handleOpenEditInvoice(invoice)}
                        className="text-sm font-semibold text-blue-600 hover:underline"
                      >
                        {invoice.invoiceNumber || invoice.id}
                      </button>
                    </div>
                    <div className="text-sm text-gray-900">{invoice.reference || "—"}</div>
                    <div>
                      <p className="font-semibold text-gray-900">{invoice.customer}</p>
                    </div>
                    <div className="text-sm text-gray-600">{invoice.issuedAt}</div>
                    <div className="text-sm text-gray-600">{invoice.dueAt}</div>
                    <div className="text-sm text-gray-900">R{paidAmount.toLocaleString()}</div>
                    <div className="flex justify-center">
                      <select
                        value={invoice.status}
                        onChange={(event) =>
                          handleUpdateInvoiceStatus(
                            invoice.id,
                            event.target.value as Invoice["status"],
                          )
                        }
                        className="block w-36 max-w-full rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Awaiting Payment">Awaiting Payment</option>
                        <option value="Paid">Paid</option>
                        <option value="Overdue">Overdue</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {activeTab === "expenses" && (
        <section className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Expenses</h2>
              <p className="text-sm text-gray-500">
                Track spending across categories and vendors.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              onClick={handleOpenCreateExpense}
            >
              <FilePlus className="h-4 w-4" />
              Add Expense
            </button>
          </div>

          {expenseFormMode !== "list" && (
            <section className="space-y-4 rounded-3xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    {expenseFormMode === "create" ? "New Expense" : "Edit Expense"}
                  </h3>
                  <p className="text-sm text-blue-700">
                    Record expense details and save them for your financial summary.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setExpenseFormMode("list");
                      setSelectedExpenseId(null);
                    }}
                    className="rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
                  >
                    Cancel
                  </button>
                  {expenseFormMode === "edit" && selectedExpenseId && (
                    <button
                      type="button"
                      onClick={handleDeleteExpense}
                      className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                    >
                      Delete Expense
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveExpense}
                    className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Save Expense
                  </button>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <div className="space-y-4 rounded-3xl border border-blue-100 bg-white p-4 shadow-sm">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Amount used</label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={expenseDraft.amount}
                      onChange={(event) =>
                        setExpenseDraft((prev) => ({
                          ...prev,
                          amount: Number(event.target.value) || 0,
                        }))
                      }
                      placeholder="0.00"
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900">Description</label>
                    <input
                      type="text"
                      value={expenseDraft.description}
                      onChange={(event) =>
                        setExpenseDraft((prev) => ({ ...prev, description: event.target.value }))
                      }
                      placeholder="What was it for?"
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                </div>

                <div className="space-y-4 rounded-3xl border border-blue-100 bg-white p-4 shadow-sm">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Spent at</label>
                    <input
                      type="text"
                      value={expenseDraft.spentAt}
                      onChange={(event) =>
                        setExpenseDraft((prev) => ({ ...prev, spentAt: event.target.value }))
                      }
                      placeholder="Where was the money spent?"
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900">Spent on</label>
                    <input
                      type="date"
                      value={expenseDraft.spentOn}
                      onChange={(event) =>
                        setExpenseDraft((prev) => ({ ...prev, spentOn: event.target.value }))
                      }
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                </div>

                <div className="space-y-4 rounded-3xl border border-blue-100 bg-white p-4 shadow-sm">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Attach proof</label>
                    <input
                      type="file"
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        setExpenseDraft((prev) => ({
                          ...prev,
                          proof: file ? file.name : "",
                        }));
                      }}
                      className="mt-2 w-full text-sm text-gray-700"
                    />
                    {expenseDraft.proof && (
                      <p className="mt-2 text-sm text-gray-500">Attached: {expenseDraft.proof}</p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="grid grid-cols-5 gap-4 border-b border-gray-200 px-6 py-4 text-sm uppercase tracking-wide text-gray-500">
              <span className="col-span-2">Description</span>
              <span>Spent at</span>
              <span>Spent on</span>
              <span className="text-right">Amount</span>
            </div>
            <div className="space-y-2 px-6 py-4">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="grid grid-cols-5 gap-4 rounded-2xl bg-gray-50 px-4 py-3 items-center"
                >
                  <div className="col-span-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditExpense(expense)}
                      className="text-left text-sm font-semibold text-blue-600 hover:underline"
                    >
                      {expense.description || "No description provided"}
                    </button>
                    <p className="text-xs text-gray-500">Proof: {expense.proof || "None"}</p>
                  </div>
                  <div className="text-sm text-gray-600">{expense.spentAt}</div>
                  <div className="text-sm text-gray-600">{expense.spentOn}</div>
                  <div className="text-right font-semibold text-gray-900">
                    R{expense.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeTab === "reports" && (
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Reports</h2>
            <p className="text-sm text-gray-500">
              What you earned • What you spent • What you are still owed
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {/* Profit & Loss Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Profit & Loss</h3>
                  <p className="text-sm text-gray-500">
                    Income vs expenses overview.
                  </p>
                </div>
                
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Total Revenue</p>
                  <p className="text-lg font-semibold text-gray-900">
                    R{invoices.reduce((sum, invoice) => sum + invoice.total, 0).toLocaleString()}
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Total Expenses</p>
                  <p className="text-lg font-semibold text-gray-900">
                    R{monthlyExpenses.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Net Profit</p>
                  <p className="text-lg font-semibold text-gray-900">
                    R{(invoices.reduce((sum, invoice) => sum + invoice.total, 0) - monthlyExpenses).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Cash Flow Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Cash Flow</h3>
                  <p className="text-sm text-gray-500">
                    Money in and out tracking.
                  </p>
                </div>
                
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Cash Received</p>
                  <p className="text-lg font-semibold text-gray-900">
                    R{invoices
                      .filter((invoice) => invoice.status === "Paid")
                      .reduce((sum, invoice) => sum + invoice.total, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Cash Spent</p>
                  <p className="text-lg font-semibold text-gray-900">
                    R{monthlyExpenses.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Net Cash Flow</p>
                  <p className="text-lg font-semibold text-gray-900">
                    R{cashBalance.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Invoices Summary Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Invoices Summary</h3>
                  <p className="text-sm text-gray-500">
                    Complete invoice breakdown.
                  </p>
                </div>
               
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">Total Invoices</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {invoices.length}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">Paid Invoices</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {invoices.filter((inv) => inv.status === "Paid").length}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">Unpaid Invoices</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {invoices.filter((inv) => inv.status !== "Paid").length}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">Overdue Invoices</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {invoices.filter((inv) => inv.status === "Overdue").length}
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Total Outstanding Amount</p>
                  <p className="text-lg font-semibold text-gray-900">
                    R{invoices
                      .filter((invoice) => invoice.status !== "Paid")
                      .reduce((sum, invoice) => sum + invoice.total, 0)
                      .toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Expense Summary Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Expense Summary</h3>
                  <p className="text-sm text-gray-500">
                    Spending overview and trends.
                  </p>
                </div>
                
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Total Expenses</p>
                  <p className="text-lg font-semibold text-gray-900">
                    R{monthlyExpenses.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Paid Expenses</p>
                  <p className="text-lg font-semibold text-gray-900">
                    R{monthlyExpenses.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Unpaid Expenses</p>
                  <p className="text-lg font-semibold text-gray-900">
                    R0
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default FinanceManager;
