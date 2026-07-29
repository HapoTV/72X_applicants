import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Clock3, MapPin, Sparkles } from 'lucide-react';
import LandingHeader from '../landing/components/LandingHeader';
import { useLandingPage } from '../landing/hooks/useLandingPage';
import { getProgrammeById } from '../../data/programmesStore';
import { programmeService } from '../../services/ProgrammeService';
import type { Programme } from './types';
import type { ProgrammeListItem } from '../adminDashboard/programmes/types';

const defaultPrograms: Programme[] = [
  {
    id: 'business-development-programme',
    title: 'Business Development Programme',
    partner: '72X',
    description: 'A structured programme focused on business growth, mentorship and practical support for entrepreneurs and SMEs.',
    duration: '12 Weeks',
    location: 'Gauteng & Eastern Cape',
    closingDate: '31 August 2026',
    status: 'Applications Open',
  },
];

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
  const [program, setProgram] = useState<Programme>(defaultPrograms[0]);
  const [loading, setLoading] = useState(true);

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
        } else {
          const storedProgramme = getProgrammeById(slug);
          if (storedProgramme) {
            setProgram(mapProgrammeItem(storedProgramme));
          }
        }
      } catch (error) {
        console.error('Failed to load programme details from backend:', error);
        const storedProgramme = getProgrammeById(slug);
        if (storedProgramme) {
          setProgram(mapProgrammeItem(storedProgramme));
        }
      } finally {
        setLoading(false);
      }
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

  const programMemo = useMemo(() => program, [program]);
  const programme = programMemo;

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
              <button
                onClick={() => navigate(`/programs/${program.id}/apply`)}
                className="mt-6 inline-flex items-center rounded-full bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
              >
                Apply Now
              </button>
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
