import React from 'react';

interface FormSectionProps {
  formData: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

const ApplicantInformationSection: React.FC<FormSectionProps> = ({ formData, onChange }) => {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-semibold text-slate-900">Applicant Information</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">First Name *</label>
          <input value={formData.firstName} onChange={(e) => onChange('firstName', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none ring-0" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Last Name *</label>
          <input value={formData.lastName} onChange={(e) => onChange('lastName', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none ring-0" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">ID / Passport Number *</label>
          <input value={formData.idNumber} onChange={(e) => onChange('idNumber', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none ring-0" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Email Address *</label>
          <input type="email" value={formData.email} onChange={(e) => onChange('email', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none ring-0" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Mobile Number *</label>
          <input value={formData.mobileNumber} onChange={(e) => onChange('mobileNumber', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none ring-0" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Alternative Number</label>
          <input value={formData.alternativeNumber} onChange={(e) => onChange('alternativeNumber', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none ring-0" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Gender</label>
          <input value={formData.gender} onChange={(e) => onChange('gender', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none ring-0" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Age</label>
          <input value={formData.age} onChange={(e) => onChange('age', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none ring-0" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Province *</label>
          <input value={formData.province} onChange={(e) => onChange('province', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none ring-0" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Town / City *</label>
          <input value={formData.town} onChange={(e) => onChange('town', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none ring-0" />
        </div>
      </div>
    </section>
  );
};

export default ApplicantInformationSection;
