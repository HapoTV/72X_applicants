import React from "react";
import { useNavigate } from "react-router-dom";
import logoSvg from "../assets/Logo.svg";
const heroImage = "/Unity.jpg";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "AI Business Advisor",
      description: "Get personalized growth recommendations powered by artificial intelligence",
      icon: "🤖",
    },
    {
      title: "Multi-language Support",
      description: "Available in all 11 official South African languages",
      icon: "🗣️",
    },
    {
      title: "Business Management Tools",
      description: "Inventory, POS, and service desk solutions in one platform",
      icon: "🛠️",
    },
    {
      title: "Community & Mentorship",
      description: "Connect with successful entrepreneurs and business experts",
      icon: "👥",
    },
  ];

  const industries = [
    "Retail & E-commerce",
    "Hospitality & Tourism",
    "Professional Services",
    "Manufacturing",
    "Agriculture",
    "Transport & Logistics",
    "Construction",
    "Healthcare",
    "Education",
    "Creative Industries",
  ];

  const gradientBlue =
    "linear-gradient(135deg, #0D0F3B 0%, #1A1C52 25%, #2258A6 50%, #1C90E6 75%, #33B0FF 100%)";

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      {/* Header */}
      <header className="shadow-sm sticky top-0 z-50" style={{ background: gradientBlue }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src={logoSvg}
                alt="72X Logo"
                className="h-12 w-auto"
              />
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                Features
              </a>
              <a href="#apps" className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                Apps
              </a>
              <a href="#industries" className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                Industries
              </a>
              <a href="#community" className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                Community
              </a>
              <a href="#pricing" className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                Pricing
              </a>
              <a href="#help" className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                Help
              </a>
            </nav>

            {/* Login Button */}
            <div className="flex items-center">
              <button
                onClick={handleLoginClick}
                className="text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all duration-200 border-2 border-white/30 shadow-sm hover:shadow-md text-sm"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative">
          <div
            className="h-80 md:h-96 lg:h-[500px] w-full bg-center bg-cover flex items-center justify-center relative"
            style={{ backgroundImage: `url(${heroImage})`, backgroundSize: "cover" }}
          >

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
              <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">Welcome to 72X</h1>
              <h2 className="text-xl md:text-3xl font-semibold text-white mt-4 drop-shadow-lg">Your Smart Business Growth Partner</h2>
              <p className="mt-6 text-white text-lg md:text-xl max-w-2xl drop-shadow-md leading-relaxed">
                Empowering South African entrepreneurs with AI-driven growth tools, local language support,
                interactive learning, and affordable business software tailored for townships and rural areas.
              </p>

              <div className="mt-8">
                <button
                  onClick={handleLoginClick}
                  className="text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:opacity-90 transition-all duration-200 hover:shadow-xl text-lg"
                  style={{ background: gradientBlue }}
                >
                  Login to Access the Platform
                </button>
              </div>

              <p className="mt-4 text-white text-sm opacity-90 drop-shadow-sm">
                Don't have an account?{' '}
                <button onClick={() => navigate('/signup')} className="underline font-semibold hover:text-blue-200">
                  Get started
                </button>
              </p>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="bg-gray-50 py-8 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Trusted by South African Entrepreneurs
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="text-gray-400 font-semibold">Small Business Owners</div>
                <div className="text-gray-400 font-semibold">Township Entrepreneurs</div>
                <div className="text-gray-400 font-semibold">Local Retailers</div>
                <div className="text-gray-400 font-semibold">Service Providers</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need to Grow</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive tools designed for the unique challenges of South African businesses
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center group">
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200"
                    style={{ background: gradientBlue }}
                  >
                    <span className="text-2xl text-white">{feature.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Apps */}
        <section id="apps" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Business Apps</h2>
              <p className="text-xl text-gray-600">All the tools you need in one integrated platform</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: "📦", title: "Inventory Management", desc: "Track stock levels, manage suppliers, and automate reordering" },
                { icon: "💳", title: "POS System", desc: "Modern point-of-sale with multiple payment options" },
                { icon: "🎯", title: "AI Business Advisor", desc: "Get personalized growth recommendations and insights" },
                { icon: "📊", title: "Analytics Dashboard", desc: "Real-time business performance tracking and reporting" },
                { icon: "🛎️", title: "Service Desk", desc: "Manage customer service and support tickets efficiently" },
                { icon: "👥", title: "CRM", desc: "Build better customer relationships and increase sales" },
              ].map((app, idx) => (
                <div key={idx} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: gradientBlue }}>
                    <span className="text-xl text-white">{app.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{app.title}</h3>
                  <p className="text-gray-600">{app.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries */}
        <section id="industries" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Solutions for Every Industry</h2>
              <p className="text-xl text-gray-600">Tailored solutions for South African businesses across all sectors</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {industries.map((industry, index) => (
                <div
                  key={index}
                  className="rounded-lg p-4 text-center hover:scale-105 transition-transform duration-200 group cursor-pointer text-white shadow-lg"
                  style={{ background: gradientBlue }}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-white/30 transition-colors">
                    <span className="text-white">🏢</span>
                  </div>
                  <h3 className="text-sm font-medium text-white">{industry}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community */}
        <section id="community" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Join Our Growing Community</h2>
              <p className="text-xl text-gray-600">Connect, learn, and grow with fellow entrepreneurs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: "👥", title: "Network & Connect", desc: "Join thousands of South African entrepreneurs sharing insights and opportunities" },
                { icon: "🎓", title: "Learn & Grow", desc: "Access exclusive workshops, webinars, and mentorship programs" },
                { icon: "🤝", title: "Collaborate", desc: "Find business partners, suppliers, and customers within our community" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: gradientBlue }}>
                    <span className="text-2xl text-white">{item.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
              <p className="text-xl text-gray-600">Start free and upgrade as you grow</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: "Starter",
                  price: "R0",
                  period: "/month",
                  features: [
                    "Basic business tools",
                    "Email support",
                    "Community access",
                    "1 user included",
                  ],
                  cta: (
                    <button onClick={handleLoginClick} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold transition-colors">
                      Get Started
                    </button>
                  ),
                  highlight: false,
                },
                {
                  name: "Professional",
                  price: "R299",
                  period: "/month",
                  features: [
                    "All Starter features",
                    "Advanced analytics",
                    "Priority support",
                    "AI business advisor",
                    "5 users included",
                  ],
                  cta: (
                    <button
                      onClick={handleLoginClick}
                      className="w-full text-white py-3 rounded-lg font-semibold transition-colors hover:opacity-90"
                      style={{ background: gradientBlue }}
                    >
                      Start Free Trial
                    </button>
                  ),
                  highlight: true,
                },
                {
                  name: "Enterprise",
                  price: "R999",
                  period: "/month",
                  features: [
                    "All Professional features",
                    "Dedicated support",
                    "Custom integrations",
                    "Advanced AI tools",
                    "Unlimited users",
                  ],
                  cta: (
                    <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold transition-colors">
                      Contact Sales
                    </button>
                  ),
                  highlight: false,
                },
              ].map((plan, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-xl p-8 relative ${plan.highlight ? 'shadow-lg border-2' : 'border border-gray-200 hover:border-blue-300 transition-colors'}`}
                  style={plan.highlight ? { borderColor: '#2258A6' } : {}}
                >
                  {plan.highlight && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <span className="text-white px-4 py-1 rounded-full text-sm font-semibold" style={{ background: gradientBlue }}>
                        Most Popular
                      </span>
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.highlight ? 'For growing businesses' : plan.name === 'Starter' ? 'Perfect for new businesses' : 'For established businesses'}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-600">{f}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.cta}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Help */}
        <section id="help" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">We're Here to Help</h2>
              <p className="text-xl text-gray-600">Get the support you need to succeed</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: "📚", title: "Help Center", desc: "Comprehensive guides and documentation" },
                { icon: "🎥", title: "Video Tutorials", desc: "Step-by-step video guides" },
                { icon: "💬", title: "Live Chat", desc: "Instant help from our support team" },
                { icon: "📞", title: "Phone Support", desc: "Talk directly with our experts" },
              ].map((help, h) => (
                <div key={h} className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: gradientBlue }}>
                    <span className="text-2xl text-white">{help.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{help.title}</h3>
                  <p className="text-gray-600 text-sm">{help.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20" style={{ background: gradientBlue }}>
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Grow Your Business?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of South African entrepreneurs using 72X to scale their businesses
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleLoginClick}
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transition-colors"
              >
                Start Free Trial
              </button>
              <button className="border border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                Schedule a Demo
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-white" style={{ background: gradientBlue }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img src={logoSvg} alt="72X Logo" className="h-12 w-auto" />
              </div>
              <p className="text-white/90 text-sm">
                Empowering South African entrepreneurs with AI-driven business tools and localized support.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-white/90">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#apps" className="hover:text-white transition-colors">Apps</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-white/90">
                <li><a href="#industries" className="hover:text-white transition-colors">Industries</a></li>
                <li><a href="#community" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#help" className="hover:text-white transition-colors">Help</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-white/90">
                <li><a href="#help" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#community" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Learning</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Webinars</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-white/90 text-sm">© {new Date().getFullYear()} 72X. All rights reserved.</div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-white/90 hover:text-white transition-colors text-sm">Privacy</a>
              <a href="#" className="text-white/90 hover:text-white transition-colors text-sm">Terms</a>
              <a href="#" className="text-white/90 hover:text-white transition-colors text-sm">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
