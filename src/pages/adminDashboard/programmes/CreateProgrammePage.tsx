import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProgrammeForm } from './components/ProgrammeForm';
import { addOrUpdateProgramme, getProgrammeById } from '../../../data/programmesStore';
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

  const [formData, setFormData] = useState<ProgrammeFormData>(
    stateProgramme ? mapProgrammeToFormData(stateProgramme) : initialProgrammeForm,
  );
  const [loading, setLoading] = useState<boolean>(!stateProgramme && !!queryProgrammeId);

  useEffect(() => {
    if (!queryProgrammeId || stateProgramme) {
      setLoading(false);
      return;
    }

    const loadProgramme = async () => {
      setLoading(true);
      try {
        const programme = await cocProgrammeService.getProgrammeById(queryProgrammeId);
        setExistingProgramme(programme);
        setFormData(mapProgrammeToFormData(programme));
      } catch (error) {
        console.error('Failed to load programme from service:', error);
        const fallbackProgramme = queryProgrammeId ? getProgrammeById(queryProgrammeId) : undefined;
        if (fallbackProgramme) {
          setExistingProgramme(fallbackProgramme);
          setFormData(mapProgrammeToFormData(fallbackProgramme));
        }
      } finally {
        setLoading(false);
      }
    };

    loadProgramme();
  }, [queryProgrammeId, stateProgramme]);

  const handleSubmit = async () => {
    const programmeId = existingProgramme?.id || formData.programmeName.toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '');
    const newProgramme: ProgrammeListItem = {
      id: programmeId,
      programmeName: formData.programmeName,
      partner: formData.partnerName,
      province: formData.province,
      duration: formData.duration,
      applications: existingProgramme?.applications ?? 0,
      status: formData.status,
      createdDate: existingProgramme?.createdDate || new Date().toISOString().slice(0, 10),
      cityRegion: formData.cityRegion,
      maximumParticipants: formData.maximumParticipants,
      programmeCategory: formData.programmeCategory,
      shortDescription: formData.shortDescription,
      fullDescription: formData.fullDescription,
      objectives: formData.objectives,
      benefits: formData.benefits,
      eligibility: formData.eligibility,
      whatParticipantsWillLearn: formData.whatParticipantsWillLearn,
      documentsRequired: formData.documentsRequired,
      applicationsOpenDate: formData.applicationsOpenDate,
      applicationsCloseDate: formData.applicationsCloseDate,
      programmeStartDate: formData.programmeStartDate,
      programmeEndDate: formData.programmeEndDate,
      bannerImagePreview: formData.bannerImagePreview,
      thumbnailImagePreview: formData.thumbnailImagePreview,
    };

    try {
      if (existingProgramme) {
        await cocProgrammeService.updateProgramme(programmeId, formData);
      } else {
        await cocProgrammeService.createProgramme(formData);
      }
      window.alert('Programme saved successfully. Updates will now be available on both admin and user side.');
    } catch (error) {
      console.error('Failed to save programme through service:', error);
      addOrUpdateProgramme(newProgramme);
      window.alert('Programme saved locally. It will sync when the backend is available.');
    }

    navigate('/admin/programmes');
  };

  const handleImagePreview = (field: 'bannerImagePreview' | 'thumbnailImagePreview', file: File | null) => {
    if (!file) {
      setFormData((current) => ({ ...current, [field]: undefined }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((current) => ({ ...current, [field]: reader.result as string }));
    };
    reader.readAsDataURL(file);
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
        onImageChange={handleImagePreview}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/programmes')}
      />
    </div>
  );
};

export default CreateProgrammePage;
