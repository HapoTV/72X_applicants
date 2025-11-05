import React from "react";
import { useNavigate } from "react-router-dom";
import logoSvg from "../assets/Logo.svg";

const RequestDemo: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      {/* Header */}
      <header className="bg-[#F5F7FA] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-12">
              <img
                src={logoSvg}
                alt="72X Logo"
                className="h-14 md:h-16 w-auto"
              />
              
              {/* Navigation */}
              <nav className="hidden md:flex space-x-8">
                <button onClick={() => { navigate('/'); setTimeout(() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-gray-700 hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors">
                  Features
                </button>
                <button onClick={() => { navigate('/'); setTimeout(() => document.getElementById('industries')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-gray-700 hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors">
                  Industries
                </button>
                <button onClick={() => { navigate('/'); setTimeout(() => document.getElementById('apps')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-gray-700 hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors">
                  Apps
                </button>
                <button onClick={() => navigate('/pricing')} className="text-gray-700 hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors">
                  Pricing
                </button>
              </nav>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/request-demo')}
                className="text-gray-700 hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors"
              >
                Request a demo
              </button>
              <button
                onClick={() => navigate('/login')}
                className="text-black bg-[#60A5FA] hover:bg-[#3B82F6] px-6 py-2.5 rounded-lg font-semibold text-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </header>

    <div className="py-12 flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-200">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
              Request a demo to see how 72X can grow your business.
            </h1>
            <ul className="space-y-5 text-gray-700 text-lg">
              <li className="flex gap-3"><span>✓</span><span>Get expert recommendations on using our AI tools to reach your next big goal.</span></li>
              <li className="flex gap-3"><span>✓</span><span>See how entrepreneurs use our automation and segmentation to scale.</span></li>
              <li className="flex gap-3"><span>✓</span><span>Learn how to plug your current tools and workflows into 72X.</span></li>
              <li className="flex gap-3"><span>✓</span><span>Understand how we migrate your forms, sequences and automations seamlessly.</span></li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-200">
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                <input className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business email address</label>
                <input type="email" className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Industry</label>
                <select className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
                  <option value="">Please select</option>
                  <option>Retail & E-commerce</option>
                  <option>Hospitality & Tourism</option>
                  <option>Professional Services</option>
                  <option>Manufacturing</option>
                  <option>Agriculture</option>
                  <option>Transport & Logistics</option>
                  <option>Construction</option>
                  <option>Healthcare</option>
                  <option>Education</option>
                  <option>Creative Industries</option>
                  <option>Other</option>
                </select>
              </div>
              {/* Dropdowns removed per request */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website or Social Media URL</label>
                <input className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" placeholder="https://" />
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full bg-[#60A5FA] hover:bg-[#3B82F6] text-black font-semibold py-3 rounded-lg shadow-sm hover:shadow-md transition-colors">Submit demo request</button>
              </div>
              <p className="text-xs text-gray-500">By submitting this form, you agree to our Terms of Service and Privacy Policy.</p>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-16 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-200">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10">Frequently asked questions</h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            {[{
              q: 'Can I start for free?',
              a: 'Yes. The Starter plan is free and includes core business tools so you can get value immediately.'
            }, {
              q: 'Can I change plans later?',
              a: "Absolutely. You can upgrade or downgrade at any time and we'll prorate your subscription."
            }, {
              q: 'Do you offer support?',
              a: 'All paid plans include priority email support. Enterprise includes dedicated assistance.'
            }].map((item) => (
              <div key={item.q} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
    </div>
  );
};

export default RequestDemo;


