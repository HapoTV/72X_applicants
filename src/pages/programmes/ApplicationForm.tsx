import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import LandingHeader from '../landing/components/LandingHeader';
import { useLandingPage } from '../landing/hooks/useLandingPage';
import type { Programme } from './types';
import { programmeService } from '../../services/ProgrammeService';
import FormHeader from './components/FormHeader';

type SupportingDocumentKey = 'idDocument' | 'bbeeCertificate' | 'financialStatements' | 'other';

type ChangeableFormField =
  | 'fullName'
  | 'gender'
  | 'email'
  | 'cellphone'
  | 'businessName'
  | 'cipcNumber'
  | 'businessAddress'
  | 'cityTownship'
  | 'businessIndustry'
  | 'bbeeLevel'
  | 'yearEstablished'
  | 'annualTurnover'
  | 'businessDescription'
  | 'uniqueValueProposition'
  | 'acceptDeclaration'
  | 'motivation';

type FormState = {
  fullName: string;
  gender: string;
  email: string;
  cellphone: string;
  businessName: string;
  cipcNumber: string;
  businessAddress: string;
  cityTownship: string;
  businessIndustry: string;
  bbeeLevel: string;
  yearEstablished: string;
  annualTurnover: string;
  businessOwnership: string[];
  businessDescription: string;
  uniqueValueProposition: string;
  applicationDocuments: string[];
  supportingDocuments: Record<SupportingDocumentKey, File | null>;
  acceptDeclaration: string;
  motivation: string;
};

