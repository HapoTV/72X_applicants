import React, { useEffect, useRef, useState } from 'react';
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

  // Grace period so a quick mouse movement between the trigger and the
  // panel (or a brief dip outside both) doesn't close the dropdown before
  // a click can land.
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleDropdownEnter = () => {
    clearCloseTimer();
    setProductDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setProductDropdownOpen(false);
    }, 200);
  };

  useEffect(() => clearCloseTimer, []);

  return (
    <header className="sticky top-0 z-50 bg-[#F5F7FA]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-20 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center">
            <img
              src={logoUrl}
              alt="72X Logo"
              className="h-14 w-auto max-w-[8rem] cursor-pointer sm:h-16 md:h-20"
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
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
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
                    className="fixed left-0 right-0 top-20 bg-white shadow-xl z-50 py-8"
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
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
            <div className="pl-2 md:hidden">
              <button
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
                className="rounded-md p-2 hover:bg-gray-100"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => navigate('/request-demo')}
              className="hidden rounded-lg px-1 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-[#3B82F6] hover:text-gray-900 sm:inline-flex sm:text-base"
            >
              Request demo
            </button>
            <button
              onClick={() => navigate('/login')}
              className="rounded-lg bg-[#60A5FA] px-3 py-2 text-sm font-semibold text-black shadow-sm transition-all duration-200 hover:bg-[#3B82F6] hover:shadow-md sm:px-4 sm:text-base"
            >
              Log in
            </button>
          </div>
        </div>
        {/* Mobile navigation panel */}
        {mobileOpen && (
          <div className="absolute left-0 right-0 top-full border-t border-gray-200 bg-[#F5F7FA] shadow-md md:hidden">
            <div className="space-y-2 px-4 py-4 sm:px-6">
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
