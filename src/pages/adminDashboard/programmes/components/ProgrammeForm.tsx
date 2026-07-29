import { useMemo, useState } from 'react';
import type { ProgrammeFormData } from '../types';

interface ProgrammeFormProps {
  formData: ProgrammeFormData;
  onFormChange: (data: ProgrammeFormData) => void;
  onImageChange: (field: 'bannerImagePreview' | 'thumbnailImagePreview', file: File | null) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const provinces = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape',
] as const;

const citiesByProvince: Record<string, string[]> = {
  'Eastern Cape': ['Port Elizabeth', 'East London', 'Mthatha', 'Uitenhage', 'Jeffreys Bay'],
  'Free State': ['Bloemfontein', 'Bethlehem', 'Welkom', 'Kroonstad'],
  Gauteng: ['Johannesburg', 'Pretoria', 'Soweto', 'Midrand', 'Centurion'],
  'KwaZulu-Natal': ['Durban', 'Pietermaritzburg', 'Newcastle', 'Richards Bay', 'Umhlanga'],
  Limpopo: ['Polokwane', 'Tzaneen', 'Thohoyandou', 'Louis Trichardt'],
  Mpumalanga: ['Nelspruit', 'Secunda', 'Witbank', 'White River'],
  'Northern Cape': ['Kimberley', 'Upington', 'Springbok', 'De Aar'],
  'North West': ['Rustenburg', 'Mahikeng', 'Potchefstroom', 'Klerksdorp'],
  'Western Cape': ['Cape Town', 'Stellenbosch', 'Paarl', 'George', 'Worcester'],
};

const statusOptions = ['Open', 'Closed', 'Coming Soon'] as const;

