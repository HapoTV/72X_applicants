// src/pages/Signup.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.svg';
import { useSignup } from './hooks/useSignup';
import { ORGANISATIONS } from '../interfaces/OrganisationLists';
import { publicAxios } from '../api/axiosClient';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    industry: '',
    location: '',
    founded: '',
    employees: '',
    hasBankReference: false,
    businessReference: '',
    organisation: 'Hapo', // Default to Hapo
    organisationType: 'STANDARD_BANK' as 'COC' | 'STANDARD_BANK',
    subOrganisation: '',
    acceptTerms: false,
  });

  const { isLoading, error, setError, submit } = useSignup();
  
  const update = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  const standardBankName = useMemo(() => ORGANISATIONS[0] || 'Standard Bank', []);

  const [cocOrganisations, setCocOrganisations] = useState<string[]>([]);
  const [loadingCocOrganisations, setLoadingCocOrganisations] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!form.hasBankReference || form.organisationType !== 'COC') return;

      setLoadingCocOrganisations(true);
      try {
        // Signup is public. Avoid axiosClient here, because its 401 interceptor hard-redirects to /login.
        const response = await publicAxios.get('/coc-organisations/public', {
          params: { parentOrganisation: 'COC' },
        });
        if (cancelled) return;

        const payload = response?.data;
        let list = Array.isArray(payload) ? payload : [];

        if (list.length === 0) {
          const fallbackResponse = await publicAxios.get('/coc-organisations/public');
          const fallbackPayload = fallbackResponse?.data;
          list = Array.isArray(fallbackPayload) ? fallbackPayload : [];
        }

        const names = list.map((o: any) => (typeof o?.name === 'string' ? o.name : '')).filter(Boolean);
        setCocOrganisations(names);
      } catch (_error) {
        if (!cancelled) setCocOrganisations([]);
      } finally {
        if (!cancelled) setLoadingCocOrganisations(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [form.hasBankReference, form.organisationType]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate organisation if hasBankReference is true
    if (form.hasBankReference) {
      if (form.organisationType === 'COC') {
        if (!form.subOrganisation) {
          setError('Please select a sub organisation');
          return;
        }
      }

      const organisation = form.organisationType === 'COC' ? form.subOrganisation : standardBankName;
      await submit({ ...(form as any), organisation } as any);
      return;
    }

    await submit(form as any);
  };

  // Industry options
  const industryOptions = [
    'Technology',
    'Finance & Banking',
    'Healthcare',
    'Retail & E-commerce',
    'Manufacturing',
    'Construction',
    'Education',
    'Hospitality & Tourism',
    'Transportation & Logistics',
    'Media & Entertainment',
    'Agriculture',
    'Real Estate',
    'Energy & Utilities',
    'Professional Services',
    'Non-profit',
    'Other'
  ];

  // Employee size options
  const employeeOptions = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1001-5000',
    '5000+'
  ];

  // Generate year options from 1980 to current year
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1980 + 1 }, (_, i) => {
    const year = (currentYear - i).toString();
    return year;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center mb-6">
          <img src={Logo} alt="SeventyTwoX Logo" className="w-28 h-28 mx-auto" />
          <h1 className="text-xl font-semibold text-gray-900 mt-2">Create your account</h1>
          <p className="text-gray-600 text-sm">Start your growth journey with 72X</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={form.firstName}
                onChange={e => {
                  const value = e.target.value;
                  if (/^[A-Za-z\s]*$/.test(value) || value === '') {
                    update('firstName', value);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                required
                maxLength={50}
                placeholder="John"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={form.lastName}
                onChange={e => {
                  const value = e.target.value;
                  if (/^[A-Za-z\s]*$/.test(value) || value === '') {
                    update('lastName', value);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                required
                maxLength={50}
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input 
              type="email" 
              value={form.email} 
              onChange={e => update('email', e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors" 
              required
              maxLength={100}
              placeholder="john@example.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number *
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => {
                  const value = e.target.value;
                  // Allow digits, spaces, dashes, parentheses
                  if (/^[\d\s\-\(\)\+]*$/.test(value)) {
                    update("phone", value);
                  }
                }}
                placeholder="082 123 4567"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                required
                maxLength={15}
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: 082 123 4567 or +27 82 123 4567
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={form.companyName}
                onChange={e => {
                  const value = e.target.value;
                  // Allow letters, numbers, spaces, and common punctuation
                  if (/^[A-Za-z0-9\s\-,.&']*$/.test(value) || value === '') {
                    update('companyName', value);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                required
                maxLength={100}
                placeholder="Acme Inc."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry *
              </label>
              <select
                value={form.industry}
                onChange={e => update('industry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white"
                required
              >
                <option value="">Select your industry</option>
                {industryOptions.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                value={form.location}
                onChange={e => update('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                required
                maxLength={100}
                placeholder="City, Country"
              />
              <p className="text-xs text-gray-500 mt-1">
                e.g. Johannesburg, South Africa
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year Established *
              </label>
              <select
                value={form.founded}
                onChange={e => update('founded', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white"
                required
              >
                <option value="">Select year established</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Your business must be established since at least 1980
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Employees *
              </label>
              <select
                value={form.employees}
                onChange={e => update('employees', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white"
                required
              >
                <option value="">Select employee count</option>
                {employeeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size} employees
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Do you have a business reference from your organisation?
            </label>
            <div className="flex items-center gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="organisationRef"
                  checked={form.hasBankReference === true}
                  onChange={() => update('hasBankReference', true)}
                  className="w-4 h-4 text-primary-600 border-gray-300 cursor-pointer"
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="organisationRef"
                  checked={form.hasBankReference === false}
                  onChange={() => { 
                    update('hasBankReference', false); 
                    update('businessReference', ''); 
                    update('organisation', 'Hapo'); // Reset to Hapo when No is selected
                    update('organisationType', 'STANDARD_BANK');
                    update('subOrganisation', '');
                  }}
                  className="w-4 h-4 text-primary-600 border-gray-300 cursor-pointer"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
            </div>

            {form.hasBankReference && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Organisation *
                  </label>
                  <div className="flex items-center gap-6 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="organisationType"
                        checked={form.organisationType === 'COC'}
                        onChange={() => {
                          update('organisationType', 'COC');
                          update('organisation', '');
                        }}
                        className="w-4 h-4 text-primary-600 border-gray-300 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">COC</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="organisationType"
                        checked={form.organisationType === 'STANDARD_BANK'}
                        onChange={() => {
                          update('organisationType', 'STANDARD_BANK');
                          update('subOrganisation', '');
                          update('organisation', standardBankName);
                        }}
                        className="w-4 h-4 text-primary-600 border-gray-300 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">{standardBankName}</span>
                    </label>
                  </div>

                  {form.organisationType === 'COC' && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Sub Organisation *
                      </label>
                      <select
                        value={form.subOrganisation}
                        onChange={e => {
                          update('subOrganisation', e.target.value);
                          update('organisation', e.target.value);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white"
                        required
                        disabled={loadingCocOrganisations}
                      >
                        <option value="">Select a sub organisation</option>
                        {cocOrganisations.map((org) => (
                          <option key={org} value={org}>
                            {org}
                          </option>
                        ))}
                      </select>
                      {loadingCocOrganisations ? (
                        <p className="text-xs text-gray-500 mt-1">Loading sub organisations...</p>
                      ) : cocOrganisations.length === 0 ? (
                        <p className="text-xs text-gray-500 mt-1">No sub organisations available yet.</p>
                      ) : null}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Select the organisation that provided your business reference
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Reference Number
                  </label>
                  <input
                    type="text"
                    value={form.businessReference}
                    onChange={e => update('businessReference', e.target.value)}
                    placeholder="Enter your business reference"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    If you have a reference from your organisation, enter it here
                  </p>
                </div>
              </div>
            )}

            {!form.hasBankReference && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  Your account will be created under <strong>Hapo</strong> organisation.
                </p>
              </div>
            )}
          </div>

          <div className="pt-2">
            <label className="flex items-start space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={form.acceptTerms} 
                onChange={e => update('acceptTerms', e.target.checked)} 
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-0.5 cursor-pointer" 
                required
              />
              <span className="text-sm text-gray-600">
                I agree to the{' '}
                <a 
                  href="/legal/terms-and-privacy.pdf" 
                  className="text-primary-600 hover:text-primary-700 hover:underline font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service and Privacy Policy
                </a>
              </span>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm hover:shadow"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
            ) : (
              'Continue to create password'
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/login')} 
              className="text-primary-600 hover:text-primary-700 font-medium hover:underline transition-colors"
            >
              Sign in here
            </button>
          </p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to receive occasional emails about your account and our services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;