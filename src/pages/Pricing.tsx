import React from "react";
import { useNavigate, Link } from "react-router-dom";
import logoSvg from "../assets/Logo.svg";

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const gradientBlue =
    "linear-gradient(135deg, #0D0F3B 0%, #1A1C52 25%, #2258A6 50%, #1C90E6 75%, #33B0FF 100%)";

  const plans = [
    {
      name: "Start-up",
      price: "R99",
      period: "/month",
      features: [
        "Basic business tools",
        "Email support",
        "Community access",
      ],
      highlight: false,
      ctaType: "get-started" as const,
    },
    {
      name: "Essential",
      price: "R299",
      period: "/month",
      features: [
        "All Start-up features",
        "Advanced analytics",
        "Priority support",
        "AI business advisor",
      ],
      highlight: true,
      ctaType: "trial" as const,
    },
    {
      name: "Premium",
      price: "R999",
      period: "/month",
      features: [
        "All Essential features",
        "Dedicated support",
        "Custom integrations",
        "Advanced AI tools",
      ],
      highlight: false,
      ctaType: "contact" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      {/* Header */}
      <header className="bg-[#F5F7FA] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-12">
              <img
                src={logoSvg}
                alt="72X Logo"
                className="h-14 md:h-16 w-auto"
              />
              
              {/* Navigation */}
              <nav className="hidden md:flex space-x-8">
                <button onClick={() => { navigate('/'); setTimeout(() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-gray-700 hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors">
                  Features
                </button>
                <button onClick={() => { navigate('/'); setTimeout(() => document.getElementById('industries')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-gray-700 hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors">
                  Industries
                </button>
                <button onClick={() => { navigate('/'); setTimeout(() => document.getElementById('apps')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-gray-700 hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors">
                  Apps
                </button>
                <button onClick={() => navigate('/pricing')} className="text-gray-700 hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors">
                  Pricing
                </button>
              </nav>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/request-demo')}
                className="text-gray-700 hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors"
              >
                Request demo
              </button>
              <button
                onClick={() => navigate('/login')}
                className="text-black bg-[#60A5FA] hover:bg-[#3B82F6] px-6 py-2.5 rounded-lg font-semibold text-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </header>

    <main className="min-h-screen bg-white py-16 flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600">Start free and upgrade as you grow</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-xl p-8 relative ${
                plan.highlight ? "shadow-lg border-2" : "border border-gray-200 hover:border-blue-300 transition-colors"
              }`}
              style={plan.highlight ? { borderColor: "#2258A6" } : {}}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="text-white px-4 py-1 rounded-full text-sm font-semibold" style={{ background: gradientBlue }}>
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-6">{plan.highlight ? "For growing businesses" : plan.name === "Start-up" ? "Perfect for new businesses" : "For established businesses"}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-600">{f}</span>
                  </li>
                ))}
              </ul>
              {plan.ctaType === "get-started" && (
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold transition-colors">
                  Get Started
                </button>
              )}
              {plan.ctaType === "trial" && (
                <button className="w-full text-white py-3 rounded-lg font-semibold transition-colors hover:opacity-90" style={{ background: gradientBlue }}>
                  Start Free Trial
                </button>
              )}
              {plan.ctaType === "contact" && (
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold transition-colors">
                  Contact Sales
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Feature highlights */}
      <section className="mt-20 bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">Everything you need to scale</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
              title: 'AI Business Advisor',
              desc: 'Personalized insights and next-best actions to accelerate growth.'
            }, {
              title: 'Analytics Dashboard',
              desc: 'Understand performance in real time with clear, actionable metrics.'
            }, {
              title: 'Service Desk',
              desc: 'Manage customer support and ticketing without leaving the platform.'
            }].map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plan comparison */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10">Compare plans and features</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Grow your audience</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Start-up</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Essential</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { feature: 'Dashboard & Metrics', a: 'Included', b: 'Included', c: 'Included' },
                  { feature: 'Learning Modules', a: 'Included', b: 'Included', c: 'Included' },
                  { feature: 'Community Access', a: 'Included', b: 'Included', c: 'Included' },
                  { feature: 'Schedule & Calendar', a: 'Included', b: 'Included', c: 'Included' },
                  { feature: 'Marketplace', a: '—', b: 'Included', c: 'Included' },
                  { feature: 'Mentorship Hub', a: '—', b: 'Included', c: 'Included' },
                  { feature: 'Funding Finder', a: '—', b: 'Included', c: 'Included' },
                  { feature: 'Data Input Tools', a: '—', b: 'Included', c: 'Included' },
                  { feature: 'Roadmap Generator', a: '—', b: '—', c: 'Included' },
                  { feature: 'Advanced Analytics', a: '—', b: '—', c: 'Included' },
                  { feature: 'Resource Library', a: '—', b: '—', c: 'Included' },
                  { feature: 'Expert Sessions', a: '—', b: '—', c: 'Included' },
                  { feature: 'AI Business Analyst', a: '—', b: '—', c: 'Included' },
                ].map((row) => (
                  <tr key={row.feature} className="bg-white hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 px-4 text-sm text-gray-700">{row.feature}</td>
                    <td className="py-2.5 px-4 text-center text-sm text-gray-700">{row.a}</td>
                    <td className="py-2.5 px-4 text-center text-sm text-gray-700">{row.b}</td>
                    <td className="py-2.5 px-4 text-center text-sm text-gray-700">{row.c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img 
                  src="/Logo3.png" 
                  alt="72X Logo" 
                  className="h-8"
                  onError={(e) => {
                    // Fallback in case the image fails to load
                    (e.target as HTMLImageElement).onerror = null;
                    (e.target as HTMLImageElement).src = '/Logo2.png';
                  }}
                />
              </div>
              <p className="text-white/90 text-sm mb-4">
                Empowering businesses with AI-driven insights and growth tools.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white/90 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="text-white/90 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="text-white/90 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.56v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-white/90">
                <li>
                  <button 
                    onClick={() => { 
                      navigate('/'); 
                      setTimeout(() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }), 100); 
                    }} 
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { 
                      navigate('/'); 
                      setTimeout(() => document.getElementById('apps')?.scrollIntoView({ behavior: 'smooth' }), 100); 
                    }} 
                    className="hover:text-white transition-colors"
                  >
                    Apps
                  </button>
                </li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/request-demo" className="hover:text-white transition-colors">Demo</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-white/90">
                <li>
                  <button
                    onClick={() => {
                      navigate('/');
                      setTimeout(() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }), 100);
                    }}
                    className="hover:text-white transition-colors"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate('/');
                      setTimeout(() => document.getElementById('industries')?.scrollIntoView({ behavior: 'smooth' }), 100);
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Industries
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate('/');
                      setTimeout(() => document.getElementById('community')?.scrollIntoView({ behavior: 'smooth' }), 100);
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Community
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-white/90">
                <li>
                  <button
                    onClick={() => {
                      navigate('/');
                      setTimeout(() => document.getElementById('help')?.scrollIntoView({ behavior: 'smooth' }), 100);
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </button>
                </li>
                <li><a href="mailto:admin@hapogroup.co.za" className="hover:text-white transition-colors">Contact Support</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-white/90 text-sm">© {new Date().getFullYear()} 72X. All rights reserved.</div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="/legal/terms-and-privacy.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white transition-colors text-sm"
              >
                Terms of service
              </a>
              <a
                href="/legal/terms-and-privacy.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white transition-colors text-sm"
                title="Learn about our cookie policy and how we use cookies"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;