const BBEE_LEVELS = ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 'Level 6', 'Level 7', 'Level 8'];
const YEARS_ESTABLISHED = ['Less than 1 year', '1-2 years', '3-5 years', '6-10 years', 'More than 10 years'];
const ANNUAL_TURNOVER_OPTIONS = ['R0 - R500,000', 'R500,001 - R1,000,000', 'R1,000,001 - R5,000,000', 'More than R5,000,000'];
const BUSINESS_OWNERSHIP_OPTIONS = ['51%+ Black owned', 'Black woman owned', 'Youth owned', 'Disability owned'];
const APPLICATION_DOCUMENTS = ['CIPC registration', 'B-BBEE certificate', 'Tax clearance', 'Proof of address'];
const SUPPORTING_DOCUMENT_SLOTS: Array<{ key: SupportingDocumentKey; label: string }> = [
  { key: 'idDocument', label: 'Certified ID Document' },
  { key: 'bbeeCertificate', label: 'B-BBEE Certificate' },
  { key: 'financialStatements', label: 'Financial Statements' },
  { key: 'other', label: 'Other Supporting Document' },
];

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
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [program, setProgram] = useState<Programme | null>(null);
  const [isLoadingProgram, setIsLoadingProgram] = useState(true);
  const [formData, setFormData] = useState<FormState>({
    fullName: '',
    gender: '',
    email: '',
    cellphone: '',
    businessName: '',
    cipcNumber: '',
    businessAddress: '',
    cityTownship: '',
    businessIndustry: '',
    bbeeLevel: '',
    yearEstablished: '',
    annualTurnover: '',
    businessOwnership: [],
    businessDescription: '',
    uniqueValueProposition: '',
    applicationDocuments: [],
    supportingDocuments: {
      idDocument: null,
      bbeeCertificate: null,
      financialStatements: null,
      other: null,
    },
    acceptDeclaration: '',
    motivation: '',
  });

  const handleChange = (field: ChangeableFormField, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayValue = (field: 'businessOwnership' | 'applicationDocuments', value: string) => {
    setFormData((prev) => {
      const currentValues = prev[field];
      const updatedValues = Array.isArray(currentValues)
        ? currentValues.includes(value)
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value]
        : [value];
      return { ...prev, [field]: updatedValues } as FormState;
    });
  };

  const handleFileChange = (key: SupportingDocumentKey, file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      supportingDocuments: {
        ...prev.supportingDocuments,
        [key]: file,
      },
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmissionError(null);

    if (!program?.id) {
      console.error('Cannot submit programme application without a valid programme id');
      return;
    }

    if (!isComplete) {
      setSubmissionError('Please complete all required fields before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const application = await programmeService.submitProgrammeApplication(program.id, {
        applicantName: formData.fullName.trim(),
        email: formData.email,
        phoneNumber: formData.cellphone,
        businessName: formData.businessName,
        registrationNumber: formData.cipcNumber,
        industry: formData.businessIndustry,
        gender: formData.gender,
        businessAddress: formData.businessAddress,
        cityTownship: formData.cityTownship,
        bbeeLevel: formData.bbeeLevel,
        yearEstablished: formData.yearEstablished,
        annualTurnover: formData.annualTurnover,
        businessOwnership: formData.businessOwnership.join(', '),
        businessDescription: formData.businessDescription,
        uniqueValueProposition: formData.uniqueValueProposition,
        applicationDocuments: formData.applicationDocuments.join(', '),
        acceptDeclaration: formData.acceptDeclaration,
        motivation: formData.motivation,
      });

      const applicationId = application.id;
      const fileUploads = Object.entries(formData.supportingDocuments).filter(
        (entry): entry is [SupportingDocumentKey, File] => entry[1] !== null,
      );

      for (const [key, file] of fileUploads) {
        const slot = SUPPORTING_DOCUMENT_SLOTS.find((item) => item.key === key);
        const label = slot?.label ?? 'Supporting document';
        await programmeService.uploadProgrammeApplicationDocument(applicationId, label, file);
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit programme application:', error);
      setSubmissionError('There was a problem submitting your application. Please try again or contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isComplete = useMemo(() => {
    return (
      formData.fullName.trim() !== '' &&
      formData.gender.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.cellphone.trim() !== '' &&
      formData.businessName.trim() !== '' &&
      formData.cipcNumber.trim() !== '' &&
      formData.businessAddress.trim() !== '' &&
      formData.cityTownship.trim() !== '' &&
      formData.businessIndustry.trim() !== '' &&
      formData.bbeeLevel.trim() !== '' &&
      formData.yearEstablished.trim() !== '' &&
      formData.annualTurnover.trim() !== '' &&
      formData.businessDescription.trim() !== '' &&
      formData.uniqueValueProposition.trim() !== '' &&
      formData.applicationDocuments.length > 0 &&
      formData.acceptDeclaration.trim() !== '' &&
      formData.motivation.trim() !== ''
    );
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
          setIsLoadingProgram(false);
          return;
        }
      } catch (error) {
        console.error('Failed to load programme for application form:', error);
      }

      setIsLoadingProgram(false);
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
            <h1 className="mt-6 text-3xl font-semibold text-slate-900">Application Successfully Uploaded</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Thank you for applying to the Standard Bank {program.title} Programme. Your application has been received and is now under review. Our team will assess all applications, and shortlisted applicants will be contacted directly regarding the outcome.
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

          {/* Intro / eligibility text */}
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-base leading-8 text-slate-600">
              Standard Bank Enterprise Development, in collaboration with the Gauteng Provincial Treasury, is
              pleased to announce the return of the Gauteng Township Business Development Programme, in
              partnership with Classic Oriental Consultancy. The programme will equip 100 selected businesses
              with essential business skills and mentorship, empowering them to thrive and succeed.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Are you a registered township business owner in the Gauteng Province that is willing to learn and
              grow? Join the Standard Bank 6 Week Township Business Development Programme, see the following for
              more details:
            </p>

            <h3 className="mt-6 text-base font-semibold text-slate-900">Who can apply for the programme:</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-7 text-slate-600">
              <li>Gauteng based Business.</li>
              <li>Business that is 51% or more black owned (broad-based black; South African citizen).</li>
              <li>Trading within South Africa and the majority shareholder be a Black South African citizen.</li>
              <li>An existing, established business with a minimum annual turnover of R0 to R5 Million.</li>
              <li>Business must be operational for a minimum of 12 months to 5 years.</li>
              <li>
                The business must be formally registered with CIPC as a (Pty) Ltd, and the business must be in
                good standing with all valid compliance documents (B-BBEE certificate, etc.).
              </li>
              <li>MUST have transportation to the training venue (in the designated area where you will be trained).</li>
            </ul>

            <h3 className="mt-6 text-base font-semibold text-slate-900">Exclusions:</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-7 text-slate-600">
              <li>Non-Profit Organisations, Non-Government Organisations, Co-operatives and joint ventures.</li>
              <li>Standard Bank staff members.</li>
            </ul>

            <p className="mt-6 text-sm font-semibold italic text-slate-700">
              Complete this application form and submit it no later than Tuesday, 23 September 2025.
            </p>

            <p className="mt-4 text-xs italic leading-6 text-slate-500">
              By registering for the development programme you acknowledge that your personal information will
              be processed by us according to our privacy statement which is in line with applicable laws on
              protecting and processing personal information.
            </p>
          </section>

          {/* Personal Details */}
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold text-slate-900">Personal Details:</h2>

            <div className="mt-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-800">
                  Name and Surname <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="mt-2 flex gap-6">
                  {['Female', 'Male'].map((option) => (
                    <label key={option} className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="radio"
                        name="gender"
                        required
                        checked={formData.gender === option}
                        onChange={() => handleChange('gender', option)}
                        className="h-4 w-4 text-[#2563EB]"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800">
                  Cellphone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.cellphone}
                  onChange={(e) => handleChange('cellphone', e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                />
              </div>
            </div>
          </section>

          {/* Business Details */}
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold text-slate-900">Business Details:</h2>

            <div className="mt-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-800">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => handleChange('businessName', e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800">
                  CIPC Company Registration No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.cipcNumber}
                  onChange={(e) => handleChange('cipcNumber', e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800">
                  Business Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessAddress}
                  onChange={(e) => handleChange('businessAddress', e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800">
                  City/Township <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.cityTownship}
                  onChange={(e) => handleChange('cityTownship', e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800">
                  Business Industry <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hair Salon, Spaza Shop, Logistics..."
                  value={formData.businessIndustry}
                  onChange={(e) => handleChange('businessIndustry', e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800">
                  B-BBEE Level Contributor: <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.bbeeLevel}
                  onChange={(e) => handleChange('bbeeLevel', e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                >
                  <option value="">Please Select</option>
                  {BBEE_LEVELS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800">
                  Year Established <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.yearEstablished}
                  onChange={(e) => handleChange('yearEstablished', e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                >
                  <option value="">Please Select</option>
                  {YEARS_ESTABLISHED.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800">
                  Annual Turnover (Last Financial Year) <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.annualTurnover}
                  onChange={(e) => handleChange('annualTurnover', e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                >
                  <option value="">Please Select</option>
                  {ANNUAL_TURNOVER_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800">
                  Select the option that best describes your business: <span className="text-red-500">*</span>
                </label>
                <div className="mt-2 space-y-2">
                  {BUSINESS_OWNERSHIP_OPTIONS.map((option) => (
                    <label key={option} className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={formData.businessOwnership.includes(option)}
                        onChange={() => toggleArrayValue('businessOwnership', option)}
                        className="h-4 w-4 rounded text-[#2563EB]"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800">
                  Describe Your Business: (Provide a brief overview of your products or services and the market
                  you serve) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.businessDescription}
                  onChange={(e) => handleChange('businessDescription', e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800">
                  What is your unique value proposition? <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.uniqueValueProposition}
                  onChange={(e) => handleChange('uniqueValueProposition', e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                />
              </div>
            </div>
          </section>

          {/* Disclaimer and Declaration */}
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold text-slate-900">Disclaimer and Declaration</h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              I hereby confirm that my business possesses all the following valid and up-to-date compliance
              documents. I understand that I must be able to submit these for verification if my application is
              shortlisted.
            </p>
            <p className="mt-2 text-sm italic leading-7 text-slate-600">
              Please tick the box next to each document you confirm is valid and up to date:
            </p>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-slate-800">
                Application Documents <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 space-y-2">
                {APPLICATION_DOCUMENTS.map((option) => (
                  <label key={option} className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.applicationDocuments.includes(option)}
                      onChange={() => toggleArrayValue('applicationDocuments', option)}
                      className="h-4 w-4 rounded text-[#2563EB]"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <label className="block text-sm font-semibold text-slate-800">Supporting Company Documents</label>
              <p className="mt-1 text-xs leading-6 text-slate-500">
                Upload each document you confirmed above. PDF format only, up to 100MB per file.
              </p>
              <div className="mt-3 space-y-3">
                {SUPPORTING_DOCUMENT_SLOTS.map(({ key, label }) => (
                  <div key={key} className="rounded-xl border border-slate-300 px-4 py-3">
                    <p className="text-sm font-medium text-slate-700">{label}</p>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleFileChange(key, e.target.files?.[0] ?? null)}
                      className="mt-2 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-[#EFF6FF] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#2563EB] hover:file:bg-[#DBEAFE]"
                    />
                    {formData.supportingDocuments[key] && (
                      <p className="mt-1 text-xs text-emerald-600">
                        {formData.supportingDocuments[key]?.name} attached
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <h3 className="mt-6 text-base font-semibold text-slate-900">Declaration</h3>
            <ol className="mt-3 list-decimal space-y-3 pl-5 text-sm leading-7 text-slate-600">
              <li>I certify that I have read, understood, and agree to all the information and terms detailed in this application.</li>
              <li>
                I declare that all answers provided in this application are true and correct to the best of my
                knowledge. I have not wilfully withheld any information pertinent to this application. I further
                confirm that I am the duly registered owner of the business and possess full legal authority to
                commit it to this programme.
              </li>
              <li>
                I hereby confirm that the business is an existing 51% or more black-owned business that has been
                in full operation for more than 1 year.
              </li>
              <li>
                I understand that selection into the programme requires my full commitment to participate in all
                activities, including in-person training and mentorship sessions, for the entire duration of the
                programme.
              </li>
              {/* Note: the PDF strikes through "and is located within the Gauteng area." on clause 3
                  and "from October 2025 to November 2025." on clause 4 — both intentionally omitted above. */}
              <li>
                I acknowledge that I am solely responsible for arranging my own transportation to and from the
                designated in-person training venue where I will be trained.
              </li>
              <li>Company Documents will be required for verification purposes.</li>
            </ol>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-slate-800">
                I accept the above mentioned: <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 flex gap-6">
                {['Yes', 'No'].map((option) => (
                  <label key={option} className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="radio"
                      name="acceptDeclaration"
                      required
                      checked={formData.acceptDeclaration === option}
                      onChange={() => handleChange('acceptDeclaration', option)}
                      className="h-4 w-4 text-[#2563EB]"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <label className="block text-sm font-semibold text-slate-800">
                Why should your business be selected for this programme? <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.motivation}
                onChange={(e) => handleChange('motivation', e.target.value)}
                placeholder="Tell us about your business goals, challenges, and how this programme will help you grow."
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
              />
            </div>
          </section>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <FileText className="h-5 w-5 text-[#2563EB]" />
                <span>{isComplete ? 'Form ready to submit' : 'Please complete the required fields'}</span>
              </div>
              <div className="flex flex-col items-start gap-3 sm:items-end">
                {submissionError && (
                  <p className="text-sm font-medium text-red-600">{submissionError}</p>
                )}
                <button
                  type="submit"
                  disabled={!isComplete || isSubmitting}
                  className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition ${
                    !isComplete || isSubmitting
                      ? 'cursor-not-allowed bg-slate-400'
                      : 'bg-[#2563EB] hover:bg-[#1D4ED8]'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ApplicationForm;
