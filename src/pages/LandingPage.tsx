import React from "react";
import { useNavigate } from "react-router-dom";
import logoSvg from "../assets/Logo.svg";
import wp3819576 from "../assets/wp3819576.jpg";
import 'boxicons'
import istock from "../assets/istockphoto-1321547410-170667a.jpg";
import { AlignCenter } from "lucide-react";
const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "AI Business Advisor",
      description: "Get personalized growth recommendations powered by artificial intelligence",
      icon: <box-icon type='solid' color='white' name='bot'></box-icon>,
    },
    {
      title: "Multi-language Support",
      description: "Available in all 11 official South African languages",
      icon: <box-icon color='white' name='globe'></box-icon>,
    },
    {
      title: "Business Management Tools",
      description: "Inventory, POS, and service desk solutions in one platform",
      icon: <box-icon type='solid' color='white' name='cog'></box-icon>,
    },
    {
      title: "Community & Mentorship",
      description: "Connect with successful entrepreneurs and business experts",
      icon: <box-icon  color='white' type='solid' name='group'></box-icon>,
    },
  ];

  // Industries content rendered in stacked sections below

  const gradientBlue =
    "linear-gradient(135deg, #353bb6ff 0%, #3135beff 25%, #2258A6 50%, #1C90E6 75%, #33B0FF 100%)";

  const handleLoginClick = () => {
    navigate("/login");
  };

  // Interactive feature cards (tab-style)
  const [activeFeatureIdx, setActiveFeatureIdx] = React.useState<number>(0);
  const featurePanels: Array<{ title: string; bullets: string[] } > = [
    {
      title: "AI Business Advisor",
      bullets: [
        "Personalized growth recommendations",
        "Surface next best actions based on your data",
        "Track progress against your goals",
      ],
    },
    {
      title: "Multi-language Support",
      bullets: [
        "Available in 11 South African languages",
        "Reach customers in their preferred language",
        "Switch languages seamlessly across the app",
      ],
    },
    {
      title: "Business Management Tools",
      bullets: [
        "Inventory, POS and service desk in one place",
        "Automations to reduce manual work",
        "Built for SMEs and township businesses",
      ],
    },
    {
      title: "Community & Mentorship", 
      bullets: [
        "Learn from successful entrepreneurs",
        "Access workshops and mentorship",
        "Find partners, suppliers and customers",
      ],
    },
  ];

  // Rotating audience words (Entrepreneurs, Organizations, Companies)
  const rotatingUsers = ["Entrepreneurs", "Organizations", "Companies"];
  const [userWordIdx, setUserWordIdx] = React.useState<number>(0);
  React.useEffect(() => {
    const id = setInterval(() => {
      setUserWordIdx((i) => (i + 1) % rotatingUsers.length);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  // Stacked industry detail content
  const industryDetails: Array<{ title: string; desc: string; points: string[]; color: string; }> = [
    {
      title: "Retail & E-commerce",
      desc: "Improve stock visibility, reduce stockouts and automate reordering.",
      points: ["Inventory sync across channels", "POS integrations", "Customer insights"],
      color: " #1b73b6ff ",
    },
    {
      title: "Hospitality & Tourism",
      desc: "Streamline bookings and delight guests with smart messaging.",
      points: ["Automated confirmations", "Upsell campaigns", "Real‑time analytics"],
      color: " #A3D3F7 ",
    },
    {
      title: "Professional Services",
      desc: "Manage clients, projects and billing while keeping communication sharp.",
      points: ["Service desk & tickets", "Lead capture", "Pipeline visibility"],
      color: "#f26b6bff",
    },
    {
      title: "Manufacturing",
      desc: "Track orders and production with accurate inventory and supplier data.",
      points: ["Supplier management", "Quality logs", "Order analytics"],
      color: "#3FA4EB",
    },
    {
      title: "Agriculture",
      desc: "Monitor inputs and sales while building resilient distribution.",
      points: ["Batch tracking", "Buyer CRM", "Mobile‑first capture"],
      color: "#18cc36ff",
    },
    {
      title: "Transport & Logistics",
      desc: "Coordinate deliveries, incidents and customer comms from one place.",
      points: ["Job scheduling", "Proof of delivery", "Customer notifications"],
      color: "#ce5fa0ff",
    },
    {
      title: "Construction",
      desc: "Keep projects on budget with site logs, issues and supplier control.",
      points: ["RFQs & suppliers", "Issue tracking", "Project dashboards"],
      color: "#b3b628ff",
    },
    {
      title: "Healthcare",
      desc: "Manage appointments, records and patient journeys securely.",
      points: ["Appointments", "Patient CRM", "Consent & audits"],
      color: "#8221a0ff",
    },
    {
      title: "Education",
      desc: "Automate enrollments, payments and communication with parents.",
      points: ["Enrollments", "Fees & billing", "Announcements"],
      color: "#b48383ff",
    },
    {
      title: "Creative Industries",
      desc: "Sell services and digital goods while nurturing superfans.",
      points: ["Storefront & POS", "Email & SMS", "Community tools"],
      color: "#18cc96ff",

    },
    ];

  // Observe elements with 'reveal-up' to add 'reveal-visible' on enter
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
          }
        });
      },
      { threshold: 0.01, rootMargin: '0px 0px -10% 0px' }
    );

    const elements = Array.from(document.querySelectorAll('.reveal-up'));
    elements.forEach((el) => {
      observer.observe(el);
      const rect = (el as HTMLElement).getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95) {
        el.classList.add('reveal-visible');
      }
    });
    return () => observer.disconnect();
  }, [/* re-evaluate when layout changes */]);

  // Typing effect for the main headline
  const fullHeadline = "Your business, accelerated!";
  const [typedHeadline, setTypedHeadline] = React.useState<string>("");
  React.useEffect(() => {
    let isCancelled = false;

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const runTypingLoop = async () => {
      while (!isCancelled) {
        for (let i = 1; i <= fullHeadline.length && !isCancelled; i++) {
          setTypedHeadline(fullHeadline.slice(0, i));
          await sleep(70);
        }
        if (isCancelled) break;
        await sleep(1200);
        setTypedHeadline("");
        await sleep(200);
      }
    };

    runTypingLoop();
    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      {/* Header */}
      <header className="bg-[#F5F7FA] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-0">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-0">
              <img
                src={logoSvg}
                alt="72X Logo"
                className="h-14 md:h-16 w-auto"
              />
              
              {/* Navigation */}
              <nav className="flex items-center justify-center space-x-3  p-1 text-gray-1000">
                <a href="#features" className=" text-gray-700 hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors">
                  Features
                </a>
                <a href="#industries" className="text-gray-700 hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors">
                  Industries
                </a>
                <a href="#apps" className="text-gray-700 hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors">
                  Apps
                </a>
                <button onClick={() => navigate('/pricing')} className="text-gray-700 hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors">
                  Pricing
                </button>
              </nav>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => navigate('/request-demo')}
                className="text-gray-700  hover:bg-[#3B82F6] px-0.5 py-0.1 rounded-lg font-semibold text-lg transition-all duration-100  hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors"
              >
                Request demo
              </button>
              <button
                onClick={() => navigate('/login')}
                className="text-black bg-[#60A5FA] hover:bg-[#3B82F6] px-2 py-1.5 rounded-lg font-semibold text-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section
          id="features"
          className="relative bg-center bg-cover "
          style={{ backgroundAttachment: 'fixed' }}
        >
          <div className="absolute inset-0 bg-white/50" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40 min-h-[680px] lg:min-h-[580px]">
            <div className="flex justify-center items-center">
              <div className="text-blue text-center max-w-3xl">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4">
                  {typedHeadline}
                  <span className="typing-caret align-middle" />
                </h1>
                <p className="text-2xl font-semibold mb-4">72X, the smart partner for your business growth.</p>
                <p className="mx-auto text-lg text-black/90 mb-8">
                  Empowering South African entrepreneurs with AI-driven growth tools, local language support,
                  interactive learning, and affordable business software tailored for <strong>townships and rural areas</strong>.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => navigate('/signup')}
                    className="inline-flex items-center gap-2 bg-[#60A5FA] hover:bg-[#3B82F6] text-white px-6 py-3 rounded-lg font-semibold shadow-md"
                  >
                    Get started
                  </button>
                  <button
                    onClick={handleLoginClick}
                    className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold shadow-md"
                  >
                    Start Free Trial
                  </button>
                </div>
              </div>
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
                <div className="text-gray-800 font-semibold">Small Business Owners</div>
                <div className="text-gray-800 font-semibold">Township Entrepreneurs</div>
                <div className="text-gray-800 font-semibold">Local Retailers</div>
                <div className="text-gray-800 font-semibold">Service Providers</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20" style={{ background: `url(${istock})`,  backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything You Need to Grow</h2>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                Comprehensive tools designed for the unique challenges of South African businesses
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFeatureIdx(index)}
                  className={`text-center group rounded-xl p-4 transition-all ${
                    activeFeatureIdx === index ? '' : 'bg-transparent'
                  }`}
                >
                  <div
                    className={`w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200 ${
                      activeFeatureIdx === index ? 'bg-[#60A5FA] ' : ''
                    }`}
                    style={{ background: activeFeatureIdx === index ? '' : '' }}
                  >
                    <span className={`text-2xl ${activeFeatureIdx === index ? 'text-[#111827]' : 'text-white'}`}>{feature.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white font-bold mb-2">{feature.title}</h3>
                  <p className="text-white font-semibold text-sm leading-relaxed">{feature.description}</p>
                </button>
              ))}
            </div>

            {/* Active feature panel */}
            <div className="mt-10 bg-[#60A5FA] border border-black/5 rounded-2xl p-6 md:p-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{featurePanels[activeFeatureIdx].title}</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-800">
                {featurePanels[activeFeatureIdx].bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Audience + Partners */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-center text-gray-900 leading-tight mb-4">
              Thousands of <span key={userWordIdx} className="text-[#3B82F6] rotating-word">{rotatingUsers[userWordIdx]}</span>
              <br className="hidden md:block" />
              use 72X to grow their business
            </h2>
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
              From solo founders to established teams, 72X provides the tools, learning, and community to scale faster—without burnout.
            </p>

            {/* Partner logos/names row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 justify-items-center">
              {["StandardBank", "", "", "", ""].map((name, idx) => (
                <div key={idx} className="w-full h-16 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-gray-700 font-semibold">
                  {name}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries */}
           <section id="industries" className="py-20 bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-3">
            <div className="mb-16 relative flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">Solutions for Every Industry</h2>
                <p className="text-xl text-gray-200">Tailored solutions for South African businesses across all sectors</p>
              </div>
              <button
                onClick={() => {
                  document.getElementById('apps')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-black-600 text-gray-800 font-medium hover:opacity-90 transition-colors self-center md:self-start"
                style={{ background: '#fcfcfcff' }}
              >
                Jump to Apps
                <span>↓</span>
              </button>
            </div>

            {/* Stacked industry highlights (scroll to explore) */}
            <div className="mt-8 space-y-5">
              {industryDetails.map((d, idx) => ( 
                <div key={d.title}>
                  <div className={`max-w-2x2 ${idx % 2 === 1 ? 'ml-auto' : ''}`}>
                
                   { /*<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8-200 border-opacity-50  px-2 py-1.5 rounded-lg " style={{ background: d.color }}>
                      <span className="inline-block px-8 py-4 rounded-full text-sm font-bold bg-white/70 text-gray-800 mb-3 ">{d.title}</span>
                      <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">How 72X helps</h3>
                      <p className="text-black-700 mb-4 text-center ">{d.desc}</p>
                      <p className="space-y-2 text-black-700 list-disc pl-3 text-center">
                        {d.points.map((p) => (<p key={p}>{p}</p>))}
                      </p>
                    </div>*/}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Apps */}
        <section id="apps" className="py-20 bg-gray-50" >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Powerful Business Apps</h2>
              <p className="text-xl text-gray-050">All the tools you need in one integrated platform</p>
            </div>

            {(() => {
              const apps = [
                { icon: <box-icon type='solid' name='package' color='white'></box-icon>, title: "Inventory Management", desc: "Track stock levels, manage suppliers, and automate reordering" },
                { icon: <box-icon name='credit-card' color='white'></box-icon>, title: "POS System", desc: "Modern point-of-sale with multiple payment options" },
                { icon: <box-icon name='target-lock' color='white'></box-icon>, title: "AI Business Advisor", desc: "Get personalized growth recommendations and insights" },
                { icon: <box-icon type='solid' name='bar-chart-square' color='white'></box-icon>, title: "Analytics Dashboard", desc: "Real-time business performance tracking and reporting" },
                { icon: <box-icon type='solid' name='bell' color='white'></box-icon>, title: "Service Desk", desc: "Manage customer service and support tickets efficiently" },
                { icon: <box-icon type='solid' name='user' color='white'></box-icon>, title: "CRM", desc: "Build better customer relationships and increase sales" },
              ];
              const [showAllApps, setShowAllApps] = React.useState(false);
              // re-run reveal observer when toggled
              React.useEffect(() => {
                const elements = Array.from(document.querySelectorAll('.reveal-up'));
                elements.forEach((el) => {
                  const already = el.classList.contains('reveal-visible');
                  if (!already) {
                    const rect = (el as HTMLElement).getBoundingClientRect();
                    if (rect.top < window.innerHeight * 0.95) {
                      el.classList.add('reveal-visible');
                    }
                  }
                });
              }, [showAllApps]);

              return (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
                    {apps.map((app, idx) => (
                      <div
                        key={app.title}
                        className={`bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all reveal-up ${
                          !showAllApps && idx >= 3 ? 'opacity-20 pointer-events-none' : ''
                        }` }
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
                </>
              );
            })()}
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
                { icon: <box-icon name='trending-up' type='solid' color='white' ></box-icon> , title: "Network & Connect", desc: "Join thousands of South African entrepreneurs sharing insights and opportunities" },
                { icon: <box-icon type='solid' name='graduation' color='white' ></box-icon>, title: "Learn & Grow", desc: "Access exclusive workshops, webinars, and mentorship programs" },
                { icon: <box-icon name='group' color='white' ></box-icon>, title: "Collaborate", desc: "Find business partners, suppliers, and customers within our community" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#60A5FA' }}>
                    <span className="text-2xl text-white">{item.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing moved to dedicated page */}

        {/* Help */}
        <section id="help" className="py-20 bg-gray-50" >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">We're Here to Help</h2>
              <p className="text-xl text-gray-600">Get the support you need to succeed</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: <box-icon name='book' color='white' ></box-icon>, title: "Help Center", desc: "Comprehensive guides and documentation" },
                { icon: <box-icon name='camera-movie' color='white' ></box-icon>, title: "Video Tutorials", desc: "Step-by-step video guides" },
                { icon: <box-icon name='conversation' type='solid' color='white' ></box-icon>, title: "Live Chat", desc: "Instant help from our support team" },
                { icon: <box-icon name='phone-call' type='solid' color='white' ></box-icon>, title: "Phone Support", desc: "Talk directly with our experts" },
              ].map((help, h) => (
                <div key={h} className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#60A5FA' }}>
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
        <section className="py-20" style={{ background: `url(${wp3819576})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
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
      <footer className="text-white" style={{ background: '#60A5FA' }}>
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
