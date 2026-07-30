import React from 'react';

interface FormSectionProps {
  formData: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

const BusinessDetailsSection: React.FC<FormSectionProps> = ({ formData, onChange }) => {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-semibold text-slate-900">Business Details</h2>
      <div className="mt-6 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Describe your business *</label>
          <textarea value={formData.businessDescription} onChange={(e) => onChange('businessDescription', e.target.value)} className="min-h-28 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none ring-0" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Products or Services *</label>
          <textarea value={formData.productsServices} onChange={(e) => onChange('productsServices', e.target.value)} className="min-h-28 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none ring-0" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Target Market *</label>
          <textarea value={formData.targetMarket} onChange={(e) => onChange('targetMarket', e.target.value)} className="min-h-28 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none ring-0" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Current Challenges *</label>
          <textarea value={formData.challenges} onChange={(e) => onChange('challenges', e.target.value)} className="min-h-28 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none ring-0" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Why are you applying for this programme? *</label>
          <textarea value={formData.motivation} onChange={(e) => onChange('motivation', e.target.value)} className="min-h-28 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none ring-0" />
        </div>
      </div>
    </section>
  );
};

export default BusinessDetailsSection;
