import React from 'react';

interface AppsSectionProps {
  showAllApps: boolean;
  setShowAllApps: (show: boolean) => void;
}

const AppsSection: React.FC<AppsSectionProps> = ({ showAllApps, setShowAllApps }) => {
  const apps = [
    {
      icon: <i className="bx bxs-package" style={{ color: 'white' }}></i>,
      title: 'Inventory Management',
      desc: 'Track stock levels, manage suppliers, and automate reordering',
    },
    {
      icon: <i className="bx bx-credit-card" style={{ color: 'white' }}></i>,
      title: 'POS System',
      desc: 'Modern point-of-sale with multiple payment options',
    },
    {
      icon: <i className="bx bx-target-lock" style={{ color: 'white' }}></i>,
      title: 'AI Business Advisor',
      desc: 'Get personalized growth recommendations and insights',
    },
    {
      icon: <i className="bx bxs-bar-chart-square" style={{ color: 'white' }}></i>,
      title: 'Analytics Dashboard',
      desc: 'Real-time business performance tracking and reporting',
    },
    {
      icon: <i className="bx bxs-bell" style={{ color: 'white' }}></i>,
      title: 'Service Desk',
      desc: 'Manage customer service and support tickets efficiently',
    },
    {
      icon: <i className="bx bxs-user" style={{ color: 'white' }}></i>,
      title: 'CRM',
      desc: 'Build better customer relationships and increase sales',
    },
  ];

  return (
    <section id="apps" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Powerful Business Apps</h2>
          <p className="text-xl text-gray-050">All the tools you need in one integrated platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {apps.map((app, idx) => (
            <div
              key={app.title}
              className={`bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all reveal-up ${
                !showAllApps && idx >= 3 ? 'opacity-20 pointer-events-none' : ''
              }`}
              style={{ transitionDelay: `${idx * 120}ms` }}
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: '#60A5FA' }}>
                <span className="text-xl text-white">{app.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-blue-500 mb-3">{app.title}</h3>
              <p className="text-gray-900">{app.desc}</p>
            </div>
          ))}
          {!showAllApps && (
            <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-white to-transparent pointer-events-none hidden md:block" />
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setShowAllApps(!showAllApps)}
            className="px-6 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 font-semibold shadow-sm"
          >
            {showAllApps ? 'Show fewer apps' : 'Show more apps'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AppsSection;
