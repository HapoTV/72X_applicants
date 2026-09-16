import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';
import AuthWebLayout from '../components/AuthWebLayout';

const inputClass =
  'w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#29ABE2] focus:border-transparent transition-all bg-white';

const labelClass = 'block text-sm font-medium text-gray-800 mb-1.5';

const ResetPasswordRequest: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [businessRef, setBusinessRef] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [canResend, setCanResend] = useState(true);
    const [cooldown, setCooldown] = useState(0);

    // Cooldown timer to prevent rapid retries
    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [cooldown]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) {
            alert('Please enter your email');
            return;
        }
        if (!canResend) {
            alert(`Please wait ${cooldown} seconds before requesting again.`);
            return;
        }

        setIsLoading(true);
        setCanResend(false);
        setCooldown(30);

        try {
            const trimmedEmail = email.trim();
            await authService.requestPasswordReset(trimmedEmail);
            alert(
                `Reset password email sent to ${trimmedEmail}. Please check your inbox (and spam/junk folder). If you don't receive it within 5 minutes, try again or contact support.`
            );
        } catch (err) {
            console.error('❌ Unexpected error:', err);
            alert(
                err instanceof Error ? err.message : 'Failed to send reset password email. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthWebLayout
            title="Forgot password"
            subtitle="Enter your account email to receive a reset password."
            headerAlign="left"
            hideFooterLink
        >
            <form onSubmit={onSubmit} className="space-y-4">
                {/* Email */}
                <div>
                    <label className={labelClass}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={inputClass}
                        placeholder="you@example.com"
                        disabled={isLoading}
                    />
                </div>

                {/* Business Reference (optional) */}
                <div>
                    <label className={labelClass}>
                        Business Reference{' '}
                        <span className="font-bold">(optional)</span>
                    </label>
                    <input
                        type="text"
                        value={businessRef}
                        onChange={(e) => setBusinessRef(e.target.value)}
                        className={inputClass}
                        placeholder="Optional"
                        disabled={isLoading}
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading || !canResend}
                    className="w-full mt-1 py-3.5 bg-[#29ABE2] hover:bg-[#1e98cc] text-white rounded-full font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-sm"
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Sending...
                        </>
                    ) : !canResend ? (
                        `Please wait ${cooldown}s`
                    ) : (
                        'Send reset password email'
                    )}
                </button>
            </form>

            {/* Footer link */}
            <p className="mt-5 text-sm text-gray-500">
                Remembered your password?{' '}
                <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-[#29ABE2] font-semibold hover:underline"
                >
                    Sign in
                </button>
            </p>
        </AuthWebLayout>
    );
};

export default ResetPasswordRequest;