import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.svg';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    businessName: '',
    hasBankReference: false,
    businessReference: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    plan: 'startup' as 'startup' | 'essential' | 'premium',
  });
  const [isLoading, setIsLoading] = useState(false);
  const update = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.acceptTerms) return alert('Please accept the terms to continue.');
    if (!form.companyName.trim()) return alert('Please enter your business name.');
    if (!form.phone.trim()) return alert('Please enter your contact number.');
    if (form.password !== form.confirmPassword) return alert('Passwords do not match.');
    setIsLoading(true);
    try {
      // Generate a business reference like 72XXXXX
      const ref = '72' + Math.floor(10000 + Math.random() * 90000).toString();
      localStorage.setItem('userEmail', form.email);
      localStorage.setItem('userFirstName', form.firstName);
      localStorage.setItem('userPhone', form.phone);
      localStorage.setItem('companyName', form.companyName);
      localStorage.setItem('businessReference', ref);
      localStorage.setItem('lastGeneratedReference', ref);
      localStorage.setItem('authToken', `user-token-${Date.now()}`);
      localStorage.setItem('userType', 'user');
      localStorage.setItem('userPackage', form.plan);
      // Show success page with reference and verification instructions
      navigate('/signup/success');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center mb-6">
          <img src={Logo} alt="SeventyTwoX Logo" className="w-28 h-28 mx-auto" />
          <h1 className="text-xl font-semibold text-gray-900 mt-2">Create your account</h1>
          <p className="text-gray-600 text-sm">Start your growth journey with 72X</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
        value={form.firstName}
            onChange={e => {
        const value = e.target.value;
                // Allow only letters and spaces
          if (/^[A-Za-z\s]*$/.test(value)) {
          update('firstName', value);
          }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
          />
        </div>

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                value={form.lastName}
                  onChange={e => {
                    const value = e.target.value;

                  // Allow only letters and spaces
                      if (/^[A-Za-z\s]*$/.test(value)) {
                        update('lastName', value);
                }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                />
              </div>

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input type="email" value={form.email} onChange={e => update('email', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" required />
          </div>

            <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
          <input
          value={form.phone}
            onChange={e => {
              const value = e.target.value;

                // Allow digits and spaces only
                if (/^[0-9\s]*$/.test(value)) {
                update("phone", value);
              }
            }}
            placeholder="e.g. 082 123 4567"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
            />
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input
                value={form.companyName}
                  onChange={e => {
                    const value = e.target.value;

                      // Allow only letters and spaces
              if (/^[A-Za-z\s]*$/.test(value)) {
              update('companyName', value);
                }
              }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                    />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Do you have a business reference from your bank?</label>
            <div className="flex items-center gap-6 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="bankRef"
                  checked={form.hasBankReference === true}
                  onChange={() => update('hasBankReference', true)}
                  className="w-4 h-4 text-primary-600 border-gray-300"
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="bankRef"
                  checked={form.hasBankReference === false}
                  onChange={() => { update('hasBankReference', false); update('businessReference', ''); }}
                  className="w-4 h-4 text-primary-600 border-gray-300"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
            </div>

            {form.hasBankReference && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">If yes, please provide your business reference number</label>
                <input
                  value={form.businessReference}
                  onChange={e => update('businessReference', e.target.value)}
                  placeholder="Business Reference Number"
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-primary-100 text-primary-700">🎁</span>
              <h3 className="text-sm font-semibold text-gray-900">Select Your Package</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[{
                key: 'startup', title: 'Start-Up', price: 'R0', perks: ['Basic tools','Email support','Community access']
              },{
                key: 'essential', title: 'Essential', price: 'R299', badge: 'Popular', perks: ['All Start-Up features','Advanced analytics','AI business advisor']
              },{
                key: 'premium', title: 'Premium', price: 'R999', perks: ['All Essential features','Dedicated support','Advanced AI tools']
              }].map((pkg) => (
                <button
                  type="button"
                  key={pkg.key}
                  onClick={() => update('plan', pkg.key)}
                  className={`text-left rounded-xl border p-4 transition-all ${form.plan === pkg.key ? 'border-primary-500 ring-2 ring-primary-200 bg-white' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-base font-semibold text-gray-900">{pkg.title}</div>
                      <div className="text-2xl font-bold text-gray-900">{pkg.price}<span className="text-sm font-normal text-gray-600">/month</span></div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border mt-1 ${form.plan === pkg.key ? 'border-primary-500 bg-primary-500' : 'border-gray-300'}`}></div>
                  </div>
                  {pkg.badge && (
                    <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-primary-600 text-white">{pkg.badge}</span>
                  )}
                  <ul className="mt-3 space-y-1 text-sm text-gray-700">
                    {pkg.perks.map((p) => (
                      <li key={p} className="flex items-center gap-2"><span className="text-green-500">✓</span>{p}</li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input type="password" value={form.password} onChange={e => update('password', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" required />
            </div>
          </div>

          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={form.acceptTerms} onChange={e => update('acceptTerms', e.target.checked)} className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
            <span className="text-sm text-gray-600">I agree to the Terms and Privacy Policy</span>
          </label>

          <button type="submit" disabled={isLoading} className="w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="text-center mt-4">
          <button onClick={() => navigate('/login')} className="text-sm text-primary-600 hover:text-primary-700">Already have an account? Sign in</button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
