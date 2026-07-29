import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Clock3, MapPin, Sparkles } from 'lucide-react';
import LandingHeader from '../landing/components/LandingHeader';
import { useLandingPage } from '../landing/hooks/useLandingPage';
import { programmeService } from '../../services/ProgrammeService';
import type { Programme } from './types';
import type { ProgrammeListItem } from '../adminDashboard/programmes/types';

const mapProgrammeItem = (programme: ProgrammeListItem): Programme => ({
  id: programme.id,
  title: programme.programmeName,
  partner: programme.partner,
  description:
    programme.shortDescription || programme.fullDescription || 'Learn more about this programme and apply online today.',
  duration: programme.duration,
  location: [programme.cityRegion, programme.province].filter(Boolean).join(' • '),
  closingDate: programme.applicationsCloseDate || programme.applicationsOpenDate || 'Closing date to be confirmed',
  status: programme.status,
});

const ProgrammeDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<Programme | null>(null);
  const [loading, setLoading] = useState(true);

  const isUUID = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

  useEffect(() => {
    const loadProgramme = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        const backendProgramme = await programmeService.getProgrammeById(slug);
        if (backendProgramme) {
          setProgram(mapProgrammeItem(backendProgramme));
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Failed to load programme details from backend:', error);
      }

      setLoading(false);
    };

    loadProgramme();
  }, [slug]);
  const {
    productDropdownOpen,
    setProductDropdownOpen,
    productDropdownRef,
    productCategories,
    handleProductItemClick,
  } = useLandingPage();

  if (loading) {
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

        <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
          <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-900">Loading programme details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!program) {
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

        <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
          <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-3xl font-semibold text-slate-900">Programme Not Found</h1>
            <p className="mt-4 text-slate-600">We couldn't find the programme you are trying to view. Please create it in the admin portal and refresh this page.</p>
            <button
              type="button"
              onClick={() => navigate('/programs')}
              className="mt-8 inline-flex rounded-full bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1D4ED8]"
            >
              Back to Programmes
            </button>
          </div>
        </main>
      </div>
    );
  }

  

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

      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
        <button
          onClick={() => navigate('/programs')}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#93C5FD] hover:text-[#2563EB]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Programmes
        </button>

        <section className="mt-8 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-[#2563EB] to-[#60A5FA] px-8 py-10 text-white sm:px-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              {program.status}
            </div>
            <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">{program.title}</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-blue-50">{program.description}</p>
          </div>

          <div className="grid gap-6 px-8 py-8 sm:px-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Programme Overview</h2>
              <p className="mt-3 text-base leading-8 text-slate-600">
                This programme is designed for entrepreneurs and organisations looking for practical support, mentorship and development opportunities.
              </p>
              {(() => {
                const isProgrammeOpen = (program.status || '').toLowerCase().includes('open');
                return (
                  <button
                    onClick={() => { if (isProgrammeOpen) navigate(`/programs/${program.id}/apply`); }}
                    disabled={!isProgrammeOpen}
                    title={isProgrammeOpen ? 'Apply for this programme' : 'Applications are closed for this programme'}
                    className={`mt-6 inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold transition ${isProgrammeOpen ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}
                  >
                    {isProgrammeOpen ? 'Apply Now' : 'Applications Closed'}
                  </button>
                );
              })()}
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#EFF6FF] p-3 text-[#2563EB]">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">Closing Date</p>
                  <p className="text-lg font-semibold text-slate-900">{program.closingDate}</p>
                </div>
              </div>

              <div className="mt-5 space-y-4 text-sm text-slate-600">
                <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
                  <Clock3 className="h-4 w-4 text-[#2563EB]" />
                  <span>Duration: {program.duration}</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
                  <MapPin className="h-4 w-4 text-[#2563EB]" />
                  <span>Location: {program.location}</span>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3">
                  <p className="text-sm font-semibold text-slate-500">Partner</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">{program.partner}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProgrammeDetailsPage;
