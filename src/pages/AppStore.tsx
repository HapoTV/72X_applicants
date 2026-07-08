import React from 'react';
import { AppWindow, Briefcase, Sparkles, Shield, ShieldCheck, ShoppingBag, TrendingUp } from 'lucide-react';

const AppStore: React.FC = () => {
  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <AppWindow className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">App Store</h1>
        </div>
        
        <p className="text-gray-700 mb-8">
          Welcome to the App Store! Here you can access powerful business applications designed to help you manage and grow your business.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'CRM', description: 'Manage customer relationships, track leads, and streamline your sales process with our comprehensive CRM system.', icon: Briefcase, color: 'from-sky-500 to-blue-600', href: '/applications/crm' },
            { title: 'Finance Manager', description: 'Track expenses, manage budgets, and monitor your financial performance with advanced reporting tools.', icon: Shield, color: 'from-emerald-400 to-emerald-600', href: '/applications/finance-manager' },
            { title: 'TenderlyAI', description: 'AI-powered tender management system that helps you create, manage, and track tender applications efficiently.', icon: Sparkles, color: 'from-violet-500 to-fuchsia-600', href: '/applications/tenderlyai' },
            { title: 'Marketplace', description: 'List products and get discovered by customers on the Marketplace.', icon: ShoppingBag, color: 'from-amber-400 to-orange-500', href: '/marketplace' },
            { title: 'Funding Finder', description: 'Search and shortlist grants, loans and investor opportunities.', icon: ShieldCheck, color: 'from-emerald-500 to-teal-600', href: '/funding' },
          ].map((app) => {
            const Icon = app.icon as any;
            return (
              <div key={app.title} className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${app.color} text-white shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-800">{app.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{app.description}</p>
                  <a href={app.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center mt-3 text-blue-600 hover:text-blue-700 text-sm">
                    Open {app.title} <TrendingUp className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
          <p className="text-blue-700 mb-1">
            If you need support, please contact our team at:
          </p>
          <a href="mailto:support@seventytwox.co.za" className="text-blue-600 hover:text-blue-700 font-medium">
            support@seventytwox.co.za
          </a>
        </div>
      </div>
    </div>
  );
};

export default AppStore;
