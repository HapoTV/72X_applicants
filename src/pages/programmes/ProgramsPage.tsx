import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock3,
  HelpCircle,
  Layers3,
  MapPin,
  Users,
} from 'lucide-react';
import LandingHeader from '../landing/components/LandingHeader';
import LandingFooter from '../landing/components/LandingFooter';
import { useLandingPage } from '../landing/hooks/useLandingPage';
import { programmeService } from '../../services/ProgrammeService';

const whyApplyItems = [
  {
    title: 'Business Development',
    description: 'Access structured support that helps entrepreneurs strengthen their operations and grow sustainably.',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Mentorship & Coaching',
    description: 'Learn from experienced mentors and programme facilitators who understand real business challenges.',
    icon: Users,
  },
  {
    title: 'Skills Training',
    description: 'Build practical capability through workshops, training and hands-on support.',
    icon: BookOpen,
  },
  {
    title: 'Growth Opportunities',
    description: 'Unlock pathways to partnerships, market access and long-term business expansion.',
    icon: Layers3,
  },
];

const steps = [
  'Browse Available Programmes',
  'Read Programme Details',
  'Complete the Online Application',
  'Submit Supporting Documents',
  'Receive Confirmation Email',
  'Programme Team Reviews Applications',
];

const faqs = [
  {
    question: 'Do I need a 72X account?',
    answer: 'No. Applications can be submitted without registering.',
  },
  {
    question: 'How do I know my application was received?',
    answer: 'You will receive an automatic confirmation email after submitting your application.',
  },
  {
    question: 'How will I know if I have been shortlisted?',
    answer: 'The programme organisers will contact shortlisted applicants directly.',
  },
];



