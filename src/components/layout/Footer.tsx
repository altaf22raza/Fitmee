import React from 'react';
import { Instagram, Linkedin, Youtube, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onRouteChange: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onRouteChange }) => {
  const handleNav = (route: string) => {
    onRouteChange(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#101C3A] text-white pt-16 pb-12 border-t border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#3569FF] flex items-center justify-center text-white shadow-xs">
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
              <span className="text-xl font-bold tracking-tight text-white">
                Fit<span className="text-[#3569FF]">Me</span>
              </span>
            </div>

            <p className="text-sm font-medium text-slate-300">
              Smart Measurements. Better Fits.
            </p>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              FitMe is an AI-powered fashion-tech platform combining computer vision,
              personalized 3D body avatars, and virtual try-on to make personalized style
              effortless.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#instagram"
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-[#3569FF] transition-colors flex items-center justify-center text-slate-300 hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#linkedin"
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-[#3569FF] transition-colors flex items-center justify-center text-slate-300 hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#youtube"
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-[#3569FF] transition-colors flex items-center justify-center text-slate-300 hover:text-white"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Company Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('how-it-works')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('features')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Features
                </button>
              </li>
            </ul>
          </div>

          {/* Product Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Product
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => handleNav('measure')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  AI Measurements
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('avatar')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  3D Avatar
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('try-on')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Virtual Try-On
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('dashboard')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  My Account
                </button>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Support
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('how-it-works')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Help Center
                </button>
              </li>
              <li>
                <span className="text-slate-400 cursor-default">Privacy Policy</span>
              </li>
              <li>
                <span className="text-slate-400 cursor-default">Terms & Conditions</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 FitMe. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Private & Encrypted Body Data Storage</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
