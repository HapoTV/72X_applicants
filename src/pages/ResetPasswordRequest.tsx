import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';

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
setCooldown(30); // 30-second cooldown

try {
const trimmedEmail = email.trim();

await authService.requestPasswordReset(trimmedEmail);

// Success
alert(
`Reset password email sent to ${trimmedEmail}. Please check your inbox (and spam/junk folder). If you don’t receive it within 5 minutes, try again or contact support.`
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
<div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
<div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-6">
<h1 className="text-lg font-semibold mb-2">Forgot password</h1>
<p className="text-sm text-gray-600 mb-4">
Enter your account email to receive a reset password email.
</p>

<form onSubmit={onSubmit} className="space-y-4">
<div>
<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
<input
type="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
required
className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
placeholder="you@example.com"
/>
</div>

<div>
<label className="block text-sm font-medium text-gray-700 mb-1">
Business Reference (optional)
</label>
<input
type="text"
value={businessRef}
onChange={(e) => setBusinessRef(e.target.value)}
className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
placeholder="Optional"
/>
</div>

<button
type="submit"
disabled={isLoading || !canResend}
className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
>
{isLoading
? 'Sending...'
: !canResend
? `Please wait ${cooldown}s`
: 'Send reset password email'}
</button>
</form>

<div className="text-sm text-gray-600 mt-4">
Remembered your password?{' '}
<button
onClick={() => navigate('/login')}
className="text-primary-600 hover:text-primary-700 font-medium"
>
Sign in
</button>
</div>
</div>
</div>
);
};

export default ResetPasswordRequest;