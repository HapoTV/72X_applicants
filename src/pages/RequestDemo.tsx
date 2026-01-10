import React from "react";
import { useNavigate } from "react-router-dom";
import logoSvg from "../assets/Logo.svg";

const RequestDemo: React.FC = () => {
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(null);
  const [showAllFaqs, setShowAllFaqs] = React.useState<boolean>(false);
  
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
                Request demo
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
              <li className="flex gap-3"><span className="text-green-500">✓</span><span>Access comprehensive business tools including Dashboard, Analytics, and Metrics to track your growth in real-time.</span></li>
              <li className="flex gap-3"><span className="text-green-500">✓</span><span>Get AI-powered insights with our Business Analyst to make data-driven decisions and reach your next big goal.</span></li>
              <li className="flex gap-3"><span className="text-green-500">✓</span><span>Connect with mentors, find funding opportunities, and access the Marketplace to grow your network and resources.</span></li>
              <li className="flex gap-3"><span className="text-green-500">✓</span><span>Learn from expert-led modules covering Business Planning, Marketing, Finance, Operations, and Leadership.</span></li>
              <li className="flex gap-3"><span className="text-green-500">✓</span><span>Build personalized roadmaps, manage your schedule, and leverage community support to scale your business faster.</span></li>
              <li className="flex gap-3"><span className="text-green-500">✓</span><span>Available in all 11 South African languages with dedicated support for township and rural entrepreneurs.</span></li>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{
              q: 'Can I start for free?',
              a: 'Yes. The Start-up plan is free and includes core business tools like Dashboard, Learning Modules, Community Access, and Schedule Management so you can get value immediately.'
            }, {
              q: 'What features are included in each plan?',
              a: 'Start-up (Free) includes basic tools. Essential (R299/month) adds Marketplace, Mentorship, Funding Finder, and Data Input. Premium (R999/month) includes everything plus Roadmap Generator, Advanced Analytics, Resources, Expert Sessions, and AI Business Analyst.'
            }, {
              q: 'Can I change plans later?',
              a: "Absolutely. You can upgrade or downgrade at any time and we'll prorate your subscription. There's no long-term commitment required."
            }, {
              q: 'Do you offer support?',
              a: 'All paid plans include priority email support. Essential includes priority support, while Premium includes dedicated assistance. The free Start-up plan includes community support and email support.'
            }, {
              q: 'Is 72X available in my language?',
              a: 'Yes! 72X is available in all 11 official South African languages, making it accessible to entrepreneurs across the country, including township and rural areas.'
            }, {
              q: 'How does the AI Business Analyst work?',
              a: 'Our AI Business Analyst (available in Premium) analyzes your business data to provide personalized insights, growth recommendations, and actionable next steps to help you scale faster.'
            }, {
              q: 'Can I access mentorship and funding opportunities?',
              a: 'Yes! With the Essential and Premium plans, you get access to our Mentorship Hub to connect with experienced entrepreneurs and our Funding Finder to discover funding opportunities tailored to your business.'
            }, {
              q: 'What industries does 72X support?',
              a: 'We support all industries including Retail, Hospitality, Professional Services, Manufacturing, Agriculture, Transport, Construction, Healthcare, Education, and Creative Industries with tailored solutions for each.'
            }, {
              q: 'How do I get started with 72X?',
              a: 'Simply sign up for a free Start-up account on our website. You can start using the platform immediately with no credit card required. Upgrade to Essential or Premium anytime to unlock more features.'
            }, {
              q: 'Can I integrate 72X with my existing tools?',
              a: 'Yes! Premium plans include custom integrations. We can help you connect your existing tools and workflows into 72X, and our team will assist with migrating your data seamlessly.'
            }, {
              q: 'What payment methods do you accept?',
              a: 'We accept all major credit cards, debit cards, and EFT payments. All transactions are secure and encrypted. You can manage your payment method anytime in your account settings.'
            }, {
              q: 'Is my business data secure?',
              a: 'Absolutely. We use bank-level encryption to protect your data. All information is stored securely on South African servers, and we comply with POPIA regulations to ensure your privacy.'
            }, {
              q: 'Can I cancel my subscription anytime?',
              a: 'Yes, you can cancel your subscription at any time with no penalties. Your access will continue until the end of your billing period, and you can always reactivate later.'
            }, {
              q: 'Do you offer training or onboarding?',
              a: 'Yes! All paid plans include access to video tutorials and learning resources. Premium plans include personalized onboarding sessions and dedicated support to help you get the most out of the platform.'
            }, {
              q: 'What makes 72X different from other platforms?',
              a: '72X is specifically designed for South African entrepreneurs with local language support, township-focused features, and tools tailored to the unique challenges of growing businesses in South Africa.'
            }, {
              q: 'Can I try Premium features before upgrading?',
              a: 'Yes! We offer a free trial of Essential and Premium features so you can explore advanced tools like the AI Business Analyst, Roadmap Generator, and Analytics before committing to a paid plan.'
            }].slice(0, showAllFaqs ? undefined : 6).map((item, idx) => (
              <div key={item.q} className="border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors bg-white">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full text-left p-5 flex justify-between items-start hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 pr-4 text-base">{item.q}</h3>
                  <span className="text-2xl text-gray-400 flex-shrink-0">
                    {openFaqIndex === idx ? '−' : '+'}
                  </span>
                </button>
                {openFaqIndex === idx && (
                  <div className="px-5 pb-5 border-t border-gray-100">
                    <p className="text-gray-600 pt-3 text-sm">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Show More/Less Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowAllFaqs(!showAllFaqs)}
              className="px-8 py-3 bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              {showAllFaqs ? 'Show Less' : 'Show More Questions'}
            </button>
          </div>
        </section>
      </div>
    </div>
    </div>
  );
};

export default RequestDemo;