export function ProgrammeForm({ formData, onFormChange, onSubmit, onCancel }: ProgrammeFormProps) {
  const [provinceQuery, setProvinceQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [showProvinceOptions, setShowProvinceOptions] = useState(false);
  const [showCityOptions, setShowCityOptions] = useState(false);

  const provinceOptions = useMemo(() => {
    const query = provinceQuery.trim().toLowerCase();
    return provinces.filter((province) => province.toLowerCase().includes(query));
  }, [provinceQuery]);

  const cityOptions = useMemo(() => {
    const provinceList = citiesByProvince[formData.province] || [];
    const query = cityQuery.trim().toLowerCase();
    if (!query) return provinceList;
    return provinceList.filter((city) => city.toLowerCase().includes(query));
  }, [cityQuery, formData.province]);

  const provinceInputValue = provinceQuery !== '' ? provinceQuery : formData.province;
  const cityInputValue = cityQuery !== '' ? cityQuery : formData.cityRegion;

  return (
    <div className="space-y-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <section className="space-y-4 rounded-3xl border border-gray-200 bg-slate-50 p-6">
        <h2 className="text-xl font-semibold text-slate-900">Basic Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            <span>Programme Name</span>
            <input
              type="text"
              value={formData.programmeName}
              onChange={(e) => onFormChange({ ...formData, programmeName: e.target.value })}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Partner Name</span>
            <input
              type="text"
              value={formData.partnerName}
              onChange={(e) => onFormChange({ ...formData, partnerName: e.target.value })}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-700 sm:col-span-2">
            <span>Short Description</span>
            <textarea
              value={formData.shortDescription}
              onChange={(e) => onFormChange({ ...formData, shortDescription: e.target.value })}
              rows={3}
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-700 sm:col-span-2">
            <span>Full Description</span>
            <textarea
              value={formData.fullDescription}
              onChange={(e) => onFormChange({ ...formData, fullDescription: e.target.value })}
              rows={5}
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </label>
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-gray-200 bg-slate-50 p-6">
        <h2 className="text-xl font-semibold text-slate-900">Programme Details</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <label className="space-y-2 text-sm text-slate-700">
            <span>Programme Duration</span>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => onFormChange({ ...formData, duration: e.target.value })}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-700 relative">
            <span>Province</span>
            <input
              type="text"
              value={provinceInputValue}
              onChange={(e) => {
                const value = e.target.value;
                setProvinceQuery(value);
                setShowProvinceOptions(true);
                onFormChange({ ...formData, province: value });
              }}
              onFocus={() => setShowProvinceOptions(true)}
              onBlur={() => setTimeout(() => setShowProvinceOptions(false), 150)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              placeholder="Search or select province"
            />
            {provinceOptions.length > 0 && showProvinceOptions ? (
              <div className="absolute z-10 mt-2 max-h-56 w-full overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-lg">
                {provinceOptions.map((province) => (
                  <button
                    key={province}
                    type="button"
                    onClick={() => {
                      setProvinceQuery(province);
                      setCityQuery('');
                      setShowProvinceOptions(false);
                      onFormChange({ ...formData, province, cityRegion: '' });
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-primary-50"
                  >
                    {province}
                  </button>
                ))}
              </div>
            ) : null}
          </label>
          <label className="space-y-2 text-sm text-slate-700 relative">
            <span>City / Region</span>
            <input
              type="text"
              value={cityInputValue}
              onChange={(e) => {
                const value = e.target.value;
                setCityQuery(value);
                setShowCityOptions(true);
                onFormChange({ ...formData, cityRegion: value });
              }}
              onFocus={() => setShowCityOptions(true)}
              onBlur={() => setTimeout(() => setShowCityOptions(false), 150)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              placeholder="Start typing to search or add new city"
            />
            <p className="text-xs text-slate-500">If your city is not listed, type it in directly.</p>
            {cityOptions.length > 0 && showCityOptions ? (
              <div className="absolute z-10 mt-2 max-h-56 w-full overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-lg">
                {cityOptions.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      setCityQuery(city);
                      setShowCityOptions(false);
                      onFormChange({ ...formData, cityRegion: city });
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-primary-50"
                  >
                    {city}
                  </button>
                ))}
              </div>
            ) : null}
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Maximum Participants</span>
            <input
              type="number"
              value={formData.maximumParticipants}
              onChange={(e) => onFormChange({ ...formData, maximumParticipants: e.target.value })}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Programme Category</span>
            <input
              type="text"
              value={formData.programmeCategory}
              onChange={(e) => onFormChange({ ...formData, programmeCategory: e.target.value })}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </label>
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-gray-200 bg-slate-50 p-6">
        <h2 className="text-xl font-semibold text-slate-900">Programme Information</h2>
        <div className="grid gap-4">
          <label className="space-y-2 text-sm text-slate-700">
            <span>Programme Objectives</span>
            <textarea
              value={formData.objectives}
              onChange={(e) => onFormChange({ ...formData, objectives: e.target.value })}
              rows={3}
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Benefits</span>
            <textarea
              value={formData.benefits}
              onChange={(e) => onFormChange({ ...formData, benefits: e.target.value })}
              rows={3}
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Eligibility / Requirements</span>
            <textarea
              value={formData.eligibility}
              onChange={(e) => onFormChange({ ...formData, eligibility: e.target.value })}
              rows={3}
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>What Participants Will Learn</span>
            <textarea
              value={formData.whatParticipantsWillLearn}
              onChange={(e) => onFormChange({ ...formData, whatParticipantsWillLearn: e.target.value })}
              rows={3}
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Documents Required for Application</span>
            <textarea
              value={formData.documentsRequired}
              onChange={(e) => onFormChange({ ...formData, documentsRequired: e.target.value })}
              rows={3}
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </label>
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-gray-200 bg-slate-50 p-6">
        <h2 className="text-xl font-semibold text-slate-900">Important Dates</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-2 text-sm text-slate-700">
            <span>Applications Open Date</span>
            <input
              type="date"
              value={formData.applicationsOpenDate}
              onChange={(e) => onFormChange({ ...formData, applicationsOpenDate: e.target.value })}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Applications Close Date</span>
            <input
              type="date"
              value={formData.applicationsCloseDate}
              onChange={(e) => onFormChange({ ...formData, applicationsCloseDate: e.target.value })}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Programme Start Date</span>
            <input
              type="date"
              value={formData.programmeStartDate}
              onChange={(e) => onFormChange({ ...formData, programmeStartDate: e.target.value })}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Programme End Date</span>
            <input
              type="date"
              value={formData.programmeEndDate}
              onChange={(e) => onFormChange({ ...formData, programmeEndDate: e.target.value })}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </label>
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-gray-200 bg-slate-50 p-6">
        <h2 className="text-xl font-semibold text-slate-900">Media</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-4">
            <label className="group block rounded-3xl border border-dashed border-gray-300 bg-white p-6 text-center transition hover:border-primary-500 hover:bg-primary-50">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                <span className="text-2xl font-semibold">+</span>
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-900">Banner Image</p>
              <p className="mt-2 text-sm text-slate-500">Drag & drop or click to select an image.</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onImageChange('bannerImagePreview', e.target.files?.[0] ?? null)}
                className="sr-only"
              />
            </label>
            {formData.bannerImagePreview ? (
              <img src={formData.bannerImagePreview} alt="Banner preview" className="h-44 w-full rounded-3xl object-cover" />
            ) : null}
          </div>

          <div className="space-y-4">
            <label className="group block rounded-3xl border border-dashed border-gray-300 bg-white p-6 text-center transition hover:border-primary-500 hover:bg-primary-50">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                <span className="text-2xl font-semibold">+</span>
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-900">Programme Thumbnail</p>
              <p className="mt-2 text-sm text-slate-500">Optional image preview for the programme card.</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onImageChange('thumbnailImagePreview', e.target.files?.[0] ?? null)}
                className="sr-only"
              />
            </label>
            {formData.thumbnailImagePreview ? (
              <img src={formData.thumbnailImagePreview} alt="Thumbnail preview" className="h-44 w-full rounded-3xl object-cover" />
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-slate-50 p-6">
        <h2 className="text-xl font-semibold text-slate-900">Status</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {statusOptions.map((option) => (
            <label
              key={option}
              className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition ${formData.status === option ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-300 bg-white text-slate-600 hover:border-gray-400'}`}
            >
              <input
                type="radio"
                name="programme-status"
                value={option}
                checked={formData.status === option}
                onChange={() => onFormChange({ ...formData, status: option })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              {option}
            </label>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-gray-50 sm:w-auto"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="w-full rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 sm:w-auto"
        >
          Save Programme
        </button>
      </div>
    </div>
  );
}
