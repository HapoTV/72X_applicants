import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/Logo.svg';

interface AuthWebLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  badgeText?: string;
  maxWidth?: string;
  /** 'center' (default) or 'left' — controls title/subtitle alignment */
  headerAlign?: 'center' | 'left';
  /** When true, the subtitle renders in blue instead of gray */
  subtitleBlue?: boolean;
  /** When true, hides the auto-generated footer sign-in/sign-up link */
  hideFooterLink?: boolean;
}

const AuthWebLayout: React.FC<AuthWebLayoutProps> = ({
  children,
  title,
  subtitle,
  badgeText,
  maxWidth = 'max-w-md',
  headerAlign = 'center',
  subtitleBlue = false,
  hideFooterLink = false,
}) => {
  const location = useLocation();
  const isSignUp = location.pathname === '/signup';
  const isLeft = headerAlign === 'left';

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 sm:p-10 overflow-hidden select-none"
      style={{
        background: 'linear-gradient(160deg, #EEF4FF 0%, #F0F7FF 50%, #E8F4FF 100%)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Cute ambient background glow orbs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#29ABE2]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#60A5FA]/15 blur-3xl" />

      {/* Auth Card */}
      <div
        className={`relative z-10 w-full ${maxWidth} bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-blue-900/5`}
        style={{ padding: '2.5rem 2.5rem 2rem' }}
      >
        {/* Logo — always centered at top */}
        <div className="flex justify-center mb-6">
          <img src={Logo} alt="72X Logo" className="h-14 w-auto object-contain transition-transform hover:scale-105" />
        </div>

        {/* Title & Subtitle */}
        <div className={`${isLeft ? 'text-left mb-5' : 'text-center mb-7'}`}>
          <h1 className={`font-bold text-gray-900 tracking-tight leading-tight ${isLeft ? 'text-xl' : 'text-2xl'}`}>
            {title}
          </h1>
          {subtitle && (
            <p className={`text-sm mt-1.5 leading-relaxed ${subtitleBlue ? 'text-[#29ABE2]' : 'text-gray-500'}`}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Form Content */}
        {children}

        {/* Auto footer link (sign in / sign up) */}
        {!hideFooterLink && (
          <p className="mt-7 text-center text-sm text-gray-500">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <Link to="/login" className="text-[#29ABE2] font-semibold hover:underline">
                  Sign in here
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Link to="/signup" className="text-[#29ABE2] font-semibold hover:underline">
                  Sign up here
                </Link>
              </>
            )}
          </p>
        )}
      </div>

      {/* Bottom tagline */}
      <p className="relative z-10 mt-6 text-xs text-slate-400 font-medium tracking-wide text-center">
        Built for South African Businesses
      </p>
    </div>
  );
};

export default AuthWebLayout;
