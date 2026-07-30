import React from 'react';
import { UploadCloud } from 'lucide-react';

const documents = [
  'Upload ID *',
  'Upload Company Registration *',
  'Upload Bank Statement',
  'Upload Business Profile',
  'Upload Tax Clearance',
  'Upload Additional Documents',
];

const SupportingDocumentsSection: React.FC = () => {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-semibold text-slate-900">Supporting Documents</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">Upload supporting documents in PDF, JPG or PNG format.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {documents.map((label) => (
          <label key={label} className="flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 transition hover:border-[#93C5FD] hover:bg-[#F8FAFC]">
            <span className="text-sm font-semibold text-slate-700">{label}</span>
            <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-[#2563EB]">
              <UploadCloud className="h-4 w-4" />
              Upload
            </div>
            <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
          </label>
        ))}
      </div>
    </section>
  );
};

export default SupportingDocumentsSection;
