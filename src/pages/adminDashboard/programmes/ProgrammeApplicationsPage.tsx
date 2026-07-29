import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, FileText } from 'lucide-react';
import { mockProgrammeApplications } from '../../../data/mockProgrammeApplications';
import { cocProgrammeService } from '../../../services/coc-admin/CocProgrammeService';
import { ProgrammeApplicationFilters } from './components/ProgrammeApplicationFilters';
import { ProgrammeApplicationsTable } from './components/ProgrammeApplicationsTable';
import { ViewProgrammeApplicationModal } from './components/ViewProgrammeApplicationModal';
import type { ProgrammeApplicationItem } from './types';

const ProgrammeApplicationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [programmeFilter, setProgrammeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Under Review' | 'Shortlisted' | 'Not selected'>('All');
  const [applications, setApplications] = useState<ProgrammeApplicationItem[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<ProgrammeApplicationItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const data = await cocProgrammeService.getProgrammeApplications();
        setApplications(data.length ? data : mockProgrammeApplications);
      } catch (error) {
        console.error('Failed to load programme applications from service:', error);
        setApplications(mockProgrammeApplications);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  const programmes = useMemo(() => [...new Set(applications.map((item) => item.programme))], [applications]);

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const matchesSearch = application.applicantName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProgramme = programmeFilter === 'All' || application.programme === programmeFilter;
      const matchesStatus = statusFilter === 'All' || application.status === statusFilter;
      return matchesSearch && matchesProgramme && matchesStatus;
    });
  }, [applications, searchTerm, programmeFilter, statusFilter]);

  const handleSaveApplication = async (updatedApplication: ProgrammeApplicationItem) => {
    setApplications((current) =>
      current.map((application) => (application.id === updatedApplication.id ? updatedApplication : application)),
    );
    setSelectedApplication(updatedApplication);

    try {
      await cocProgrammeService.updateApplicationStatus(updatedApplication.id, updatedApplication.status);
    } catch (error) {
      console.error('Failed to update application status through service:', error);
    }
  };

  const escapeCsvValue = (value: unknown) => {
    const stringValue = value === undefined || value === null ? '' : String(value);
    return `"${stringValue.replace(/"/g, '""')}"`;
  };

  const buildApplicationsCsv = (applications: ProgrammeApplicationItem[]) => {
    const headers = [
      'Applicant Name',
      'Programme',
      'Email',
      'Phone Number',
      'Submission Date',
      'Status',
      'Business Name',
      'Registration Number',
      'Industry',
      'Motivation',
    ];

    const rows = applications.map((application) => [
      application.applicantName,
      application.programme,
      application.email,
      application.phoneNumber,
      application.submissionDate,
      application.status,
      application.businessName,
      application.registrationNumber,
      application.industry,
      application.motivation,
    ]);

    return [headers.join(','), ...rows.map((row) => row.map(escapeCsvValue).join(','))].join('\r\n');
  };

  const escapeHtml = (value: unknown) => {
    const stringValue = value === undefined || value === null ? '' : String(value);
    return stringValue
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const buildApplicationsExcel = (applications: ProgrammeApplicationItem[]) => {
    const headers = [
      'Applicant Name',
      'Programme',
      'Email',
      'Phone Number',
      'Submission Date',
      'Status',
      'Business Name',
      'Registration Number',
      'Industry',
      'Motivation',
    ];

    const rows = applications
      .map(
        (application) =>
          `<tr>${[
            application.applicantName,
            application.programme,
            application.email,
            application.phoneNumber,
            application.submissionDate,
            application.status,
            application.businessName,
            application.registrationNumber,
            application.industry,
            application.motivation,
          ]
            .map((cell) => `<td>${escapeHtml(cell)}</td>`)
            .join('')}</tr>`,
      )
      .join('');

    return `<!DOCTYPE html><html><head><meta charset="UTF-8" /></head><body><table><thead><tr>${headers
      .map((header) => `<th>${escapeHtml(header)}</th>`)
      .join('')}</tr></thead><tbody>${rows}</tbody></table></body></html>`;
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    const csv = buildApplicationsCsv(filteredApplications);
    downloadFile(csv, 'programme-applications.csv', 'text/csv;charset=utf-8');
  };

  const handleExportExcel = () => {
    const excel = buildApplicationsExcel(filteredApplications);
    downloadFile(excel, 'programme-applications.xls', 'application/vnd.ms-excel');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Programme Applications</h1>
          <p className="mt-2 text-sm text-slate-600">Review applications submitted for business development programmes.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-gray-50"
          >
            <ArrowDown className="h-4 w-4" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            <FileText className="h-4 w-4" />
            Export Excel
          </button>
        </div>
      </div>

      <ProgrammeApplicationFilters
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        programmeFilter={programmeFilter}
        onProgrammeFilterChange={setProgrammeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        programmes={programmes}
      />

      <ProgrammeApplicationsTable
        applications={filteredApplications}
        loading={loading}
        onView={(application) => setSelectedApplication(application)}
      />

      {selectedApplication && (
        <ViewProgrammeApplicationModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onSave={handleSaveApplication}
        />
      )}
    </div>
  );
};

export default ProgrammeApplicationsPage;
