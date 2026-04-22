import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.svg';
import { supabase } from '../lib/supabaseClient';

const getPublicSiteUrl = (): string => {
  const fromEnv = (import.meta as any)?.env?.VITE_PUBLIC_SITE_URL as string | undefined;
  const trimmed = (fromEnv || '').trim();
  if (trimmed) return trimmed.replace(/\/$/, '');
  const base = ((import.meta as any)?.env?.BASE_URL as string | undefined) || '/';
  const normalizedBase = String(base).trim() || '/';
  const baseNoTrailingSlash = normalizedBase.replace(/\/$/, '');
  const origin = window.location.origin.replace(/\/$/, '');
  return baseNoTrailingSlash && baseNoTrailingSlash !== '/' ? `${origin}${baseNoTrailingSlash}` : origin;
};

const SignupSuccessGenerated: React.FC = () => {
  const navigate = useNavigate();
  const reference = localStorage.getItem('lastGeneratedReference') || localStorage.getItem('businessReference') || '';
  const email = localStorage.getItem('userEmail') || '';

  const [sending, setSending] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [isVerified, setIsVerified] = React.useState<boolean>(false);

  React.useEffect(() => {
    const rateLimited = localStorage.getItem('supabaseEmailRateLimited') === 'true';
    if (rateLimited) {
      setMessage('We could not send the verification email right now due to email rate limits. Please wait a few minutes, then click “Resend verification email”.');
      localStorage.removeItem('supabaseEmailRateLimited');
    }
  }, []);

  React.useEffect(() => {
    const failed = localStorage.getItem('supabaseVerificationEmailFailed') === 'true';
    if (failed) {
      setMessage('We could not confirm that the verification email was sent. Please click “Resend verification email”.');
      localStorage.removeItem('supabaseVerificationEmailFailed');
    }
  }, []);

  React.useEffect(() => {
    const exchangeSessionIfPresent = async () => {
      try {
        if (!supabase) return;

        const url = new URL(window.location.href);
        const hasCodeParam = url.searchParams.has('code');
        const tokenHash = url.searchParams.get('token_hash');
        const typeParam = url.searchParams.get('type');
        const hasAccessTokenInHash = window.location.hash.includes('access_token=');

        if (hasCodeParam && typeof (supabase.auth as any).exchangeCodeForSession === 'function') {
          await (supabase.auth as any).exchangeCodeForSession(window.location.href);
        } else if (tokenHash && typeParam && typeof (supabase.auth as any).verifyOtp === 'function') {
          await (supabase.auth as any).verifyOtp({ type: typeParam, token_hash: tokenHash });
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

        const currentUserEmail = data.user?.email?.trim().toLowerCase() || '';
        const expectedEmail = email.trim().toLowerCase();
        if (expectedEmail && currentUserEmail !== expectedEmail) return;

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
    intervalId = window.setInterval(checkVerified, 8000);
    timeoutId = window.setTimeout(() => {
      if (intervalId) window.clearInterval(intervalId);
    }, 2 * 60 * 1000);

    return () => {
      if (intervalId) window.clearInterval(intervalId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  const resendVerification = async () => {
    if (!supabase) {
      setMessage('Verification service unavailable. Please try again later.');
      return;
    }
    setSending(true);
    setMessage(null);
    try {
      let effectiveEmail = email.trim();
      if (!effectiveEmail) {
        const { data, error } = await supabase.auth.getUser();
        if (!error) {
          effectiveEmail = data.user?.email?.trim() || '';
        }
      }

      const expectedEmail = email.trim().toLowerCase();
      if (expectedEmail && effectiveEmail && effectiveEmail.toLowerCase() !== expectedEmail) {
        setMessage('Unable to resend verification email because the current authenticated session does not match the signup email.');
        return;
      }

      if (!effectiveEmail) {
        setMessage('Email address not found. Please return to signup.');
        return;
      }

      const emailRedirectTo = `${getPublicSiteUrl()}/signup/success/generated`;
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: effectiveEmail,
        options: { emailRedirectTo }
      });
      if (error) throw error;
      setMessage('Verification email request submitted. Please check your inbox (and spam).');
    } catch (err: any) {
      setMessage(err?.message || 'Failed to send verification email. Please try again.');
    } finally {
      setSending(false);
    }
  };

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

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
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
          </div>
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
              onClick={() => navigate('/login')}
              disabled={!isVerified || sending}
              className={`px-5 py-2.5 rounded-lg transition-colors ${
                isVerified
                  ? 'bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {sending ? 'Processing...' : 'Continue to login'}
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

        <div className="text-sm text-gray-700 mt-4">
          Use the email you signed up with, your reference number above, and the password you created to log in.
        </div>
      </div>
    </div>
  );
};

export default SignupSuccessGenerated;
