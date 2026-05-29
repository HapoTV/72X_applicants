import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  Bookmark,
  Calendar,
  Filter,
  MapPin,
  Moon,
  Search,
  TrendingUp,
} from 'lucide-react';

import type { TenderItem } from '../../interfaces/TenderlyAIData';

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

const MOCK_TENDERS: TenderItem[] = [
  {
    id: 'tnd-001',
    title: 'Agricultural Equipment Supply',
    buyer: 'Free State Agriculture Department',
    province: 'Free State',
    industry: 'Agriculture',
    publishedAt: 'Dec 18, 2024',
    closingAt: 'Feb 05, 2026',
    source: 'fs.gov.za',
    documentsCount: 2,
    status: 'EXPIRED',
  },
  {
    id: 'tnd-002',
    title: 'Software Licensing & Support',
    buyer: 'City of Johannesburg',
    province: 'Gauteng',
    industry: 'ICT & Software',
    publishedAt: 'Jan 09, 2026',
    closingAt: 'May 10, 2026',
    source: 'joburg.org.za',
    documentsCount: 4,
    status: 'OPEN',
  },
  {
    id: 'tnd-003',
    title: 'Cleaning Services for Public Facilities',
    buyer: 'Department of Public Works',
    province: 'Western Cape',
    industry: 'Cleaning & Hygiene',
    publishedAt: 'Jan 22, 2026',
    closingAt: 'May 02, 2026',
    source: 'gov.za',
    documentsCount: 3,
    status: 'OPEN',
  },
  {
    id: 'tnd-004',
    title: 'Security Services (24/7 Guarding)',
    buyer: 'Provincial Treasury',
    province: 'KwaZulu-Natal',
    industry: 'Security Services',
    publishedAt: 'Feb 14, 2026',
    closingAt: 'Apr 29, 2026',
    source: 'kzn.gov.za',
    documentsCount: 1,
    status: 'OPEN',
  },
  {
    id: 'tnd-005',
    title: 'Road Maintenance & Rehabilitation',
    buyer: 'SANRAL',
    province: 'North West',
    industry: 'Construction',
    publishedAt: 'Feb 01, 2026',
    closingAt: 'Jun 18, 2026',
    source: 'sanral.co.za',
    documentsCount: 6,
    status: 'OPEN',
  },
];

