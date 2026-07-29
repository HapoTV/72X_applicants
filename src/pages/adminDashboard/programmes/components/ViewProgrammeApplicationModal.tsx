import { useState } from 'react';
import type { ProgrammeApplicationItem, ApplicationStatus } from '../types';

interface ViewProgrammeApplicationModalProps {
  application: ProgrammeApplicationItem;
  onClose: () => void;
  onSave: (updatedApplication: ProgrammeApplicationItem) => void;
}

const statusOptions: ApplicationStatus[] = ['Under Review', 'Shortlisted', 'Not selected'];

const getDocumentPreviewUrl = (fileName: string) => {
  // Use an existing local PDF preview file for documents.
  // All documents preview the same local sample file for now.
  return '/legal/terms-and-privacy.pdf';
};

export function ViewProgrammeApplicationModal({ application, onClose, onSave }: ViewProgrammeApplicationModalProps) {
  const [status, setStatus] = useState<ApplicationStatus>(application.status);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLabel, setPreviewLabel] = useState<string>('');

  const handleOpenDocument = (document: { label: string; fileName: string }) => {
    setPreviewLabel(document.label);
    setPreviewUrl(getDocumentPreviewUrl(document.fileName));
  };

  const handleClosePreview = () => {
    setPreviewUrl(null);
    setPreviewLabel('');
  };

  const handleSave = () => {
    onSave({
      ...application,
      status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[calc(100vh-3rem)] overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">View Application</h2>
            <p className="mt-1 text-sm text-gray-600">Review the applicant’s information and documents in read-only mode.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <section className="rounded-3xl border border-gray-200 bg-slate-50 p-5">
            <h3 className="text-lg font-semibold text-slate-900">Applicant Information</h3>
            <dl className="mt-4 space-y-3 text-sm text-slate-700">
              <div>
                <dt className="font-semibold">Full Name</dt>
                <dd className="mt-1">{application.applicantName}</dd>
              </div>
              <div>
                <dt className="font-semibold">Email</dt>
                <dd className="mt-1">{application.email}</dd>
              </div>
              <div>
                <dt className="font-semibold">Phone Number</dt>
                <dd className="mt-1">{application.phoneNumber}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-slate-50 p-5">
            <h3 className="text-lg font-semibold text-slate-900">Business Information</h3>
            <dl className="mt-4 space-y-3 text-sm text-slate-700">
              <div>
                <dt className="font-semibold">Business Name</dt>
                <dd className="mt-1">{application.businessName}</dd>
              </div>
              <div>
                <dt className="font-semibold">Registration Number</dt>
                <dd className="mt-1">{application.registrationNumber}</dd>
              </div>
              <div>
                <dt className="font-semibold">Industry</dt>
                <dd className="mt-1">{application.industry}</dd>
              </div>
            </dl>
          </section>
        </div>

        <section className="mt-6 rounded-3xl border border-gray-200 bg-slate-50 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Motivation</h3>
          <p className="mt-3 min-h-[120px] rounded-2xl border border-gray-200 bg-white p-4 text-sm text-slate-700">
            {application.motivation}
          </p>
        </section>

        <section className="mt-6 rounded-3xl border border-gray-200 bg-slate-50 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Uploaded Documents</h3>
          <ul className="mt-4 space-y-3">
            {application.documents.map((document) => (
              <li key={document.id} className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{document.label}</div>
                    <div className="mt-1 text-sm text-slate-600">{document.fileName}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenDocument(document)}
                    className="rounded-2xl border border-gray-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Open
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {previewUrl ? (
          <section className="mt-6 rounded-3xl border border-gray-200 bg-slate-50 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Document Preview</h3>
                <p className="mt-1 text-sm text-slate-600">{previewLabel}</p>
              </div>
              <button
                type="button"
                onClick={handleClosePreview}
                className="rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-gray-50"
              >
                Close Preview
              </button>
            </div>
            <div className="mt-4 h-[360px] overflow-hidden rounded-3xl border border-gray-200">
              <iframe
                src={previewUrl}
                title={previewLabel}
                className="h-full w-full"
              />
            </div>
          </section>
        ) : null}

        <section className="mt-6 rounded-3xl border border-gray-200 bg-slate-50 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Application Status</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {statusOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setStatus(option)}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${status === option ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-300 bg-white text-slate-700 hover:border-gray-400 hover:bg-gray-50'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </section>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-gray-50 sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="w-full rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 sm:w-auto"
          >
            Save Status
          </button>
        </div>
      </div>
    </div>
  );
}
