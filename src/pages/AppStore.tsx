import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Sparkles,
  Shield,
  ShoppingBag,
  ShieldCheck,
  Clock,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import axiosClient from '../api/axiosClient';

// Sub-app URLs — port-based for local dev, subdomain-based in production
const SUB_APP_URLS: Record<string, string> = {
  'CRM': import.meta.env.VITE_CRM_URL || 'http://localhost:5174',
  'Finance Manager': import.meta.env.VITE_FINANCE_URL || 'http://localhost:5175',
  'TenderlyAI': import.meta.env.VITE_TENDERLYAI_URL || 'http://localhost:5176',
};

type AppStatus = 'active' | 'coming-soon';

interface AppDef {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  href: string;
  status: AppStatus;
}

const APPS: AppDef[] = [
  {
    title: 'CRM',
    description: 'Manage customer relationships, track leads, and streamline your sales process.',
    icon: Briefcase,
    color: 'from-sky-500 to-blue-600',
    href: '/applications/crm',
    status: 'active',
  },
  {
    title: 'Finance Manager',
    description: 'Track expenses, manage budgets, and monitor financial performance.',
    icon: Shield,
    color: 'from-emerald-400 to-emerald-600',
    href: '/applications/finance-manager',
    status: 'active',
  },
  {
    title: 'TenderlyAI',
    description: 'AI-powered tender management — create, manage, and track applications.',
    icon: Sparkles,
    color: 'from-violet-500 to-fuchsia-600',
    href: '/applications/tenderlyai',
    status: 'active',
  },
  {
    title: 'Marketplace',
    description: 'List products and get discovered by customers in your community.',
    icon: ShoppingBag,
    color: 'from-amber-400 to-orange-500',
    href: '/marketplace',
    status: 'active',
  },
  {
    title: 'Funding Finder',
    description: 'Search and shortlist grants, loans, and investor opportunities.',
    icon: ShieldCheck,
    color: 'from-emerald-500 to-teal-600',
    href: '/funding',
    status: 'active',
  },
  {
    title: 'Helpdesk',
    description: 'Manage support tickets, track issues, and provide great customer service.',
    icon: Shield,
    color: 'from-blue-400 to-blue-600',
    href: '#',
    status: 'coming-soon',
  },
  {
    title: 'Point of Sale',
    description: 'Process sales, manage inventory, and accept payments at your counter.',
    icon: ShoppingBag,
    color: 'from-rose-400 to-red-600',
    href: '#',
    status: 'coming-soon',
  },
  {
    title: 'Inventory',
    description: 'Track stock levels, manage suppliers, and automate reorder alerts.',
    icon: Briefcase,
    color: 'from-cyan-400 to-cyan-600',
    href: '#',
    status: 'coming-soon',
  },
];

const AppStore: React.FC = () => {
  const navigate = useNavigate();

  const active = APPS.filter((a) => a.status === 'active');
  const comingSoon = APPS.filter((a) => a.status === 'coming-soon');

  const handleOpen = async (app: AppDef) => {
    if (app.status === 'coming-soon') return;

    const subAppUrl = SUB_APP_URLS[app.title];
    if (subAppUrl) {
      // Try to generate an SSO token for seamless sign-in
      try {
        const res = await axiosClient.post('/auth/sso/generate');
        const { ssoToken } = res.data;
        window.open(`${subAppUrl}?sso=${ssoToken}`, '_blank', 'noopener');
      } catch {
        // SSO not yet available — open sub-app directly (user will sign in manually)
        window.open(subAppUrl, '_blank', 'noopener');
      }
    } else {
      navigate(app.href);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in px-2 sm:px-0">
      {/* Header */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Apps</h1>
        <p className="text-gray-600 mt-1 text-sm">Access your business tools in one place.</p>
      </div>

      {/* Active apps */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {active.map((app) => {
            const Icon = app.icon;
            return (
              <button
                key={app.title}
                onClick={() => handleOpen(app)}
                className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-5 hover:shadow-md hover:border-primary-200 transition-all text-center group"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${app.color} text-white shadow-sm group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{app.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{app.description}</p>
                </div>
                <span className="flex items-center gap-1 text-xs text-primary-600 font-medium">
                  Open <ExternalLink className="w-3 h-3" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Coming soon apps */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Coming Soon</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {comingSoon.map((app) => {
            const Icon = app.icon;
            return (
              <div
                key={app.title}
                className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5 text-center opacity-70"
              >
                <div className="relative">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${app.color} text-white shadow-sm opacity-60`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    Soon
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">{app.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{app.description}</p>
                </div>
                <span className="text-xs text-amber-600 font-medium">In development</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Support */}
      <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
        <h3 className="text-sm font-semibold text-blue-900 mb-1">Need help with an app?</h3>
        <p className="text-blue-700 text-sm">
          Contact us at{' '}
          <a href="mailto:support@seventytwox.co.za" className="font-medium hover:underline">
            support@seventytwox.co.za
          </a>
        </p>
      </div>
    </div>
  );
};

export default AppStore;
