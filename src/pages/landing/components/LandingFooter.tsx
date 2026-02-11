import React from 'react';
import { Link } from 'react-router-dom';

const footerLogo = '/Logo3.png';

const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img
                src={footerLogo}
                alt="72X Logo"
                className="h-24 w-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).onerror = null;
                  (e.target as HTMLImageElement).src = '/Logo2.png';
                }}
              />
            </div>
            <p className="text-gray-300 text-sm">
              Empowering South African entrepreneurs with AI-driven business tools and localized support.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-white/90">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#apps" className="hover:text-white transition-colors">
                  Apps
                </a>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/request-demo" className="hover:text-white transition-colors">
                  Demo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-white/90">
              <li>
                <a href="#industries" className="hover:text-white transition-colors">
                  Industries
                </a>
              </li>
              <li>
                <a href="#community" className="hover:text-white transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a href="#help" className="hover:text-white transition-colors">
                  Help
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-white/90">
              <li>
                <a href="#help" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Learning
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Webinars
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-white/90 text-sm">© {new Date().getFullYear()} 72X. All rights reserved.</div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-white/90 hover:text-white transition-colors text-sm">
              Privacy
            </a>
            <a href="#" className="text-white/90 hover:text-white transition-colors text-sm">
              Terms
            </a>
            <a href="#" className="text-white/90 hover:text-white transition-colors text-sm">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
