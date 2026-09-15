import React from 'react';

interface AppsSectionProps {
  showAllApps: boolean;
  setShowAllApps: (show: boolean) => void;
}

const AppsSection: React.FC<AppsSectionProps> = ({ showAllApps, setShowAllApps }) => {
  const allApps = [
    {
      icon: <i className="bx bxs-package" style={{ color: 'white' }} />,
      title: 'Inventory Management',
      desc: 'Track stock levels, manage suppliers, and automate reordering',
    },
    {
      icon: <i className="bx bx-credit-card" style={{ color: 'white' }} />,
      title: 'POS System',
      desc: 'Modern point-of-sale with multiple payment options',
    },
    {
      icon: <i className="bx bx-target-lock" style={{ color: 'white' }} />,
      title: 'AI Business Advisor',
      desc: 'Get personalized growth recommendations and insights',
    },
    {
      icon: <i className="bx bxs-bar-chart-square" style={{ color: 'white' }} />,
      title: 'Analytics Dashboard',
      desc: 'Real-time business performance tracking and reporting',
    },
    {
      icon: <i className="bx bxs-bell" style={{ color: 'white' }} />,
      title: 'Service Desk',
      desc: 'Manage customer service and support tickets efficiently',
    },
    {
      icon: <i className="bx bxs-user" style={{ color: 'white' }} />,
      title: 'CRM',
      desc: 'Build better customer relationships and increase sales',
    },
    // Additional apps revealed on "Show more apps"
    {
      icon: <i className="bx bxs-receipt" style={{ color: 'white' }} />,
      title: 'Invoicing & Billing',
      desc: 'Create professional invoices and track payments with ease',
    },
    {
      icon: <i className="bx bxs-calendar" style={{ color: 'white' }} />,
      title: 'Scheduling',
      desc: 'Manage appointments, staff rosters, and business calendars',
    },
    {
      icon: <i className="bx bxs-store" style={{ color: 'white' }} />,
      title: 'E-commerce Store',
      desc: 'Sell online with a fully integrated storefront and checkout',
    },
    {
      icon: <i className="bx bxs-briefcase" style={{ color: 'white' }} />,
      title: 'Project Management',
      desc: 'Plan, track, and collaborate on business projects seamlessly',
    },
    {
      icon: <i className="bx bxs-wallet" style={{ color: 'white' }} />,
      title: 'Payroll & HR',
      desc: 'Automate payroll, manage leave, and keep employee records',
    },
    {
      icon: <i className="bx bxs-pie-chart-alt-2" style={{ color: 'white' }} />,
      title: 'Financial Reports',
      desc: 'Generate profit/loss, cash flow, and tax-ready reports instantly',
    },
  ];

  const visibleApps = showAllApps ? allApps : allApps.slice(0, 6);

  return (
    <section id="apps" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Powerful Business Apps</h2>
          <p className="text-xl text-gray-500">All the tools you need in one integrated platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleApps.map((app, idx) => (
            <div
              key={app.title}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all"
              style={{
                animation: idx >= 6 ? 'fadeInUp 0.4s ease forwards' : undefined,
                animationDelay: idx >= 6 ? `${(idx - 6) * 80}ms` : undefined,
              }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ background: '#60A5FA' }}
              >
                <span className="text-xl text-white">{app.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-blue-500 mb-3">{app.title}</h3>
              <p className="text-gray-700">{app.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setShowAllApps(!showAllApps)}
            className="px-8 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-semibold shadow-sm transition-all"
          >
            {showAllApps ? 'Show fewer apps' : `Show more apps (${allApps.length - 6} more)`}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default AppsSection;