const isClosingWithinDays = (closingAt: string, days: number) => {
  const dt = new Date(closingAt);
  if (Number.isNaN(dt.getTime())) return false;
  const diffDays = (dt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= days;
};

export default function TenderlyAI() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
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
  const [savedTenderIds, setSavedTenderIds] = useState<Set<string>>(() => new Set());
  const [filtersOpen, setFiltersOpen] = useState(true);

  const industries = useMemo(() => {
    const fromTenders = Array.from(new Set(MOCK_TENDERS.map((t) => t.industry))).filter(Boolean);
    const combined = [...SIGNUP_INDUSTRIES, ...fromTenders];
    const unique = Array.from(new Set(combined.map((s) => s.trim()).filter(Boolean)));
    const withoutOther = unique.filter((s) => s.toLowerCase() !== 'other');
    return [...withoutOther, 'Other'];
  }, []);

  const filteredTenders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MOCK_TENDERS.filter((t) => {
      if (province !== 'All Provinces' && t.province !== province) return false;
      if (selectedIndustries.length && !selectedIndustries.includes(t.industry)) return false;

      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.buyer.toLowerCase().includes(q) ||
        t.province.toLowerCase().includes(q) ||
        t.industry.toLowerCase().includes(q)
      );
    });
  }, [province, search, selectedIndustries]);

  const urgentCount = useMemo(() => filteredTenders.filter((t) => isClosingWithinDays(t.closingAt, 7)).length, [filteredTenders]);
  const categoriesCount = useMemo(() => new Set(MOCK_TENDERS.map((t) => t.industry)).size, []);

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry]
    );
  };

  const toggleSaved = (tenderId: string) => {
    setSavedTenderIds((prev) => {
      const next = new Set(prev);
      if (next.has(tenderId)) next.delete(tenderId);
      else next.add(tenderId);
      return next;
    });
  };

  const savedCount = savedTenderIds.size;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="flex">
        <aside
          className={`${filtersOpen ? 'w-72' : 'w-0'} transition-all duration-200 overflow-hidden border-r border-gray-200 bg-white`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close filters"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-xs font-semibold text-gray-700 mb-2">Search</div>
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search tenders..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-700 mb-2">Industries</div>
                <div className="max-h-56 overflow-auto pr-1 space-y-2">
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
                <div className="text-xs font-semibold text-gray-700 mb-2">Province</div>
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
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="px-6 py-5 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {!filtersOpen && (
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(true)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/overview')}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Main Dashboard
                </button>
                <h1 className="text-xl font-bold text-gray-900">TenderlyAI</h1>
              </div>

              <div className="flex-1 max-w-xl">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search tenders..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button type="button" className="p-2 rounded-lg hover:bg-gray-100" aria-label="Theme">
                  <Moon className="w-5 h-5 text-gray-600" />
                </button>
                <button type="button" className="p-2 rounded-lg hover:bg-gray-100" aria-label="Notifications">
                  <Bell className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Welcome to TenderlyAI!</h2>
              <p className="text-gray-600 mt-1">Here’s what’s happening in the tender marketplace today</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Total Tenders</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{filteredTenders.length}</div>
                    <div className="text-xs text-gray-500 mt-1">Showing matching results</div>
                  </div>
                  <div className="p-2 rounded-lg bg-primary-50">
                    <TrendingUp className="w-4 h-4 text-primary-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Saved Tenders</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{savedCount}</div>
                    <div className="text-xs text-gray-500 mt-1">Click Save to bookmark</div>
                  </div>
                  <div className="p-2 rounded-lg bg-primary-50">
                    <Bookmark className="w-4 h-4 text-primary-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Urgent</div>
                    <div className="text-2xl font-bold text-primary-600 mt-1">{urgentCount}</div>
                    <div className="text-xs text-gray-500 mt-1">Closing within 7 days</div>
                  </div>
                  <div className="p-2 rounded-lg bg-primary-50">
                    <Calendar className="w-4 h-4 text-primary-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Categories</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{categoriesCount}</div>
                    <div className="text-xs text-gray-500 mt-1">Industry categories</div>
                  </div>
                  <div className="p-2 rounded-lg bg-primary-50">
                    <MapPin className="w-4 h-4 text-primary-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Tender Feed</h3>
                  <p className="text-sm text-gray-600">Latest opportunities matching your criteria</p>
                </div>
                <div className="text-xs text-gray-500">{filteredTenders.length} total tenders</div>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredTenders.map((t) => {
                  const isSaved = savedTenderIds.has(t.id);
                  return (
                    <div key={t.id} className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-semibold text-gray-900 truncate">{t.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{t.industry}</p>

                          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-700">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">Buyer:</span>
                              <span className="font-medium">{t.buyer}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">Province:</span>
                              <span className="font-medium">{t.province}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">Closing:</span>
                              <span className="font-medium">{t.closingAt}</span>
                            </div>
                          </div>

                          <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
                            <span>Source: {t.source}</span>
                            <span className="text-gray-300">•</span>
                            <span>{t.documentsCount} documents</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span
                            className={`px-2 py-1 text-xs rounded-full border ${
                              t.status === 'EXPIRED'
                                ? 'bg-gray-50 text-gray-600 border-gray-200'
                                : 'bg-primary-50 text-primary-700 border-primary-200'
                            }`}
                          >
                            {t.status === 'EXPIRED' ? 'Expired' : 'Open'}
                          </span>

                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                            {t.industry}
                          </span>

                          <div className="flex items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => toggleSaved(t.id)}
                              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                                isSaved
                                  ? 'bg-primary-50 text-primary-700 border-primary-200'
                                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="px-3 py-1.5 rounded-lg text-sm bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {!filteredTenders.length && (
                  <div className="p-10 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                      <Search className="w-5 h-5 text-gray-500" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900">No tenders found</h4>
                    <p className="text-sm text-gray-600 mt-1">Try adjusting your filters or search.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
