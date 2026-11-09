import React from 'react';
import { Camera, Ruler, User, Shirt, ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface HowItWorksPageProps {
  onRouteChange: (route: string) => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  isAuthenticated: boolean;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({
  onRouteChange,
  onOpenAuth,
  isAuthenticated
}) => {
  const handleStart = () => {
    if (isAuthenticated) onRouteChange('measure');
    else onOpenAuth('signup');
  };

  return (
    <div className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <p className="text-xs font-semibold text-[#3569FF] uppercase tracking-wider">
          The Science of Sizing
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#101C3A] tracking-tight">
          How FitMe Digitizes Your Measurements
        </h1>
        <p className="text-sm sm:text-base text-[#66738D] leading-relaxed">
          FitMe unites computer vision, anthropometric mathematics, and interactive 3D WebGL to generate accurate garment recommendations from ordinary photographs.
        </p>
      </div>

      {/* Featured Workflow Showcase */}
      <div className="bg-white rounded-3xl border border-[#E4E9F2] shadow-sm p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-semibold text-[#3569FF]">
              Calibration & Image Processing
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#101C3A]">
              Capturing Proportion Without Hardware Scanners
            </h2>
            <p className="text-xs sm:text-sm text-[#66738D] leading-relaxed">
              Traditional 3D body scanners require expensive multi-sensor chambers. FitMe uses calibrated relative anthropometry: by entering your true standing height, the system calculates precise pixel-to-centimeter scale factors, isolating torso contours, acromion points, and limb lengths.
            </p>

            <ul className="space-y-3 text-xs text-[#15213D]">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#3569FF]" />
                <span>Zero tape measure errors or subjective posture variance.</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#3569FF]" />
                <span>Ellipse approximations modeled after validated human body depth ratios.</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#3569FF]" />
                <span>Transparent confidence indicators for every anatomical dimension.</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-[#E4E9F2] shadow-md bg-slate-900 aspect-4/3 relative">
              <img
                src="/src/assets/images/how_it_works_scan_1794221430759.jpg"
                alt="FitMe body measurement studio calibration"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-[#E4E9F2] text-xs flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#101C3A]">Measurement Grid Matrix</p>
                  <p className="text-[11px] text-[#66738D]">Automated 33-Keypoint Pose Tracking</p>
                </div>
                <span className="text-emerald-600 font-semibold text-[11px]">Calibrated</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Deep Dive Steps */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-[#101C3A] text-center">
          Step-by-Step Measurement Journey
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-8 border border-[#E4E9F2] shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#3569FF] flex items-center justify-center font-bold">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-[#66738D]">Step 01</span>
                <h3 className="text-base font-bold text-[#101C3A]">Capture Your Photo</h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#66738D] leading-relaxed">
              Position your device at mid-torso level, step back until your entire silhouette is visible, and capture a standing photo in form-fitting apparel or activewear.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-8 border border-[#E4E9F2] shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#3569FF] flex items-center justify-center font-bold">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-[#66738D]">Step 02</span>
                <h3 className="text-base font-bold text-[#101C3A]">Discover Your Measurements</h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#66738D] leading-relaxed">
              Our computer vision pipeline maps key landmarks across shoulders, chest, waist, and hips, determining calibrated dimensions with confidence intervals.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-8 border border-[#E4E9F2] shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#3569FF] flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-[#66738D]">Step 03</span>
                <h3 className="text-base font-bold text-[#101C3A]">Create Your 3D Avatar</h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#66738D] leading-relaxed">
              FitMe procedurally sculpts a 3D avatar reflecting your proportional ratios, chest prominence, waist taper, and limb lengths with realistic physical shaders.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-8 border border-[#E4E9F2] shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#3569FF] flex items-center justify-center font-bold">
                <Shirt className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-[#66738D]">Step 04</span>
                <h3 className="text-base font-bold text-[#101C3A]">Try Different Styles</h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#66738D] leading-relaxed">
              Browse tailored blazers, denim, streetwear, and dresses. Rotate 360 degrees to see how sleeve lengths and collars drape before making any online purchase.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Bottom Banner */}
      <div className="bg-[#101C3A] rounded-3xl p-10 text-center text-white space-y-5">
        <h2 className="text-2xl sm:text-3xl font-bold">Experience the Future of Sizing</h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Start your scan now and unlock your personalized 3D avatar within minutes.
        </p>
        <button
          onClick={handleStart}
          className="px-6 py-3 bg-[#3569FF] hover:bg-[#2554db] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Create Your FitMe Avatar</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
