// src/pages/Signup.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignup } from './hooks/useSignup';
import OrganisationService from '../services/OrganisationService';
import AuthWebLayout from '../components/AuthWebLayout';

const inputClass =
  'w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#29ABE2] focus:border-transparent transition-all bg-white';

const selectClass =
  'w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#29ABE2] focus:border-transparent transition-all bg-white';

const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';

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
    organisation: '',
    acceptTerms: false,
  });
  const [orgGroups, setOrgGroups] = useState<{ organisations: string[]; cocSubOrganisations: string[] }>({ organisations: [], cocSubOrganisations: [] });
  const [orgsLoading, setOrgsLoading] = useState(false);
  const { isLoading, error, setError, submit } = useSignup();

  const update = (k: string, v: unknown) =>
    setForm(prev => ({ ...prev, [k]: v }));

  // Fetch organisation names when user selects "Yes" for bank reference
  useEffect(() => {
    if (!form.hasBankReference) return;
    setOrgsLoading(true);
    OrganisationService.getSignupOrganisationGroups()
      .then(setOrgGroups)
      .catch(() => setOrgGroups({ organisations: [], cocSubOrganisations: [] }))
      .finally(() => setOrgsLoading(false));
  }, [form.hasBankReference]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.hasBankReference && !form.organisation) {
      setError('Please select an organisation');
      return;
    }
    if (form.hasBankReference && !form.businessReference.trim()) {
      setError('Business reference is required');
      return;
    }
    await submit(form as Parameters<typeof submit>[0]);
  };

  const industryOptions = [
    'Technology', 'Finance & Banking', 'Healthcare', 'Retail & E-commerce',
    'Manufacturing', 'Construction', 'Education', 'Hospitality & Tourism',
    'Transportation & Logistics', 'Media & Entertainment', 'Agriculture',
    'Real Estate', 'Energy & Utilities', 'Professional Services', 'Non-profit', 'Other',
  ];

  const employeeOptions = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+'];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1979 }, (_, i) =>
    String(currentYear - i)
  );

  return (
    <AuthWebLayout
      title="Create your account"
      subtitle="Start your growth journey with 72X"
      maxWidth="max-w-2xl"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>First name *</label>
            <input
              type="text"
              value={form.firstName}
              onChange={e => {
                if (/^[A-Za-z\s]*$/.test(e.target.value)) update('firstName', e.target.value);
              }}
              className={inputClass}
              required maxLength={50} placeholder="John"
            />
          </div>
          <div>
            <label className={labelClass}>Last name *</label>
            <input
              type="text"
              value={form.lastName}
              onChange={e => {
                if (/^[A-Za-z\s]*$/.test(e.target.value)) update('lastName', e.target.value);
              }}
              className={inputClass}
              required maxLength={50} placeholder="Doe"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className={labelClass}>Email address *</label>
          <input
            type="email" value={form.email}
            onChange={e => update('email', e.target.value)}
            className={inputClass}
            required maxLength={100} placeholder="john@example.com"
          />
        </div>

        {/* Phone + Company */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Contact number *</label>
            <input
              type="tel" value={form.phone}
              onChange={e => {
                if (/^[\d\s\-\(\)\+]*$/.test(e.target.value)) update('phone', e.target.value);
              }}
              className={inputClass}
              required maxLength={15} placeholder="082 123 4567"
            />
          </div>
          <div>
            <label className={labelClass}>Company name *</label>
            <input
              type="text" value={form.companyName}
              onChange={e => {
                if (/^[A-Za-z0-9\s\-,.&']*$/.test(e.target.value)) update('companyName', e.target.value);
              }}
              className={inputClass}
              required maxLength={100} placeholder="Acme Inc."
            />
          </div>
        </div>

        {/* Industry + Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Industry *</label>
            <select
              value={form.industry} onChange={e => update('industry', e.target.value)}
              className={selectClass}
              required
            >
              <option value="">Select your industry</option>
              {industryOptions.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Location *</label>
            <input
              type="text" value={form.location}
              onChange={e => update('location', e.target.value)}
              className={inputClass}
              required maxLength={100} placeholder="Johannesburg, South Africa"
            />
          </div>
        </div>

        {/* Year + Employees */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Year established *</label>
            <select
              value={form.founded} onChange={e => update('founded', e.target.value)}
              className={selectClass}
              required
            >
              <option value="">Select year</option>
              {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Number of employees *</label>
            <select
              value={form.employees} onChange={e => update('employees', e.target.value)}
              className={selectClass}
              required
            >
              <option value="">Select employee count</option>
              {employeeOptions.map(s => <option key={s} value={s}>{s} employees</option>)}
            </select>
          </div>
        </div>

        {/* Organisation / Bank Reference */}
        <div>
          <label className={labelClass}>
            Are you signing up under an organisation?
          </label>
          <div className="flex items-center gap-6 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio" name="bankRef" checked={form.hasBankReference === true}
                onChange={() => update('hasBankReference', true)}
                className="w-4 h-4 text-[#29ABE2] border-gray-300 cursor-pointer"
              />
              <span className="text-sm text-gray-700">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio" name="bankRef" checked={form.hasBankReference === false}
                onChange={() => {
                  update('hasBankReference', false);
                  update('businessReference', '');
                  update('organisation', '');
                }}
                className="w-4 h-4 text-[#29ABE2] border-gray-300 cursor-pointer"
              />
              <span className="text-sm text-gray-700">No</span>
            </label>
          </div>

          {form.hasBankReference && (
            <div className="mt-4 space-y-4">
              <div>
                <label className={labelClass}>Select organisation *</label>
                {orgsLoading ? (
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-400 text-sm bg-gray-50">
                    Loading organisations...
                  </div>
                ) : (
                  <select
                    value={form.organisation}
                    onChange={e => update('organisation', e.target.value)}
                    className={selectClass}
                    required
                  >
                    <option value="">Select an organisation</option>
                    {orgGroups.organisations.length > 0 && (
                      <optgroup label="-- Organisations --">
                        {orgGroups.organisations.map(org => (
                          <option key={org} value={org}>{org}</option>
                        ))}
                      </optgroup>
                    )}
                    {orgGroups.cocSubOrganisations.length > 0 && (
                      <optgroup label="-- COC Organisations --">
                        {orgGroups.cocSubOrganisations.map(org => (
                          <option key={org} value={org}>{org}</option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                )}
              </div>

              <div>
                <label className={labelClass}>Business reference *</label>
                <input
                  type="text"
                  value={form.businessReference}
                  onChange={e => update('businessReference', e.target.value)}
                  placeholder="Enter your organisation's business reference"
                  className={inputClass}
                  required={form.hasBankReference}
                  maxLength={100}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Provided by your organisation's administrator
                </p>
              </div>
            </div>
          )}

          {!form.hasBankReference && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-xs text-[#29ABE2]">
                A unique business reference will be generated for your account under Hapo Organisation.
              </p>
            </div>
          )}
        </div>

        {/* Terms */}
        <div className="pt-2">
          <label className="flex items-start space-x-2.5 cursor-pointer">
            <input
              type="checkbox" checked={form.acceptTerms}
              onChange={e => update('acceptTerms', e.target.checked)}
              className="w-4 h-4 text-[#29ABE2] border-gray-300 rounded focus:ring-[#29ABE2] mt-0.5 cursor-pointer"
              required
            />
            <span className="text-sm text-gray-600">
              I agree to the{' '}
              <a
                href="/legal/terms-and-privacy.pdf"
                className="text-[#29ABE2] hover:underline font-semibold"
                target="_blank" rel="noopener noreferrer"
              >
                Terms of Service and Privacy Policy
              </a>
            </span>
          </label>
        </div>

        <button
          type="submit" disabled={isLoading}
          className="w-full mt-4 py-3.5 bg-[#29ABE2] hover:bg-[#1e98cc] text-white rounded-full font-semibold text-sm shadow-md transition-all active:scale-[0.99] flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating account...
            </>
          ) : 'Continue to create password'}
        </button>
      </form>
    </AuthWebLayout>
  );
};

export default Signup;
