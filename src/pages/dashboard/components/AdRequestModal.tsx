// src/components/dashboard/components/AdRequestModal.tsx
import React, { useState, useEffect } from 'react';

type Language = 'en' | 'af' | 'zu';

interface AdRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { businessName: string; email: string; phone: string; adLink: string; message: string }) => void;
  language: Language;
}

const AdRequestModal: React.FC<AdRequestModalProps> = ({ isOpen, onClose, onSubmit, language }) => {
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [adLink, setAdLink] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const translations = {
    en: {
      requestAdSpace: "Request Advertising Space",
      businessName: "Business Name",
      email: "Email Address",
      phone: "Phone Number",
      adLink: "Ad Link (More information)",
      noteLabel: "Note:",
      bannerSizeNoteBefore: "Recommended ad banner size:",
      bannerSizeNoteAfter: "(width x height)",
      message: "Tell us about your advertising needs",
      submit: "Send Request",
      cancel: "Cancel",
      required: "This field is required",
      submitting: "Sending..."
    },
    af: {
      requestAdSpace: "Versoek Advertensieruimte",
      businessName: "Besigheidsnaam",
      email: "E-posadres",
      phone: "Telefoonnommer",
      adLink: "Advertensie-skakel (Meer inligting)",
      noteLabel: "Note:",
      bannerSizeNoteBefore: "Aanbevole advertensiebanier-grootte:",
      bannerSizeNoteAfter: "(breedte x hoogte)",
      message: "Vertel ons van u advertensiebehoeftes",
      submit: "Stuur Versoek",
      cancel: "Kanselleer",
      required: "Hierdie veld is verpligtend",
      submitting: "Stuur..."
    },
    zu: {
      requestAdSpace: "Cela Isikhala Sokukhangisa",
      businessName: "Igama Lebhizinisi",
      email: "Ikheli Le-imeyili",
      phone: "Inombolo Yocingo",
      adLink: "Isixhumanisi Sesikhangiso (Ulwazi olwengeziwe)",
      noteLabel: "Note:",
      bannerSizeNoteBefore: "Usayizi oceliwe we-banner yesikhangiso:",
      bannerSizeNoteAfter: "(ububanzi x ukuphakama)",
      message: "Sitshele ngemfuno yakho yokukhangisa",
      submit: "Thumela Isicelo",
      cancel: "Khansela",
      required: "Le nsimu iyadingeka",
      submitting: "Iyathumela..."
    }
  };

  const t = translations[language];

  useEffect(() => {
    if (isOpen) {
      const userEmail = localStorage.getItem('userEmail') || '';
      const fullName = localStorage.getItem('fullName') || '';
      const registrationDataRaw = localStorage.getItem('registrationData') || '';
      const registrationData = (() => {
        try {
          return registrationDataRaw ? JSON.parse(registrationDataRaw) : null;
        } catch {
          return null;
        }
      })();

      const companyNameFromStorage =
        localStorage.getItem('companyName') ||
        localStorage.getItem('businessName') ||
        registrationData?.step2?.businessName ||
        registrationData?.businessName ||
        '';

      const companyName = companyNameFromStorage || fullName.split(' ')[0];
      
      setEmail(userEmail);
      setBusinessName(companyName);
      
      const userPhone = localStorage.getItem('mobileNumber') || '';
      if (userPhone) setPhone(userPhone);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !email || !adLink || !message) {
      alert(t.required);
      return;
    }
    
    setIsSubmitting(true);
    onSubmit({ businessName, email, phone, adLink, message });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.requestAdSpace}</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="text-xs text-gray-600">
                <span className="font-semibold">{t.noteLabel}</span>{' '}
                <span>{t.bannerSizeNoteBefore}</span>{' '}
                <span className="font-semibold">768 x 250</span>{' '}
                <span>{t.bannerSizeNoteAfter}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.businessName} *
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.email} *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.phone}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.adLink} *
                </label>
                <input
                  type="url"
                  value={adLink}
                  onChange={(e) => setAdLink(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="https://..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.message} *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="E.g., I'd like to advertise my business for 1 month, targeting entrepreneurs in Johannesburg..."
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                disabled={isSubmitting}
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? t.submitting : t.submit}
                {isSubmitting && (
                  <svg className="w-4 h-4 ml-2 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdRequestModal;