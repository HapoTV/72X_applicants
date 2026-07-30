import { useEffect, useState } from 'react';
import { toast } from '../../../hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProgrammeForm } from './components/ProgrammeForm';
import { cocProgrammeService } from '../../../services/coc-admin/CocProgrammeService';
import type { ProgrammeFormData, ProgrammeListItem } from './types';

const initialProgrammeForm: ProgrammeFormData = {
  programmeName: '',
  partnerName: '',
  shortDescription: '',
  fullDescription: '',
  duration: '',
  province: '',
  cityRegion: '',
  maximumParticipants: '',
  programmeCategory: '',
  objectives: '',
  benefits: '',
  eligibility: '',
  whatParticipantsWillLearn: '',
  documentsRequired: '',
  applicationsOpenDate: '',
  applicationsCloseDate: '',
  programmeStartDate: '',
  programmeEndDate: '',
  status: 'Coming Soon',
};

const CreateProgrammePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryProgrammeId = searchParams.get('id');
  const stateProgramme = (location.state as { programme?: ProgrammeListItem } | undefined)?.programme;
  const [existingProgramme, setExistingProgramme] = useState<ProgrammeListItem | undefined>(stateProgramme);

  const mapProgrammeToFormData = (programme: ProgrammeListItem): ProgrammeFormData => ({
    programmeName: programme.programmeName,
    partnerName: programme.partner,
    shortDescription: programme.shortDescription ?? '',
    fullDescription: programme.fullDescription ?? '',
    duration: programme.duration,
    province: programme.province,
    cityRegion: programme.cityRegion ?? '',
    maximumParticipants: programme.maximumParticipants ?? '',
    programmeCategory: programme.programmeCategory ?? '',
    objectives: programme.objectives ?? '',
    benefits: programme.benefits ?? '',
    eligibility: programme.eligibility ?? '',
    whatParticipantsWillLearn: programme.whatParticipantsWillLearn ?? '',
    documentsRequired: programme.documentsRequired ?? '',
    applicationsOpenDate: programme.applicationsOpenDate ?? '',
    applicationsCloseDate: programme.applicationsCloseDate ?? '',
    programmeStartDate: programme.programmeStartDate ?? '',
    programmeEndDate: programme.programmeEndDate ?? '',
    status: programme.status,
    bannerImagePreview: programme.bannerImagePreview,
    thumbnailImagePreview: programme.thumbnailImagePreview,
  });

  const mapFormDataToRequest = (data: ProgrammeFormData) => ({
    programmeName: data.programmeName,
    partner: data.partnerName,
    shortDescription: data.shortDescription,
    fullDescription: data.fullDescription,
    duration: data.duration,
    province: data.province,
    cityRegion: data.cityRegion,
    maximumParticipants: data.maximumParticipants,
    programmeCategory: data.programmeCategory,
    objectives: data.objectives,
    benefits: data.benefits,
    eligibility: data.eligibility,
    whatParticipantsWillLearn: data.whatParticipantsWillLearn,
    documentsRequired: data.documentsRequired,
    applicationsOpenDate: data.applicationsOpenDate,
    applicationsCloseDate: data.applicationsCloseDate,
    programmeStartDate: data.programmeStartDate,
    programmeEndDate: data.programmeEndDate,
    status: data.status,
    bannerImagePreview: data.bannerImagePreview,
    thumbnailImagePreview: data.thumbnailImagePreview,
  });

  const [formData, setFormData] = useState<ProgrammeFormData>(
    stateProgramme ? mapProgrammeToFormData(stateProgramme) : initialProgrammeForm,
  );

  useEffect(() => {
    if (!queryProgrammeId || stateProgramme) {
      return;
    }

    const loadProgramme = async () => {
      try {
        const programme = await cocProgrammeService.getProgrammeById(queryProgrammeId);
        setExistingProgramme(programme);
        setFormData(mapProgrammeToFormData(programme));
      } catch (error) {
        console.error('Failed to load programme from service:', error);
      }
    };

    loadProgramme();
  }, [queryProgrammeId, stateProgramme]);

  const [isSaving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (isSaving) return;

    const programmeId = queryProgrammeId || existingProgramme?.id;
    const requestPayload = mapFormDataToRequest(formData);

    if (!programmeId && existingProgramme) {
      console.error('Expected programme ID for update but none was found', existingProgramme);
      toast({ title: 'Save failed', description: 'Unable to resolve programme ID for update.', variant: 'destructive' });
      return;
    }

    setSaving(true);

    try {
      let savedProgramme: ProgrammeListItem | undefined;

      if (existingProgramme || programmeId) {
        const idToUpdate = programmeId as string;
        savedProgramme = await cocProgrammeService.updateProgramme(idToUpdate, requestPayload);
      } else {
        savedProgramme = await cocProgrammeService.createProgramme(requestPayload);
      }

      if (savedProgramme) {
        toast({ title: existingProgramme || queryProgrammeId ? 'Programme information successfully updated' : 'Programme created successfully', description: 'Updates are now available on both admin and user side.' });
      } else {
        toast({ title: 'Programme save failed', description: 'The server did not return a saved programme.', variant: 'destructive' });
      }
    } catch (err) {
      console.error('Failed to save programme through service:', err);
      let serverMessage = '';
      try {
        const e = err as any;
        if (e?.response?.data) {
          serverMessage = typeof e.response.data === 'string' ? e.response.data : (e.response.data.message || JSON.stringify(e.response.data));
        } else {
          serverMessage = e?.message || 'Unknown error';
        }
      } catch {
        serverMessage = 'Unknown error';
      }

      toast({ title: 'Save failed (server)', description: `Failed to save to server: ${serverMessage}.`, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Create Programme</h1>
          <p className="mt-2 text-sm text-slate-600">Enter programme details once to make them ready for public listing.</p>
        </div>
      </div>

      <ProgrammeForm
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/programmes')}
        isSaving={isSaving}
      />
    </div>
  );
};

export default CreateProgrammePage;
