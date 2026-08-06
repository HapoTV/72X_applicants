import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  Filter,
  Home,
  Moon,
  Search,
  Bookmark,
  TrendingUp,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Hooks
import { useTenders } from '../../hooks/tenderlyai';

// Components
import {
  OverviewTab,
  TenderListTab,
  SavedTendersTab,
} from '../../components/tenderlyai';

// Types
import type { TenderSearchFilters } from '../../interfaces/TenderlyAIData';

const SIGNUP_INDUSTRIES = [
  'Technology',
  'Finance & Banking',
  'Healthcare',
  'Retail & E-commerce',
  'Manufacturing',
  'Construction',
  'Education',
  'Hospitality & Tourism',
  'Transportation & Logistics',
  'Media & Entertainment',
  'Agriculture',
  'Real Estate',
  'Energy & Utilities',
  'Professional Services',
  'Non-profit',
  'Other',
];

const PROVINCES = [
  'All Provinces',
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape',
];

type TenderlyAITab = 'overview' | 'tenders' | 'saved';

const navItems: Array<{ id: TenderlyAITab; label: string; icon: React.ElementType }> = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'tenders', label: 'Browse Tenders', icon: TrendingUp },
  { id: 'saved', label: 'Saved', icon: Bookmark },
];

export const TenderlyAI: React.FC = () => {
  const navigate = useNavigate();

  // Hooks
  const {
    tenders,
    savedTenderIds,
    toggleSavedTender,
    getSavedTenders,
    getAllIndustries,
    loading,
  } = useTenders();

  // State
  const [activeTab, setActiveTab] = useState<TenderlyAITab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('user');
      const parsed = raw ? (JSON.parse(raw) as { industry?: string }) : null;
      const industry = (parsed?.industry || '').trim();
      return industry ? [industry] : [];
    } catch {
      return [];
    }
  });
  const [province, setProvince] = useState('All Provinces');
  const [filtersOpen, setFiltersOpen] = useState(true);

  // Get industries
  const industries = useMemo(() => {
    const fromTenders = getAllIndustries();
    const combined = [...SIGNUP_INDUSTRIES, ...fromTenders];
    const unique = Array.from(new Set(combined.map((s) => s.trim()).filter(Boolean)));
    const withoutOther = unique.filter((s) => s.toLowerCase() !== 'other');
    return [...withoutOther, 'Other'];
  }, [getAllIndustries]);

  // Create filters object
  const filters: TenderSearchFilters = useMemo(
    () => ({
      searchTerm,
      province: province !== 'All Provinces' ? province : undefined,
      industry: selectedIndustries.length === 1 ? selectedIndustries[0] : undefined,
    }),
    [searchTerm, province, selectedIndustries]
  );

  // Handlers
  const handleFilterChange = (newFilters: Partial<TenderSearchFilters>) => {
    if ('searchTerm' in newFilters) {
      setSearchTerm(newFilters.searchTerm || '');
    }
  };

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry]
    );
  };

  const handleSaveTender = (tenderId: string) => {
    toggleSavedTender(tenderId);
  };

  const handleRemoveSavedTender = (tenderId: string) => {
    toggleSavedTender(tenderId);
  };

  // Render active tab
  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            tenders={tenders}
            savedTenderIds={savedTenderIds}
          />
        );
      case 'tenders':
        return (
          <TenderListTab
            tenders={tenders}
            filters={filters}
            onFilterChange={handleFilterChange}
            onSave={handleSaveTender}
            savedIds={savedTenderIds}
            loading={loading}
          />
        );
      case 'saved':
        return (
          <SavedTendersTab
            tenders={getSavedTenders()}
            onRemove={handleRemoveSavedTender}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

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
              <h1 className="text-2xl font-bold text-gray-900">TenderlyAI</h1>
            </div>
          </div>
          <p className="text-gray-600 mt-2">Discover and manage government tenders and business opportunities.</p>
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tenders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" className="p-2 rounded-lg hover:bg-gray-100" aria-label="Theme">
            <Moon className="w-5 h-5 text-gray-600" />
          </button>
          <button type="button" className="p-2 rounded-lg hover:bg-gray-100" aria-label="Notifications">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {filtersOpen && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Industries
              </label>
              <div className="max-h-48 overflow-auto space-y-2 pr-1">
                {industries.map((industry) => (
                  <label key={industry} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={selectedIndustries.includes(industry)}
                      onChange={() => toggleIndustry(industry)}
                      className="rounded border-gray-300"
                    />
                    <span>{industry}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Province
              </label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedIndustries([]);
                  setProvince('All Provinces');
                }}
                className="px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg border border-primary-200"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
        <nav className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.id)}
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
    </div>
  );
};

export default TenderlyAI;
 