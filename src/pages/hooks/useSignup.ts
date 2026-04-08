// src/pages/hooks/useSignup.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/AuthService';
import OrganisationService from '../../services/OrganisationService';
import type { CreateUserRequest } from '../../interfaces/UserData';

export interface SignupFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  industry: string;
  location: string;
  founded: string;
  employees: string;
  hasBankReference: boolean;
  businessReference: string;
  organisation: string;
  acceptTerms: boolean;
}

export function useSignup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (form: SignupFormState): boolean => {
    setError(null);
    if (!form.firstName.trim()) { setError('First name is required'); return false; }
    if (!form.lastName.trim()) { setError('Last name is required'); return false; }
    if (!form.email.trim()) { setError('Email is required'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('Please enter a valid email address'); return false; }
    if (!form.phone.trim()) { setError('Contact number is required'); return false; }
    if (form.phone.replace(/[^0-9]/g, '').length < 10) { setError('Please enter a valid contact number'); return false; }
    if (!form.companyName.trim()) { setError('Company name is required'); return false; }
    if (!form.industry.trim()) { setError('Industry is required'); return false; }
    if (!form.location.trim()) { setError('Location is required'); return false; }
    if (!form.founded.trim()) { setError('Year founded is required'); return false; }
    const currentYear = new Date().getFullYear();
    const foundedYear = parseInt(form.founded);
    if (isNaN(foundedYear) || foundedYear < 1800 || foundedYear > currentYear) { setError(`Please enter a valid year between 1800 and ${currentYear}`); return false; }
    if (!form.employees.trim()) { setError('Number of employees is required'); return false; }
    if (form.hasBankReference && !form.organisation) { setError('Please select an organisation'); return false; }
    if (!form.acceptTerms) { setError('Please accept the terms and conditions'); return false; }
    return true;
  };

  const submit = async (form: SignupFormState) => {
    if (!validate(form)) return;
    setIsLoading(true);
    try {
      if (form.hasBankReference && form.organisation && form.businessReference) {
        const result = await OrganisationService.validateOrgReference(form.businessReference, form.organisation);
        if (!result.valid) { setError('Invalid business reference for the selected organisation. Please check your details.'); return; }
      } else if (form.hasBankReference && form.organisation && !form.businessReference.trim()) {
        const result = await OrganisationService.validateOrgReference('', form.organisation);
        if (!result.isCocSubOrg) { setError('Business reference is required for the selected organisation.'); return; }
      }

      const userData: CreateUserRequest = {
        fullName: `${form.firstName} ${form.lastName}`,
        email: form.email,
        mobileNumber: form.phone,
        companyName: form.companyName,
        industry: form.industry,
        location: form.location,
        founded: form.founded,
        employees: form.employees,
        hasReference: form.hasBankReference,
        businessReference: form.hasBankReference ? form.businessReference : undefined,
        organisation: form.hasBankReference ? form.organisation : undefined,
        role: 'USER',
        status: 'PENDING_PASSWORD',
      };

      await authService.createUser(userData);
      navigate('/create-password');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, setError, submit };
}
