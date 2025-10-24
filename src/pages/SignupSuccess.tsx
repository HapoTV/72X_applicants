import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.svg';

const SignupSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [reference, setReference] = useState<string>('');

  useEffect(() => {
    const ref = localStorage.getItem('lastGeneratedReference') || localStorage.getItem('businessReference') || '';
    setReference(ref);
  }, []);

  const copyRef = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      alert('Reference number copied');
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = reference;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      alert('Reference number copied');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <img src={Logo} alt="SeventyTwoX Logo" className="w-20 h-20" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">You have signed up</h1>
        <p className="text-gray-700 mb-4">Check your email to verify your account.</p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <div className="text-sm text-gray-600 mb-1">Your reference number</div>
          <div className="text-2xl font-mono font-semibold text-gray-900">{reference || '—'}</div>
          <p className="text-xs text-gray-600 mt-2">Make sure to copy your reference number before closing this page.</p>
          <div className="mt-3 flex justify-center gap-2">
            <button
              onClick={copyRef}
              disabled={!reference}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
            >
              Copy reference
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Go to login
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-700">
          Use the email you signed up with, your reference number above, and the password you created to log in.
        </div>
      </div>
    </div>
  );
};

export default SignupSuccess;
