import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  ChevronDown, 
  BarChart3, 
  MessageCircle, 
  BookOpen, 
  ShoppingBag, 
  AppWindow, 
  DollarSign, 
  Video, 
  Brain, 
  GraduationCap, 
  Headphones, 
  MessagesSquare, 
  Bell, 
  Calendar, 
  CheckSquare, 
  ArrowRight,
  ArrowDown,
  Briefcase,
  Sprout,
  Truck,
  Factory,
  Home,
  Phone
} from 'lucide-react';
import wp3819576 from "../assets/wp3819576.jpg";
import 'boxicons';
const logoUrl = "/Logo2.png";
const footerLogo = "/Logo3.png";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [productDropdownOpen, setProductDropdownOpen] = React.useState(false);
  const productDropdownRef = React.useRef<HTMLDivElement | null>(null);

  // Product categories for dropdown
  const productCategories = [
    {
      title: 'APPS',
      items: [
        { name: 'Service Desk', icon: MessageCircle, path: '/applications' },
        { name: 'Inventory Portal', icon: ShoppingBag, path: '/applications' },
        { name: 'POS System', icon: AppWindow, path: '/applications' },
        { name: 'See apps', icon: ArrowRight, path: '#apps', isAnchor: true },
      ]
    },
    {
      title: 'COMMUNICATION',
      items: [
        { name: '24/7 Support', icon: Headphones, path: '/support' },
        { name: 'AI Chatbot', icon: 'bx bxs-bot', path: '/chatbot' },
        { name: 'Community Chat', icon: MessagesSquare, path: '/community' },
        { name: 'Email/SMS Alerts', icon: Bell, path: '/notifications' },
      ]
    },
    {
      title: 'GROWTH',
      items: [
        { name: 'Business Training', icon: GraduationCap, path: '/learning' },
        { name: 'Funding Finder', icon: DollarSign, path: '/funding' },
        { name: 'Mentorship Program', icon: Video, path: '/mentorship' },
        { name: 'Market Insights', icon: Brain, path: '/analytics' },
      ]
    },
    {
      title: 'TIME',
      items: [
        { name: 'Event Scheduler', icon: Calendar, path: '/schedule' },
        { name: 'Booking System', icon: 'bx bx-time', path: '/bookings' },
        { name: 'Task Deadlines', icon: CheckSquare, path: '/tasks' },
        { name: 'Meeting Planner', icon: Video, path: '/meetings' },
      ]
    },
    {
      title: 'MORE',
      items: [
        { name: 'Business Templates', icon: BookOpen, path: '/resources' },
        { name: 'Integration Hub', icon: AppWindow, path: '/integrations' },
        { name: 'Data Reports', icon: BarChart3, path: '/reports' },
        { name: 'Supplier Network', icon: ShoppingBag, path: '/marketplace' },
      ]
    }
  ];

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (productDropdownRef.current && !productDropdownRef.current.contains(event.target as Node)) {
        setProductDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProductDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  console.log('LandingPage rendered - Product dropdown available');

  const features = [
    {
      title: "AI Business Advisor",
      description: "Get personalized growth recommendations powered by artificial intelligence",
      icon: <i className="bx bx-chip" style={{color: 'white'}}></i>,
    },
    {
      title: "Multi-language Support",
      description: "Available in all 11 official South African languages",
      icon: <i className="bx bx-world" style={{color: 'white'}}></i>,
    },
    {
      title: "Business Management Tools",
      description: "Inventory, POS, and service desk solutions in one platform",
      icon: <i className="bx bx-grid-alt" style={{color: 'white', fontSize: '20px'}}></i>,
    },
    {
      title: "Community & Mentorship",
      description: "Connect with successful entrepreneurs and business experts",
      icon: <i className="bx bx-support" style={{color: 'white', fontSize: '20px'}}></i>,
    },
  ];

  // Industries content rendered in stacked sections below
  // Removed unused gradientBlue and handleLoginClick

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

  // Industry details with app-style cards
  const industryDetails = [
    {
      title: "Retail & E-commerce",
      desc: "Transform your retail business with AI-driven inventory management and seamless unified shopping experiences.",
      points: [
        "Real-time inventory tracking across all sales channels",
        "AI-powered demand forecasting to prevent stockouts",
        "Personalized customer recommendations engine",
        "Mobile POS with offline capabilities"
      ],
      icon: ShoppingBag,
      color: "#3B82F6"
    },
    {
      title: "Hospitality & Tourism",
      desc: "Deliver exceptional guest experiences with smart booking and service automation.",
      points: [
        "Automated booking confirmations and reminders",
        "AI-powered dynamic pricing optimization",
        "Contactless check-in/out solutions",
        "Automated review management"
      ],
      icon: Home,
      color: "#10B981"
    },
    {
      title: "Professional Services",
      desc: "Streamline operations and enhance client engagement with intelligent automation.",
      points: [
        "Automated appointment scheduling and reminders",
        "Client portal with secure document sharing",
        "Time tracking and billing automation",
        "AI-powered insights for service optimization"
      ],
      icon: Briefcase,
      color: "#8B5CF6"
    },
    {
      title: "Manufacturing",
      desc: "Optimize production and supply chain with real-time monitoring and predictive maintenance.",
      points: [
        "IoT-enabled equipment monitoring",
        "Predictive maintenance scheduling",
        "Supply chain visibility and optimization",
        "Quality control automation"
      ],
      icon: Factory,
      color: "#F59E0B"
    },
    {
      title: "Agriculture",
      desc: "Modernize farming operations with precision agriculture and market intelligence.",
      points: [
        "Soil and crop monitoring with IoT sensors",
        "Automated irrigation control",
        "Commodity price tracking and forecasting",
        "Supply chain optimization for fresh produce"
      ],
      icon: Sprout,
      color: "#22C55E"
    },
    {
      title: "Transport & Logistics",
      desc: "Optimize fleet operations and enhance delivery efficiency with smart logistics.",
      points: [
        "Real-time vehicle tracking and routing",
        "Automated proof of delivery",
        "Fuel consumption monitoring",
        "Predictive maintenance scheduling"
      ],
      icon: Truck,
      color: "#EC4899"
    }
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
                src={logoUrl} 
                alt="72X Logo" 
                className="h-16 md:h-20 w-auto"
                onError={(e) => {
                  // Fallback in case the image fails to load
                  (e.target as HTMLImageElement).onerror = null;
                  (e.target as HTMLImageElement).src = '/logo.png';
                }}
              />
              
              {/* Navigation */}
              <nav className="hidden md:flex space-x-8 items-center">
                <a href="#features" className="text-gray-700 hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors">
                  Features
                </a>
                <a href="#industries" className="text-gray-700 hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors">
                  Industries
                </a>
                
                {/* Product Dropdown */}
                <div 
                  className="relative" 
                  ref={productDropdownRef}
                  onMouseEnter={() => setProductDropdownOpen(true)}
                  onMouseLeave={() => setProductDropdownOpen(false)}
                >
                  <button
                    onClick={() => setProductDropdownOpen(!productDropdownOpen)}
                    className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors"
                  >
                    <span>Product</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${productDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {productDropdownOpen && (
                    <div 
                      className="fixed left-0 right-0 mt-2 bg-white border-t border-gray-200 shadow-xl z-50 py-8"
                      onMouseEnter={() => setProductDropdownOpen(true)}
                      onMouseLeave={() => setProductDropdownOpen(false)}
                    >
                      <div className="max-w-7xl mx-auto px-8">
                        <div className="grid grid-cols-5 gap-8">
                        {productCategories.map((category, idx) => (
                          <div key={idx}>
                            <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
                              {category.title}
                            </h3>
                            <ul className="space-y-2">
                              {category.items.map((item) => {
                                // Color scheme based on category
                                const getIconColor = () => {
                                  switch(category.title) {
                                    case 'APPS': return 'text-blue-600 group-hover:text-blue-700';
                                    case 'COMMUNICATION': return 'text-purple-600 group-hover:text-purple-700';
                                    case 'GROWTH': return 'text-green-600 group-hover:text-green-700';
                                    case 'TIME': return 'text-orange-600 group-hover:text-orange-700';
                                    case 'MORE': return 'text-pink-600 group-hover:text-pink-700';
                                    default: return 'text-gray-600 group-hover:text-gray-700';
                                  }
                                };
                                
                                return (
                                <li key={item.path}>
                                  <button
                                    onClick={() => {
                                      if ('isAnchor' in item && item.isAnchor) {
                                        // Scroll to section on same page
                                        const element = document.querySelector(item.path);
                                        if (element) {
                                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }
                                      } else {
                                        navigate(item.path);
                                      }
                                      setProductDropdownOpen(false);
                                    }}
                                    className="flex items-center space-x-2 w-full text-left px-2 py-2 rounded hover:bg-gray-50 transition-colors group"
                                  >
                                    <item.icon className={`w-4 h-4 ${getIconColor()}`} />
                                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{item.name}</span>
                                  </button>
                                </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
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
          style={{ backgroundAttachment: 'fixed'}}
        >
          <div className="absolute inset-0 bg-white" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40 min-h-[680px] lg:min-h-[580px]">
            <div className="flex justify-center items-center">
              <div className="text-blue text-center max-w-3xl">
                <h1 className="text-5xl sm:text-6xl md:text-6xl font-extrabold leading-tight mb-4 text-black">
                  {typedHeadline}
                  <span className="typing-caret align-middle" />
                </h1>
                <p className="text-4xl font-semibold mb-4 text-black">72X, the smart partner for your business growth.</p>
                <p className="mx-auto text-3xl text-black/90 mb-8">
                  Empowering South African entrepreneurs with AI-driven growth tools, local language support,
                  interactive learning, and affordable business software tailored for <strong style={{color: '#0b76faff'}}>townships and rural areas</strong>.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => navigate('/signup')}
                    className="inline-flex items-center gap-2 bg-[#60A5FA] hover:bg-[#3B82F6] text-white px-6 py-3 rounded-lg font-semibold shadow-md"
                  >
                    Get started
                  </button>
                  <button
                    onClick={() => navigate('/login')}
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
        <section id="features" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Everything You Need to Grow</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                    className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200 ${
                      activeFeatureIdx === index ? 'bg-[#60A5FA]' : 'bg-[#60A5FA]'
                    }`}
                  >
                    <span className={`text-2xl ${activeFeatureIdx === index ? 'text-[#111827]' : 'text-white'}`}>{feature.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 font-semibold text-sm leading-relaxed">{feature.description}</p>
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
            <div className="flex justify-center items-center gap-12 md:gap-16">
              <img 
                src="/StardandBank.png" 
                alt="Standard Bank" 
                className="h-16 w-auto object-contain" 
                style={{ maxWidth: '180px' }} 
              />
              <img 
                src="/COC pic.png" 
                alt="Chamber of Commerce" 
                className="h-16 w-auto object-contain" 
                style={{ maxWidth: '180px' }} 
              />
            </div>
          </div>
        </section>

        {/* Industries Section - Enhanced */}
        <section id="industries" className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-16">
              <div className="text-center md:text-left mb-8 md:mb-0">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Transform Your Industry with 72X
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl">
                  Tailored solutions designed to address the unique challenges of South African businesses across all sectors
                </p>
              </div>
              <a 
                href="#apps" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-[#60A5FA] hover:bg-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 whitespace-nowrap"
              >
                Jump to Apps
                <ArrowDown className="ml-2 h-5 w-5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {industryDetails.map((industry) => (
                <div 
                  key={industry.title}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group h-full flex flex-col"
                >
                  <div 
                    className="h-1.5 w-full"
                    style={{ backgroundColor: industry.color }}
                  ></div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start space-x-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5" 
                        style={{ backgroundColor: industry.color }}
                      >
                        <industry.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white">{industry.title}</h3>
                    </div>
                    
                    <p className="text-sm text-gray-300 mt-3 mb-4 line-clamp-3">{industry.desc}</p>
                    
                    <div className="mt-auto pt-2">
                      <h4 className="text-xs font-semibold text-[#60A5FA] mb-2 uppercase tracking-wider">Key Features</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {industry.points.slice(0, 2).map((point, i) => (
                          <span 
                            key={i} 
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-700/50 text-gray-200 border border-gray-600/50 leading-tight"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] mr-1.5 flex-shrink-0"></span>
                            <span className="line-clamp-1">{point.split(':')[0]}</span>
                          </span>
                        ))}
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-700/30 text-gray-400 border border-gray-600/30">
                          + More
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Don't see your industry?</h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Our platform is highly customizable to meet the unique needs of any business. Contact us to discuss a tailored solution for your industry.
              </p>
              <button 
                className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300"
                onClick={() => {
                  // Add contact form logic here
                  console.log('Contact us clicked');
                }}
              >
                Get a Custom Solution
              </button>
            </div>
          </div>
        </section>


        {/* Apps */}
        <section id="apps" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Powerful Business Apps</h2>
              <p className="text-xl text-gray-050">All the tools you need in one integrated platform</p>
            </div>

            {(() => {
              const apps = [
                { icon: <i className="bx bxs-package" style={{color: 'white'}}></i>, title: "Inventory Management", desc: "Track stock levels, manage suppliers, and automate reordering" },
                { icon: <i className="bx bx-credit-card" style={{color: 'white'}}></i>, title: "POS System", desc: "Modern point-of-sale with multiple payment options" },
                { icon: <i className="bx bx-target-lock" style={{color: 'white'}}></i>, title: "AI Business Advisor", desc: "Get personalized growth recommendations and insights" },
                { icon: <i className="bx bxs-bar-chart-square" style={{color: 'white'}}></i>, title: "Analytics Dashboard", desc: "Real-time business performance tracking and reporting" },
                { icon: <i className="bx bxs-bell" style={{color: 'white'}}></i>, title: "Service Desk", desc: "Manage customer service and support tickets efficiently" },
                { icon: <i className="bx bxs-user" style={{color: 'white'}}></i>, title: "CRM", desc: "Build better customer relationships and increase sales" },
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
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Join Our Growing Community</h2>
              <p className="text-xl text-gray-600">Connect, learn, and grow with fellow entrepreneurs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { icon: <i className="bx bxs-user-plus" style={{color: 'white'}}></i> , title: "Network & Connect", desc: "Join thousands of South African entrepreneurs sharing insights and opportunities" },
                { icon: <i className="bx bxs-graduation" style={{color: 'white'}}></i>, title: "Learn & Grow", desc: "Access exclusive workshops, webinars, and mentorship programs" },
                { icon: <i className="bx bxs-group" style={{color: 'white'}}></i>, title: "Collaborate", desc: "Find business partners, suppliers, and customers within our community" },
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

        {/* Help Section - Modern Design */}
        <section id="help" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">We're Here to Help</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get the support you need to succeed with our comprehensive help resources and dedicated team
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  icon: <BookOpen className="w-6 h-6" />, 
                  title: "Knowledge Base", 
                  desc: "Comprehensive guides and documentation to help you get the most out of our platform" 
                },
                { 
                  icon: <Video className="w-6 h-6" />, 
                  title: "Video Tutorials", 
                  desc: "Step-by-step video guides for all features and workflows" 
                },
                { 
                  icon: <MessageCircle className="w-6 h-6" />, 
                  title: "Live Chat", 
                  desc: "Instant help from our friendly support team, available 24/7" 
                },
                { 
                  icon: <Phone className="w-6 h-6" />, 
                  title: "Direct Support", 
                  desc: "Talk directly with our experts for personalized assistance" 
                },
              ].map((help, index) => (
                <div 
                  key={index} 
                  className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-100"
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {help.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{help.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{help.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 relative">
          <div 
            className="absolute inset-0 z-0" 
            style={{
              background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url(${wp3819576})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
              filter: 'brightness(0.9)'
            }}
          ></div>
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Grow Your Business?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of South African entrepreneurs using 72X to scale their businesses
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/signup')}
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transition-colors"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => navigate('/request-demo')}
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Schedule a Demo
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img 
                  src={footerLogo} 
                  alt="72X Logo" 
                  className="h-24 w-auto"
                  onError={(e) => {
                    // Fallback in case the image fails to load
                    (e.target as HTMLImageElement).onerror = null;
                    (e.target as HTMLImageElement).src = '/Logo2.png';
                  }}
                />
              </div>
              <p className="text-gray-300 text-sm">
                Empowering South African entrepreneurs with AI-driven business tools and localized support.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-white/90">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#apps" className="hover:text-white transition-colors">Apps</a></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/request-demo" className="hover:text-white transition-colors">Demo</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-white/90">
                <li><a href="#industries" className="hover:text-white transition-colors">Industries</a></li>
                <li><a href="#community" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#help" className="hover:text-white transition-colors">Help</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-white/90">
                <li><a href="#help" className="hover:text-white transition-colors">Help Center</a></li>
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
