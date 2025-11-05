import React from "react";
import { useNavigate } from "react-router-dom";
import logoSvg from "../assets/Logo.svg";

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const gradientBlue =
    "linear-gradient(135deg, #0D0F3B 0%, #1A1C52 25%, #2258A6 50%, #1C90E6 75%, #33B0FF 100%)";

  const plans = [
    {
      name: "Start-up",
      price: "R0",
      period: "/month",
      features: [
        "Basic business tools",
        "Email support",
        "Community access",
        "1 user included",
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
        "5 users included",
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
        "Unlimited users",
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
                Request a demo
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
                  <th className="text-left p-4 text-gray-700 font-semibold">Grow your audience</th>
                  <th className="p-4 text-gray-700 font-semibold">Start-up</th>
                  <th className="p-4 text-gray-700 font-semibold">Essential</th>
                  <th className="p-4 text-gray-700 font-semibold">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { feature: 'Subscribers', a: 'Up to 10,000', b: '1,000', c: '1,000+' },
                  { feature: 'Create landing pages', a: 'Unlimited', b: 'Unlimited', c: 'Unlimited' },
                  { feature: 'Email sequences', a: 'Basic', b: 'Unlimited', c: 'Unlimited' },
                  { feature: 'AI Business Advisor', a: '—', b: 'Included', c: 'Included' },
                  { feature: 'Users', a: '1', b: '5', c: 'Unlimited' },
                ].map((row) => (
                  <tr key={row.feature} className="bg-white">
                    <td className="p-4 text-gray-700 font-medium">{row.feature}</td>
                    <td className="p-4 text-center text-gray-700">{row.a}</td>
                    <td className="p-4 text-center text-gray-700">{row.b}</td>
                    <td className="p-4 text-center text-gray-700">{row.c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: gradientBlue }}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to pick a plan?</h2>
          <p className="text-white/90 mb-8">Join South African entrepreneurs using 72X to manage, market and grow their businesses.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transition-colors">
              Start Free Trial
            </button>
            <button className="border border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </main>
    </div>
  );
};

export default Pricing;


