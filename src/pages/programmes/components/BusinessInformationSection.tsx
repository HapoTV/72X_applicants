import React from 'react';

interface FormSectionProps {
  formData: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

const BusinessInformationSection: React.FC<FormSectionProps> = ({ formData, onChange }) => {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-semibold text-slate-900">Business Information</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Business Name *</label>
          <input value={formData.businessName} onChange={(e) => onChange('businessName', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none ring-0" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Trading Name</label>
          <input value={formData.tradingName} onChange={(e) => onChange('tradingName', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none ring-0" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Business Registration Number</label>
          <input value={formData.registrationNumber} onChange={(e) => onChange('registrationNumber', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none ring-0" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Business Type *</label>
          <input value={formData.businessType} onChange={(e) => onChange('businessType', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none ring-0" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Industry *</label>
          <input value={formData.industry} onChange={(e) => onChange('industry', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none ring-0" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Years in Business *</label>
          <input value={formData.yearsInBusiness} onChange={(e) => onChange('yearsInBusiness', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none ring-0" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Number of Employees *</label>
          <input value={formData.employees} onChange={(e) => onChange('employees', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none ring-0" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Annual Turnover</label>
          <input value={formData.annualTurnover} onChange={(e) => onChange('annualTurnover', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none ring-0" />
        </div>
      </div>
    </section>
  );
};

export default BusinessInformationSection;
