export type ProgrammeStatus = 'Open' | 'Closed' | 'Coming Soon';

export interface ProgrammeListItem {
  id: string;
  programmeName: string;
  partner: string;
  province: string;
  duration: string;
  applications: number;
  status: ProgrammeStatus;
  createdDate: string;
  cityRegion?: string;
  maximumParticipants?: string;
  programmeCategory?: string;
  shortDescription?: string;
  fullDescription?: string;
  objectives?: string;
  benefits?: string;
  eligibility?: string;
  whatParticipantsWillLearn?: string;
  documentsRequired?: string;
  applicationsOpenDate?: string;
  applicationsCloseDate?: string;
  programmeStartDate?: string;
  programmeEndDate?: string;
  bannerImagePreview?: string;
  thumbnailImagePreview?: string;
}

export interface ProgrammeFormData {
  programmeName: string;
  partnerName: string;
  shortDescription: string;
  fullDescription: string;
  duration: string;
  province: string;
  cityRegion: string;
  maximumParticipants: string;
  programmeCategory: string;
  objectives: string;
  benefits: string;
  eligibility: string;
  whatParticipantsWillLearn: string;
  documentsRequired: string;
  applicationsOpenDate: string;
  applicationsCloseDate: string;
  programmeStartDate: string;
  programmeEndDate: string;
  status: ProgrammeStatus;
  bannerImagePreview?: string;
  thumbnailImagePreview?: string;
}

export type ApplicationStatus = 'Under Review' | 'Shortlisted' | 'Not selected';

export interface ProgrammeApplicationDocument {
  id: string;
  label: string;
  fileName: string;
  fileUrl?: string;
}

export interface ProgrammeApplicationItem {
  id: string;
  applicantName: string;
  programme: string;
  email: string;
  phoneNumber: string;
  submissionDate: string;
  status: ApplicationStatus;
  businessName: string;
  registrationNumber: string;
  industry: string;
  motivation: string;
  documents: ProgrammeApplicationDocument[];
}
