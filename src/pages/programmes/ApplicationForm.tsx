import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import LandingHeader from '../landing/components/LandingHeader';
import { useLandingPage } from '../landing/hooks/useLandingPage';
import type { Programme } from './types';
import { programmeService } from '../../services/ProgrammeService';
import FormHeader from './components/FormHeader';
import BusinessInformationSection from './components/BusinessInformationSection';
import ApplicantInformationSection from './components/ApplicantInformationSection';
import BusinessDetailsSection from './components/BusinessDetailsSection';
import SupportingDocumentsSection from './components/SupportingDocumentsSection';
import DeclarationSection from './components/DeclarationSection';

const ApplicationForm: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const {
    productDropdownOpen,
    setProductDropdownOpen,
    productDropdownRef,
    productCategories,
    handleProductItemClick,
  } = useLandingPage();

  const [submitted, setSubmitted] = useState(false);
  const [program, setProgram] = useState<Programme | null>(null);
  const [isLoadingProgram, setIsLoadingProgram] = useState(true);
  const [formData, setFormData] = useState({
    businessName: '',
    tradingName: '',
    registrationNumber: '',
    businessType: '',
    industry: '',
    yearsInBusiness: '',
    employees: '',
    annualTurnover: '',
    firstName: '',
    lastName: '',
    idNumber: '',
    email: '',
    mobileNumber: '',
    alternativeNumber: '',
    gender: '',
    age: '',
    province: '',
    town: '',
    businessLocationProvince: '',
    municipality: '',
    businessTown: '',
    address: '',
    postalCode: '',
    businessDescription: '',
    productsServices: '',
    targetMarket: '',
    challenges: '',
    motivation: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!program?.id) {
      console.error('Cannot submit programme application without a valid programme id');
      return;
    }

    try {
      await programmeService.submitProgrammeApplication(program.id, {
        applicantName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phoneNumber: formData.mobileNumber,
        businessName: formData.businessName,
        registrationNumber: formData.registrationNumber,
        industry: formData.industry,
        motivation: formData.motivation,
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit programme application:', error);
      setSubmitted(true);
    }
  };

  const isComplete = useMemo(() => {
    return Object.values(formData).some((value) => value.trim() !== '');
  }, [formData]);

  useEffect(() => {
    const loadProgramme = async () => {
      if (!slug) {
        setIsLoadingProgram(false);
        return;
      }

      try {
        const backendProgramme = await programmeService.getProgrammeById(slug);
        if (backendProgramme) {
          setProgram({
            id: backendProgramme.id,
            title: backendProgramme.programmeName,
            partner: backendProgramme.partner,
            description: backendProgramme.shortDescription || backendProgramme.fullDescription || 'Learn more about this programme and apply online today.',
            duration: backendProgramme.duration,
            location: [backendProgramme.cityRegion, backendProgramme.province].filter(Boolean).join(' • '),
            closingDate: backendProgramme.applicationsCloseDate || backendProgramme.applicationsOpenDate || 'Closing date to be confirmed',
            status: backendProgramme.status,
          });
        }
      } catch (error) {
        console.error('Failed to load programme for application form:', error);
      } finally {
        setIsLoadingProgram(false);
      }
    };

    loadProgramme();
  }, [slug]);

  if (isLoadingProgram) {
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

        <main className="mx-auto max-w-5xl px-6 py-10 sm:px-8 lg:px-10">
          <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-medium text-slate-700">Loading programme details...</p>
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

        <main className="mx-auto max-w-5xl px-6 py-10 sm:px-8 lg:px-10">
          <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-900">Programme Not Found</h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              We couldn't find the programme you are trying to apply for. Please choose a programme from the programmes page.
            </p>
            <button
              onClick={() => navigate('/programs')}
              className="mt-8 inline-flex items-center rounded-full bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
            >
              Back to Programmes
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (submitted) {
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

        <main className="mx-auto flex max-w-4xl items-center justify-center px-6 py-16 sm:px-8 lg:px-10">
          <div className="w-full rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="mt-6 text-3xl font-semibold text-slate-900">Application Submitted</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Thank you for applying. Your application has been received successfully.
            </p>
            <p className="mt-3 text-base leading-8 text-slate-600">
              A confirmation email has been sent to your email address. Our team will review all applications and contact shortlisted applicants directly.
            </p>
            <button
              onClick={() => navigate('/programs')}
              className="mt-8 inline-flex items-center rounded-full bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
            >
              Return to Programmes
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

      <main className="mx-auto max-w-5xl px-6 py-10 sm:px-8 lg:px-10">
        <button
          onClick={() => navigate(`/programs/${program.id}`)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#93C5FD] hover:text-[#2563EB]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Programme Details
        </button>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <FormHeader program={program} />
          <BusinessInformationSection formData={formData} onChange={handleChange} />
          <ApplicantInformationSection formData={formData} onChange={handleChange} />
          <BusinessDetailsSection formData={formData} onChange={handleChange} />
          <SupportingDocumentsSection />
          <DeclarationSection />

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <FileText className="h-5 w-5 text-[#2563EB]" />
                <span>{isComplete ? 'Form ready to submit' : 'Please complete the required fields'}</span>
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
              >
                Submit Application
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ApplicationForm;
