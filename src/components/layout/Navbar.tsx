import React, { useState } from 'react';
import { UserProfile } from '../../types';
import {
  Menu,
  X,
  User,
  LayoutDashboard,
  Sparkles,
  Camera,
  Shirt,
  LogOut,
  ChevronRight,
  Compass
} from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  onRouteChange: (route: string) => void;
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onRouteChange,
  currentUser,
  isAuthenticated,
  onOpenAuth,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'features', label: 'Features' },
    { id: 'try-on', label: 'Virtual Try-On' },
    { id: 'about', label: 'About Us' }
  ];

  const handleNavClick = (routeId: string) => {
    onRouteChange(routeId);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E4E9F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Single Brand Wordmark & Emblem */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left focus:outline-hidden group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#101C3A] flex items-center justify-center text-white shadow-xs group-hover:bg-[#3569FF] transition-colors">
              {/* Minimalist hanger/silhouette emblem */}
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a3 3 0 0 0-3 3c0 1.25.75 2.33 1.83 2.75L2 14v2h20v-2L13.17 7.75A3 3 0 0 0 12 2z" />
                <path d="M9 16v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#101C3A]">
                Fit<span className="text-[#3569FF]">Me</span>
              </span>
            </div>
          </button>

          {/* Zone 2: 5 Concise Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-[#3569FF] font-semibold'
                      : 'text-[#66738D] hover:text-[#101C3A]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action / User Profile */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-3 pr-2 rounded-full border border-[#E4E9F2] bg-[#F5F7FC] hover:bg-white transition-colors cursor-pointer"
                >
                  <span className="text-xs font-semibold text-[#101C3A]">
                    {currentUser.name}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#101C3A] text-white flex items-center justify-center text-xs font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#E4E9F2] py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#F1F4F9]">
                      <p className="text-xs font-semibold text-[#101C3A]">{currentUser.name}</p>
                      <p className="text-[11px] text-[#66738D] truncate">{currentUser.email}</p>
                    </div>

                    <button
                      onClick={() => handleNavClick('dashboard')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#15213D] hover:bg-[#F5F7FC] transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#3569FF]" />
                      <span>Dashboard</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('measure')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#15213D] hover:bg-[#F5F7FC] transition-colors"
                    >
                      <Camera className="w-4 h-4 text-[#3569FF]" />
                      <span>Body Measurement</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('avatar')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#15213D] hover:bg-[#F5F7FC] transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-[#3569FF]" />
                      <span>3D Avatar Studio</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('try-on')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#15213D] hover:bg-[#F5F7FC] transition-colors"
                    >
                      <Shirt className="w-4 h-4 text-[#3569FF]" />
                      <span>Virtual Try-On</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('history')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#15213D] hover:bg-[#F5F7FC] transition-colors"
                    >
                      <Compass className="w-4 h-4 text-[#3569FF]" />
                      <span>Measurement History</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('profile')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#15213D] hover:bg-[#F5F7FC] transition-colors"
                    >
                      <User className="w-4 h-4 text-[#66738D]" />
                      <span>Profile & Settings</span>
                    </button>

                    <div className="border-t border-[#F1F4F9] mt-1 pt-1">
                      <button
                        onClick={() => {
                          onLogout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 text-xs font-semibold text-[#15213D] hover:text-[#3569FF] transition-colors cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#3569FF] hover:bg-[#2554db] rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#15213D] rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E4E9F2] bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg text-left ${
                  currentRoute === link.id
                    ? 'bg-[#F5F7FC] text-[#3569FF] font-semibold'
                    : 'text-[#15213D] hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#F1F4F9] space-y-2">
            {isAuthenticated && currentUser ? (
              <>
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#101C3A] hover:bg-[#F5F7FC] rounded-lg"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#3569FF]" />
                  <span>Go to Dashboard</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    onOpenAuth('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-xs font-semibold text-center border border-[#E4E9F2] rounded-lg text-[#15213D]"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-xs font-semibold text-center bg-[#3569FF] text-white rounded-lg"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