const ProgramsPage: React.FC = () => {
  const {
    navigate,
    productDropdownOpen,
    setProductDropdownOpen,
    productDropdownRef,
    productCategories,
    handleProductItemClick,
  } = useLandingPage();

  const [availableProgrammes, setAvailableProgrammes] = useState<any[]>([]);

  useEffect(() => {
    const loadProgrammes = async () => {
      try {
        const programmes = await programmeService.getProgrammes();
        setAvailableProgrammes(Array.isArray(programmes) ? programmes : []);
      } catch (error) {
        console.error('Failed to load programmes from backend:', error);
        setAvailableProgrammes([]);
      }
    };

    loadProgrammes();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#2563EB]/20 font-sans antialiased">
      <LandingHeader
        navigate={navigate}
        productDropdownOpen={productDropdownOpen}
        setProductDropdownOpen={setProductDropdownOpen}
        productDropdownRef={productDropdownRef}
        productCategories={productCategories}
        onProductItemClick={handleProductItemClick}
      />

      {/* Hero Section - Centered High Impact Layout */}
      <section className="pt-16 pb-20 lg:pt-24 lg:pb-32 border-b border-slate-100 bg-gradient-to-b from-[#F0F6FF]/80 via-white to-white">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10 text-center">
          <div className="mx-auto max-w-4xl space-y-8">
            <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-6xl lg:text-7xl leading-[1.1]">
              Business Development Programmes
            </h1>

            <p className="text-xl sm:text-2xl leading-relaxed text-slate-600 font-normal max-w-3xl mx-auto">
              Discover entrepreneurship, business development and skills programmes offered through 72X and our trusted partners. Browse available opportunities and apply online without creating a 72X account.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-5">
              <button
                onClick={() => document.getElementById('available-programmes')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-[#2563EB] px-9 py-4 text-lg font-bold text-white shadow-md shadow-[#2563EB]/25 transition-all duration-200 hover:bg-[#1D4ED8] hover:shadow-lg active:scale-[0.99]"
              >
                View Available Programmes
              </button>
              <button
                onClick={() => document.getElementById('about-programmes')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border-2 border-slate-300 bg-white px-9 py-4 text-lg font-bold text-slate-700 transition-all duration-200 hover:border-[#2563EB] hover:text-[#2563EB]"
              >
                Learn More
              </button>
            </div>

            {/* Centered Checkmark Bullets Bar */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-base font-semibold text-slate-700">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-[#2563EB] shrink-0" />
                <span>Business growth, mentorship and opportunity</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-[#2563EB] shrink-0" />
                <span>Entrepreneurship & growth support</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-[#2563EB] shrink-0" />
                <span>Corporate & development partners</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <main className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10 py-20 lg:py-28 space-y-28 lg:space-y-36">
        
        {/* About Section */}
        <section id="about-programmes" className="scroll-mt-24">
          <div className="grid gap-10 lg:grid-cols-12 items-start">
            <div className="lg:col-span-5 space-y-3">
              <span className="text-sm font-extrabold uppercase tracking-widest text-[#2563EB]">
                About Our Programmes
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl leading-tight">
                Supporting entrepreneurs, SMMEs, NGOs and communities
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-6 text-lg sm:text-xl leading-relaxed text-slate-600">
              <p>
                72X works with trusted organisations and development partners to deliver programmes that support entrepreneurs, SMMEs, NGOs and communities across South Africa.
              </p>
              <p>
                Through these programmes, participants gain access to business training, mentorship, practical skills, enterprise development opportunities and digital tools designed to help businesses grow.
              </p>
              <div className="rounded-r-2xl border-l-4 border-[#2563EB] bg-blue-50/60 p-5 text-base sm:text-lg font-semibold text-slate-800 shadow-sm">
                Applications can be completed directly through the 72X platform without creating an account.
              </div>
            </div>
          </div>
        </section>

        {/* Why Apply Section */}
        <section className="space-y-12">
          <div>
            <span className="text-sm font-extrabold uppercase tracking-widest text-[#2563EB]">
              Why Apply
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl">
              Support designed to help you grow with confidence
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {whyApplyItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm space-y-4 group transition duration-200 hover:border-[#2563EB] hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB] transition-colors duration-200 group-hover:bg-[#2563EB] group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-mono font-extrabold text-slate-400">
                      {index + 1}/4
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 pt-1 group-hover:text-[#2563EB] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-base leading-relaxed text-slate-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Available Programmes Section */}
        <section id="available-programmes" className="scroll-mt-24 space-y-10">
          <div className="pb-6 border-b border-slate-100">
            <span className="text-sm font-extrabold uppercase tracking-widest text-[#2563EB]">
              Available Programmes
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl">
              Browse opportunities as they are published
            </h2>
          </div>

          {availableProgrammes.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg font-semibold text-slate-500">No programmes are currently available.</p>
              <p className="mt-2 text-sm text-slate-400">Please check back soon — new opportunities are published regularly.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {availableProgrammes.map((programme) => (
                <button
                  key={programme.id}
                  type="button"
                  onClick={() => navigate(`/programs/${programme.id}`)}
                  className="group flex flex-col justify-between text-left rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-200 hover:border-[#2563EB] hover:shadow-lg"
                >
                  <div className="space-y-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-blue-50 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-[#2563EB]">
                        {programme.status}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-bold text-slate-600">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        {programme.partner}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors leading-snug">
                      {programme.programmeName}
                    </h3>

                    <p className="text-base leading-relaxed text-slate-600 line-clamp-3">
                      {programme.shortDescription || programme.programmeCategory || 'View details for this programme and apply online.'}
                    </p>
                  </div>

                  <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
                      <div className="inline-flex items-center gap-1.5">
                        <Clock3 className="h-4 w-4 text-[#2563EB]" />
                        <span>{programme.duration}</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-[#2563EB]" />
                        <span>{programme.province}{programme.cityRegion ? ` • ${programme.cityRegion}` : ''}</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-[#2563EB]" />
                        <span>{programme.applications} applications</span>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-2 text-sm font-bold text-[#2563EB] transition-transform duration-200 group-hover:translate-x-1">
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* How It Works Section */}
        <section className="space-y-10">
          <div>
            <span className="text-sm font-extrabold uppercase tracking-widest text-[#2563EB]">
              How It Works
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl">
              A simple path from discovery to review
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-sm font-bold text-white shadow-sm">
                  {index + 1}
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-slate-900 text-lg leading-snug">{step}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 text-base leading-relaxed text-slate-600 flex items-center gap-3 border-t border-slate-100">
            <CheckCircle2 className="h-5 w-5 text-[#2563EB] shrink-0" />
            <span>
              Applications are reviewed by the programme management team. Shortlisted applicants will be contacted directly after the review process.
            </span>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-10">
          <div>
            <span className="text-sm font-extrabold uppercase tracking-widest text-[#2563EB]">
              Frequently Asked Questions
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl">
              Everything you need to know before applying
            </h2>
          </div>

          <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-6 transition-colors duration-150">
                <summary className="cursor-pointer list-none text-lg font-bold text-slate-900 flex justify-between items-center select-none">
                  <span className="flex items-center gap-3.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#2563EB]">
                      <HelpCircle className="h-4.5 w-4.5" />
                    </div>
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown className="h-5 w-5 text-slate-400 transition-transform duration-200 group-open:rotate-180 group-open:text-[#2563EB]" />
                </summary>
                <p className="mt-4 pl-11 text-lg leading-relaxed text-slate-600 max-w-3xl">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Ready to Apply Banner */}
        <section className="py-12 text-center space-y-6 border-t border-slate-100">
          <span className="text-sm font-extrabold uppercase tracking-widest text-[#2563EB]">
            Ready to apply?
          </span>
          <h2 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">Ready to Apply?</h2>
          <p className="text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
            Browse our available programmes and take the next step towards growing your business.
          </p>
          <div className="pt-4">
            <button
              onClick={() => document.getElementById('available-programmes')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center rounded-full bg-[#2563EB] px-9 py-4 text-lg font-bold text-white shadow-md shadow-[#2563EB]/25 transition-all duration-200 hover:bg-[#1D4ED8] hover:shadow-lg active:scale-[0.99]"
            >
              View Available Programmes
            </button>
          </div>
        </section>

      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
};

export default ProgramsPage;
