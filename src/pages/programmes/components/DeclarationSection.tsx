import React from 'react';

const DeclarationSection: React.FC = () => {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-semibold text-slate-900">Declaration</h2>
      <div className="mt-6 space-y-4 text-sm leading-7 text-slate-700">
        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-[#2563EB]" />
          <span>I confirm that all the information provided is true and correct.</span>
        </label>
        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-[#2563EB]" />
          <span>I agree that my information may be used for purposes related to this programme.</span>
        </label>
      </div>
    </section>
  );
};

export default DeclarationSection;
