import React, { useState } from 'react';
import { ChevronDown, Menu } from 'lucide-react';
import type { ProductCategory, ProductCategoryItem } from '../hooks/useLandingPage';

const logoUrl = `${import.meta.env.BASE_URL}Logo2.svg`;

interface LandingHeaderProps {
  navigate: (to: string) => void;
  productDropdownOpen: boolean;
  setProductDropdownOpen: (open: boolean) => void;
  productDropdownRef: React.RefObject<HTMLDivElement | null>;
  productCategories: ProductCategory[];
  onProductItemClick: (item: ProductCategoryItem) => void;
}

const LandingHeader: React.FC<LandingHeaderProps> = ({
  navigate,
  productDropdownOpen,
  setProductDropdownOpen,
  productDropdownRef,
  productCategories,
  onProductItemClick,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="bg-[#F5F7FA] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-0">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-0">
            <img
              src={logoUrl}
              alt="72X Logo"
              className="h-16 md:h-20 w-auto cursor-pointer"
              onClick={() => navigate('/')}
              onError={(e) => {
                (e.target as HTMLImageElement).onerror = null;
                (e.target as HTMLImageElement).src = logoUrl;
              }}
            />

            <nav className="hidden md:flex space-x-8 items-center">
              <button
                onClick={() => { navigate('/'); setTimeout(() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }), 120); }}
                className="text-gray-700 hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => { navigate('/'); setTimeout(() => document.getElementById('industries')?.scrollIntoView({ behavior: 'smooth' }), 120); }}
                className="text-gray-700 hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors"
              >
                Industries
              </button>

              <div
                className="relative"
                ref={productDropdownRef}
                onMouseEnter={() => setProductDropdownOpen(true)}
                onMouseLeave={() => setProductDropdownOpen(false)}
              >
                <button
                  onClick={() => setProductDropdownOpen(!productDropdownOpen)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors"
                >
                  <span>Product</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${productDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {productDropdownOpen && (
                  <div
                    className="fixed left-0 right-0 mt-2 bg-white shadow-xl z-50 py-8"
                    onMouseEnter={() => setProductDropdownOpen(true)}
                    onMouseLeave={() => setProductDropdownOpen(false)}
                  >
                    <div className="max-w-7xl mx-auto px-8">
                      <div className="grid grid-cols-5 gap-8">
                        {productCategories.map((category, idx) => (
                          <div key={idx}>
                            <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
                              {category.title}
                            </h3>
                            <ul className="space-y-2">
                              {category.items.map((item) => {
                                const getIconColor = () => {
                                  switch (category.title) {
                                    case 'APPS':
                                      return 'text-blue-600 group-hover:text-blue-700';
                                    case 'COMMUNICATION':
                                      return 'text-purple-600 group-hover:text-purple-700';
                                    case 'GROWTH':
                                      return 'text-green-600 group-hover:text-green-700';
                                    case 'TIME':
                                      return 'text-orange-600 group-hover:text-orange-700';
                                    case 'MORE':
                                      return 'text-pink-600 group-hover:text-pink-700';
                                    default:
                                      return 'text-gray-600 group-hover:text-gray-700';
                                  }
                                };

                                return (
                                  <li key={item.path}>
                                    <button
                                      onClick={() => onProductItemClick(item)}
                                      className="flex items-center space-x-2 w-full text-left px-2 py-2 rounded hover:bg-gray-50 transition-colors group"
                                    >
                                      <item.icon className={`w-4 h-4 ${getIconColor()}`} />
                                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                        {item.name}
                                      </span>
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate('/programs')}
                className="text-gray-700 hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors"
              >
                Programs
              </button>

              <button
                onClick={() => navigate('/pricing')}
                className="text-gray-700 hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors"
              >
                Pricing
              </button>
            </nav>
            {/* Mobile menu toggle - visible on small screens */}
            <div className="md:hidden pl-3">
              <button
                aria-label="Toggle menu"
                onClick={() => setMobileOpen((v) => !v)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => navigate('/request-demo')}
              className="text-gray-700  hover:bg-[#3B82F6] px-0.5 py-0.1 rounded-lg font-semibold text-lg transition-all duration-100  hover:text-gray-900 px-1 py-2 text-lg font-semibold transition-colors"
            >
              Request demo
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-black bg-[#60A5FA] hover:bg-[#3B82F6] px-2 py-1.5 rounded-lg font-semibold text-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Log in
            </button>
          </div>
        </div>
        {/* Mobile navigation panel */}
        {mobileOpen && (
          <div className="md:hidden bg-[#F5F7FA] border-t border-gray-200 z-40">
            <div className="px-4 py-4 space-y-2">
              <button
                onClick={() => { setMobileOpen(false); navigate('/'); setTimeout(() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }), 120); }}
                className="w-full text-left text-gray-700 px-2 py-2 rounded font-semibold"
              >
                Features
              </button>
              <button
                onClick={() => { setMobileOpen(false); navigate('/'); setTimeout(() => document.getElementById('industries')?.scrollIntoView({ behavior: 'smooth' }), 120); }}
                className="w-full text-left text-gray-700 px-2 py-2 rounded font-semibold"
              >
                Industries
              </button>
              <button
                onClick={() => { setMobileOpen(false); setProductDropdownOpen(true); }}
                className="w-full text-left text-gray-700 px-2 py-2 rounded font-semibold"
              >
                Product
              </button>
              <button
                onClick={() => { setMobileOpen(false); navigate('/programs'); }}
                className="w-full text-left text-gray-700 px-2 py-2 rounded font-semibold"
              >
                Programs
              </button>
              <button
                onClick={() => { setMobileOpen(false); navigate('/pricing'); }}
                className="w-full text-left text-gray-700 px-2 py-2 rounded font-semibold"
              >
                Pricing
              </button>

              {/* Primary CTAs already visible in header on mobile, removed duplicate buttons here */}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default LandingHeader;
