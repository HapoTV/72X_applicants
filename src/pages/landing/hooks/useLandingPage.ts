import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
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
  Clock,
  ArrowRight,
  ArrowDown,
  Briefcase,
  Sprout,
  Truck,
  Factory,
  Home,
} from 'lucide-react';
import { adService } from '../../../services/AdService';

export type ProductCategoryItem = {
  name: string;
  icon: LucideIcon;
  path: string;
  isAnchor?: boolean;
};

export type ProductCategory = {
  title: string;
  items: ProductCategoryItem[];
};

export function useLandingPage() {
  const navigate = useNavigate();

  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const productDropdownRef = useRef<HTMLDivElement | null>(null);
  const [showAllApps, setShowAllApps] = useState(false);
  const [showAdRequestModal, setShowAdRequestModal] = useState(false);

  const features = useMemo(
    () => [
      {
        title: 'AI Business Advisor',
        description: 'Get personalized growth recommendations powered by artificial intelligence',
        icon: React.createElement('i', { className: 'bx bx-chip', style: { color: 'white' } }),
      },
      {
        title: 'Multi-language Support',
        description: 'Available in all 11 official South African languages',
        icon: React.createElement('i', { className: 'bx bx-world', style: { color: 'white' } }),
      },
      {
        title: 'Business Management Tools',
        description: 'Inventory, POS, and service desk solutions in one platform',
        icon: React.createElement('i', {
          className: 'bx bx-grid-alt',
          style: { color: 'white', fontSize: '20px' },
        }),
      },
      {
        title: 'Community & Mentorship',
        description: 'Connect with successful entrepreneurs and business experts',
        icon: React.createElement('i', {
          className: 'bx bx-support',
          style: { color: 'white', fontSize: '20px' },
        }),
      },
    ],
    [],
  );

  const [activeFeatureIdx, setActiveFeatureIdx] = useState<number>(0);
  const featurePanels: Array<{ title: string; bullets: string[] }> = useMemo(
    () => [
      {
        title: 'AI Business Advisor',
        bullets: [
          'Personalized growth recommendations',
          'Surface next best actions based on your data',
          'Track progress against your goals',
        ],
      },
      {
        title: 'Multi-language Support',
        bullets: [
          'Available in 11 South African languages',
          'Reach customers in their preferred language',
          'Switch languages seamlessly across the app',
        ],
      },
      {
        title: 'Business Management Tools',
        bullets: [
          'Inventory, POS and service desk in one place',
          'Automations to reduce manual work',
          'Built for SMEs and township businesses',
        ],
      },
      {
        title: 'Community & Mentorship',
        bullets: [
          'Learn from successful entrepreneurs',
          'Access workshops and mentorship',
          'Find partners, suppliers and customers',
        ],
      },
    ],
    [],
  );

  const rotatingUsers = useMemo(() => ['Entrepreneurs', 'Organizations', 'Companies'], []);
  const [userWordIdx, setUserWordIdx] = useState<number>(0);

  const productCategories: ProductCategory[] = useMemo(
    () => [
      {
        title: 'APPS',
        items: [
          { name: 'Service Desk', icon: MessageCircle, path: '/applications' },
          { name: 'Inventory Portal', icon: ShoppingBag, path: '/applications' },
          { name: 'POS System', icon: AppWindow, path: '/applications' },
          { name: 'See apps', icon: ArrowRight, path: '#apps', isAnchor: true },
        ],
      },
      {
        title: 'COMMUNICATION',
        items: [
          { name: '24/7 Support', icon: Headphones, path: '/support' },
          { name: 'AI Chatbot', icon: Brain, path: '/chatbot' },
          { name: 'Community Chat', icon: MessagesSquare, path: '/community' },
          { name: 'Email/SMS Alerts', icon: Bell, path: '/notifications' },
        ],
      },
      {
        title: 'GROWTH',
        items: [
          { name: 'Business Training', icon: GraduationCap, path: '/learning' },
          { name: 'Funding Finder', icon: DollarSign, path: '/funding' },
          { name: 'Mentorship Program', icon: Video, path: '/mentorship' },
          { name: 'Market Insights', icon: Brain, path: '/analytics' },
        ],
      },
      {
        title: 'TIME',
        items: [
          { name: 'Event Scheduler', icon: Calendar, path: '/schedule' },
          { name: 'Booking System', icon: Clock, path: '/bookings' },
          { name: 'Task Deadlines', icon: CheckSquare, path: '/tasks' },
          { name: 'Meeting Planner', icon: Video, path: '/meetings' },
        ],
      },
      {
        title: 'MORE',
        items: [
          { name: 'Business Templates', icon: BookOpen, path: '/resources' },
          { name: 'Integration Hub', icon: AppWindow, path: '/integrations' },
          { name: 'Data Reports', icon: BarChart3, path: '/reports' },
          { name: 'Supplier Network', icon: ShoppingBag, path: '/marketplace' },
        ],
      },
    ],
    [],
  );

  const industryDetails = useMemo(
    () => [
      {
        title: 'Retail & E-commerce',
        desc: 'Transform your retail business with AI-driven inventory management and seamless unified shopping experiences.',
        points: [
          'Real-time inventory tracking across all sales channels',
          'AI-powered demand forecasting to prevent stockouts',
          'Personalized customer recommendations engine',
          'Mobile POS with offline capabilities',
        ],
        icon: ShoppingBag,
        color: '#3B82F6',
      },
      {
        title: 'Hospitality & Tourism',
        desc: 'Deliver exceptional guest experiences with smart booking and service automation.',
        points: [
          'Automated booking confirmations and reminders',
          'AI-powered dynamic pricing optimization',
          'Contactless check-in/out solutions',
          'Automated review management',
        ],
        icon: Home,
        color: '#10B981',
      },
      {
        title: 'Professional Services',
        desc: 'Streamline operations and enhance client engagement with intelligent automation.',
        points: [
          'Automated appointment scheduling and reminders',
          'Client portal with secure document sharing',
          'Time tracking and billing automation',
          'AI-powered insights for service optimization',
        ],
        icon: Briefcase,
        color: '#8B5CF6',
      },
      {
        title: 'Manufacturing',
        desc: 'Optimize production and supply chain with real-time monitoring and predictive maintenance.',
        points: [
          'IoT-enabled equipment monitoring',
          'Predictive maintenance scheduling',
          'Supply chain visibility and optimization',
          'Quality control automation',
        ],
        icon: Factory,
        color: '#F59E0B',
      },
      {
        title: 'Agriculture',
        desc: 'Modernize farming operations with precision agriculture and market intelligence.',
        points: [
          'Soil and crop monitoring with IoT sensors',
          'Automated irrigation control',
          'Commodity price tracking and forecasting',
          'Supply chain optimization for fresh produce',
        ],
        icon: Sprout,
        color: '#22C55E',
      },
      {
        title: 'Transport & Logistics',
        desc: 'Optimize fleet operations and enhance delivery efficiency with smart logistics.',
        points: [
          'Real-time vehicle tracking and routing',
          'Automated proof of delivery',
          'Fuel consumption monitoring',
          'Predictive maintenance scheduling',
        ],
        icon: Truck,
        color: '#EC4899',
      },
    ],
    [],
  );

  const additionalIndustries = useMemo(
    () => [
      {
        title: 'Education & Training',
        desc: 'Manage student data, online classes, assessments, and fee collections in one place.',
      },
      {
        title: 'Healthcare & Clinics',
        desc: 'Streamline appointments, patient records, billing, and stock of medical supplies.',
      },
      {
        title: 'Real Estate & Property Management',
        desc: 'Track properties, tenants, maintenance requests, and rental payments efficiently.',
      },
      {
        title: 'Financial Services & Microfinance',
        desc: 'Handle client onboarding, loan portfolios, repayments, and regulatory reporting.',
      },
      {
        title: 'Nonprofits & NGOs',
        desc: 'Coordinate projects, donors, funding, and impact reporting in a single system.',
      },
      {
        title: 'Entertainment & Events',
        desc: 'Organize bookings, ticketing, vendors, and event analytics across venues.',
      },
    ],
    [],
  );

  useEffect(() => {
    const id = setInterval(() => {
      setUserWordIdx((i) => (i + 1) % rotatingUsers.length);
    }, 1800);
    return () => clearInterval(id);
  }, [rotatingUsers.length]);

  useEffect(() => {
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (productDropdownRef.current && !productDropdownRef.current.contains(event.target as Node)) {
        setProductDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProductDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const fullHeadline = 'Your business, accelerated!';
  const [typedHeadline, setTypedHeadline] = useState<string>('');
  useEffect(() => {
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
        setTypedHeadline('');
        await sleep(200);
      }
    };

    runTypingLoop();
    return () => {
      isCancelled = true;
    };
  }, [fullHeadline]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
          }
        });
      },
      { threshold: 0.01, rootMargin: '0px 0px -10% 0px' },
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
  }, []);

  const [isRetailFlipped, setIsRetailFlipped] = useState(false);
  const [isHospitalityFlipped, setIsHospitalityFlipped] = useState(false);
  const [isProfessionalFlipped, setIsProfessionalFlipped] = useState(false);
  const [isManufacturingFlipped, setIsManufacturingFlipped] = useState(false);
  const [isAgricultureFlipped, setIsAgricultureFlipped] = useState(false);
  const [isTransportFlipped, setIsTransportFlipped] = useState(false);
  const [additionalFlipped, setAdditionalFlipped] = useState<boolean[]>(Array(6).fill(false));

  const handleAdRequestSubmit = useCallback(
    async (requestData: { businessName: string; email: string; phone: string; message: string }) => {
      try {
        const userId = localStorage.getItem('userId') || 'anonymous';
        const userName = localStorage.getItem('fullName') || requestData.businessName;
        const userEmail = localStorage.getItem('userEmail') || requestData.email;
        const userPhone = localStorage.getItem('mobileNumber') || requestData.phone;
        const companyName = localStorage.getItem('companyName') || requestData.businessName;
        const industry = localStorage.getItem('industry') || 'Not specified';
        const userPackage = localStorage.getItem('userPackage') || 'Free';

        const subject = `New Advertising Space Request - ${requestData.businessName}`;
        const body = `
NEW ADVERTISING SPACE REQUEST

========================================
BUSINESS DETAILS:
========================================
Business Name: ${requestData.businessName}
Contact Person: ${userName}
Email: ${userEmail}
Phone: ${requestData.phone || userPhone}
Industry: ${industry}
Package: ${userPackage}

========================================
USER DETAILS:
========================================
User ID: ${userId}
Company: ${companyName}
Email (from account): ${localStorage.getItem('userEmail') || 'Not available'}
Phone (from account): ${localStorage.getItem('mobileNumber') || 'Not available'}

========================================
ADVERTISING REQUEST:
========================================
${requestData.message}

========================================
REQUEST DETAILS:
========================================
Request Date: ${new Date().toLocaleString('en-ZA', {
          timeZone: 'Africa/Johannesburg',
          dateStyle: 'full',
          timeStyle: 'long',
        })}

========================================
ACTION REQUIRED:
========================================
1. Review this request
2. Contact the business if needed
3. Create ad campaign in admin panel
4. Notify user when ad is live

ADMIN PANEL: ${window.location.origin}/admin/ads
========================================
      `;

        const adminEmail = 'admin@hapogroup.co.za';
        const mailtoLink = `mailto:${adminEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;

        await adService.recordEngagement('ACTION_COMPLETED', 15, 'Requested advertising space');

        setShowAdRequestModal(false);
        alert(
          'Email client opened. Please send the email to submit your advertising request. Our team will contact you within 24 hours.',
        );
      } catch (error) {
        console.error('Error submitting ad request:', error);
        alert(
          'Failed to open email client. Please contact admin@seventytwox.com directly with your advertising request.',
        );
      }
    },
    [],
  );

  const handleProductItemClick = useCallback(
    (item: ProductCategoryItem) => {
      if (item.isAnchor) {
        document.getElementById(item.path.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate(item.path);
      }
      setProductDropdownOpen(false);
    },
    [navigate],
  );

  return {
    navigate,
    productDropdownOpen,
    setProductDropdownOpen,
    productDropdownRef,
    showAllApps,
    setShowAllApps,
    showAdRequestModal,
    setShowAdRequestModal,
    handleAdRequestSubmit,
    productCategories,
    handleProductItemClick,
    features,
    activeFeatureIdx,
    setActiveFeatureIdx,
    featurePanels,
    rotatingUsers,
    userWordIdx,
    typedHeadline,
    industryDetails,
    additionalIndustries,
    isRetailFlipped,
    setIsRetailFlipped,
    isHospitalityFlipped,
    setIsHospitalityFlipped,
    isProfessionalFlipped,
    setIsProfessionalFlipped,
    isManufacturingFlipped,
    setIsManufacturingFlipped,
    isAgricultureFlipped,
    setIsAgricultureFlipped,
    isTransportFlipped,
    setIsTransportFlipped,
    additionalFlipped,
    setAdditionalFlipped,
    ArrowDown,
  };
}
