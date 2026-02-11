import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.svg';
import { supabase } from '../lib/supabaseClient';

const SignupSuccessProvided: React.FC = () => {
  const navigate = useNavigate();
  const reference = localStorage.getItem('businessReference') || '';
  const email = localStorage.getItem('userEmail') || '';

  const [sending, setSending] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [isVerified, setIsVerified] = React.useState<boolean>(false);

  React.useEffect(() => {
    const exchangeSessionIfPresent = async () => {
      try {
        if (!supabase) return;

        const url = new URL(window.location.href);
        const hasCodeParam = url.searchParams.has('code');
        const hasAccessTokenInHash = window.location.hash.includes('access_token=');

        if (hasCodeParam && typeof (supabase.auth as any).exchangeCodeForSession === 'function') {
          await (supabase.auth as any).exchangeCodeForSession(window.location.href);
        } else if (hasAccessTokenInHash && typeof (supabase.auth as any).getSessionFromUrl === 'function') {
          await (supabase.auth as any).getSessionFromUrl({ storeSession: true });
        }
      } catch {
        // no-op
      }
    };

    exchangeSessionIfPresent();
  }, []);

  React.useEffect(() => {
    let intervalId: number | undefined;
    let timeoutId: number | undefined;

    const checkVerified = async () => {
      try {
        if (!supabase) return;
        const { data, error } = await supabase.auth.getUser();
        if (error) return;
        const confirmed = !!data.user?.email_confirmed_at;
        if (confirmed) {
          setIsVerified(true);
          localStorage.setItem('emailVerified', 'true');
          if (intervalId) window.clearInterval(intervalId);
          if (timeoutId) window.clearTimeout(timeoutId);
        }
      } catch {
        // no-op
      }
    };

    checkVerified();

    // Re-check briefly in the background to unlock the button after email confirmation
    intervalId = window.setInterval(checkVerified, 8000);
    timeoutId = window.setTimeout(() => {
      if (intervalId) window.clearInterval(intervalId);
    }, 2 * 60 * 1000);

    return () => {
      if (intervalId) window.clearInterval(intervalId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  React.useEffect(() => {
    const rateLimited = localStorage.getItem('supabaseEmailRateLimited') === 'true';
    if (rateLimited) {
      setMessage('We could not send the verification email right now due to email rate limits. Please wait a few minutes, then click “Resend verification email”.');
      localStorage.removeItem('supabaseEmailRateLimited');
    }
  }, []);

  const resendVerification = async () => {
    if (!supabase) {
      setMessage('Verification service unavailable. Please try again later.');
      return;
    }
    setSending(true);
    setMessage(null);
    try {
      let effectiveEmail = email;
      if (!effectiveEmail) {
        const { data, error } = await supabase.auth.getUser();
        if (!error) {
          effectiveEmail = data.user?.email || '';
        }
      }

      if (!effectiveEmail) {
        setMessage('Email address not found. Please return to signup.');
        return;
      }

      const emailRedirectTo = `${window.location.origin}/signup/success/provided`;
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: effectiveEmail,
        options: { emailRedirectTo }
      });
      if (error) throw error;
      setMessage('Verification email sent. Please check your inbox (and spam).');
    } catch (err: any) {
      setMessage(err?.message || 'Failed to send verification email. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="flex items-center justify-center mb-6">
          <img src={Logo} alt="SeventyTwoX Logo" className="w-36 h-36" />
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
          Thank you for creating your account!
        </h1>
        <p className="text-gray-700 mb-6">
          Please check your email to verify your account and complete your sign-up.
        </p>

        <div className="text-left mx-auto max-w-xl mb-6">
          <p className="text-gray-800 font-medium mb-2">Once your email is verified, you’ll be able to:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Choose the package you want</li>
            <li>Continue to login</li>
            <li>Access your account</li>
          </ul>
          <p className="text-gray-700 mt-4">
            An email with all important details about your account will be sent to you for your records.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6">
          <div className="text-sm text-gray-600 mb-1">Your reference number</div>
          <div className="text-3xl font-mono font-semibold text-gray-900">{reference || '—'}</div>
          <p className="text-xs text-gray-600 mt-3">
            Note down this reference number; it cannot be changed and will be required for logging in.
          </p>
          <p className="text-xs text-gray-600 mt-2">
            If you don’t see the verification email in your inbox, please check your Spam/Junk folder.
          </p>
        </div>

        {message && (
          <div className="text-sm text-gray-700 mb-3" role="status">{message}</div>
        )}
        <div className="flex justify-center gap-2 mb-4">
          <button
            type="button"
            onClick={resendVerification}
            disabled={sending}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {sending ? 'Sending...' : 'Resend verification email'}
          </button>
        </div>

        <div className="mt-2 flex justify-center">
          <div className="relative inline-block group">
            <button
              onClick={() => {
                if (!isVerified) return;
                navigate('/login');
              }}
              disabled={!isVerified}
              className={`px-5 py-2.5 rounded-lg transition-colors ${
                isVerified
                  ? 'bg-primary-500 text-white hover:bg-primary-600'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue to login
            </button>

            {!isVerified && (
              <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-3 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-md shadow-lg whitespace-nowrap">
                  Please verify your email to continue.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupSuccessProvided;