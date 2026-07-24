import React from 'react';
import { ArrowRight, BookOpen, BriefcaseBusiness, Compass, Layers3, Sparkles, Users } from 'lucide-react';
import LandingHeader from './landing/components/LandingHeader';
import { useLandingPage } from './landing/hooks/useLandingPage';

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

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-900">
      <LandingHeader
        navigate={navigate}
        productDropdownOpen={productDropdownOpen}
        setProductDropdownOpen={setProductDropdownOpen}
        productDropdownRef={productDropdownRef}
        productCategories={productCategories}
        onProductItemClick={handleProductItemClick}
      />

      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-[#EFF6FF] via-white to-[#F8FAFC] shadow-sm">
          <div className="grid items-center gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-20">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#BFDBFE] bg-white/80 px-3 py-1 text-sm font-medium text-[#2563EB]">
                <Sparkles className="h-4 w-4" />
                Development Programmes
              </div>
              <h1 className="mt-6 text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                Business Development Programmes
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Discover entrepreneurship, business development and skills programmes offered through 72X and our trusted partners. Browse available opportunities and apply online without creating a 72X account.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => document.getElementById('available-programmes')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center justify-center rounded-full bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
                >
                  View Available Programmes
                </button>
                <button
                  onClick={() => document.getElementById('about-programmes')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#93C5FD] hover:text-[#2563EB]"
                >
                  Learn More
                </button>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg">
              <div className="rounded-[24px] bg-gradient-to-br from-[#2563EB] to-[#60A5FA] p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">Programme Support</p>
                    <h2 className="mt-2 text-2xl font-semibold">Business growth, mentorship and opportunity</h2>
                  </div>
                  <div className="rounded-2xl bg-white/20 p-3">
                    <Compass className="h-8 w-8" />
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                    <p className="text-sm text-blue-100">Support</p>
                    <p className="mt-2 text-xl font-semibold">Entrepreneurship & growth</p>
                  </div>
                  <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                    <p className="text-sm text-blue-100">Partners</p>
                    <p className="mt-2 text-xl font-semibold">Corporate & development organisations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about-programmes" className="mx-auto mt-20 max-w-5xl rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#2563EB]">About Our Programmes</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Supporting entrepreneurs, SMMEs, NGOs and communities</h2>
            </div>
            <div className="text-lg leading-8 text-slate-600">
              72X works with trusted organisations and development partners to deliver programmes that support entrepreneurs, SMMEs, NGOs and communities across South Africa.
              <br />
              <br />
              Through these programmes, participants gain access to business training, mentorship, practical skills, enterprise development opportunities and digital tools designed to help businesses grow.
              <br />
              <br />
              Applications can be completed directly through the 72X platform without creating an account.
            </div>
          </div>
        </section>

        <section className="mt-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#2563EB]">Why Apply</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Support designed to help you grow with confidence</h2>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {whyApplyItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                  <div className="mt-4 text-sm font-semibold text-[#2563EB]">{index + 1}/4</div>
                </div>
              );
            })}
          </div>
        </section>

        <section id="available-programmes" className="mt-20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#2563EB]">Available Programmes</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Browse opportunities as they are published</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
              <Sparkles className="h-4 w-4 text-[#2563EB]" />
              Programmes will be added from the admin side later
            </div>
          </div>

          <div className="mt-8 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="text-lg font-semibold text-slate-900">Programmes will appear here once they are published.</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              This section is ready to display future programme data from the admin portal and Supabase.
            </p>
            <button
              onClick={() => navigate('/programs/business-development-programme')}
              className="mx-auto mt-6 block w-full max-w-md rounded-[20px] border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#93C5FD] hover:shadow-md"
            >
              <div className="h-28 rounded-[16px] bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE]" />
              <div className="mt-4 h-3 w-24 rounded-full bg-slate-200" />
              <div className="mt-3 h-3 w-32 rounded-full bg-slate-100" />
              <div className="mt-4 h-3 w-full rounded-full bg-slate-100" />
              <div className="mt-2 h-3 w-3/4 rounded-full bg-slate-100" />
              <div className="mt-5 inline-flex rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500">
                View Details
              </div>
            </button>
          </div>
        </section>

        <section className="mt-20 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#2563EB]">How It Works</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">A simple path from discovery to review</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2563EB] text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-slate-900">{step}</h3>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-7 text-slate-600">
            Applications are reviewed by the programme management team. Shortlisted applicants will be contacted directly after the review process.
          </p>
        </section>

        <section className="mt-20 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#2563EB]">Frequently Asked Questions</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Everything you need to know before applying</h2>
          </div>
          <div className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                <summary className="cursor-pointer list-none text-base font-semibold text-slate-900">{faq.question}</summary>
                <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-[32px] bg-[#111827] px-8 py-16 text-white shadow-sm sm:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Ready to apply?</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Ready to Apply?</h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              Browse our available programmes and take the next step towards growing your business.
            </p>
            <button
              onClick={() => document.getElementById('available-programmes')?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
            >
              View Available Programmes
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProgramsPage;
