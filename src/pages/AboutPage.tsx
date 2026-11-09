import React from 'react';
import { Sparkles, Shield, Cpu, Target, Eye, Layers, Compass, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onRouteChange: (route: string) => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  isAuthenticated: boolean;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onRouteChange,
  onOpenAuth,
  isAuthenticated
}) => {
  return (
    <div className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <p className="text-xs font-semibold text-[#3569FF] uppercase tracking-wider">
          About FitMe
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#101C3A] tracking-tight">
          Making Fashion More Personal.
        </h1>
        <p className="text-sm sm:text-base text-[#66738D] leading-relaxed">
          FitMe aims to make personalized fashion experiences accessible through AI-powered body measurement, 3D visualization, and virtual clothing exploration.
        </p>
      </div>

      {/* Mission & Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mission Card */}
        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#E4E9F2] shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#3569FF] flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#101C3A]">Our Mission</h2>
          <p className="text-xs sm:text-sm text-[#66738D] leading-relaxed">
            Help people understand their body proportions and make more informed fashion choices. By providing transparent, calibrated sizing tools, we eliminate the guesswork from apparel shopping and reduce fit-related return friction.
          </p>
        </div>

        {/* Vision Card */}
        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#E4E9F2] shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#3569FF] flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#101C3A]">Our Vision</h2>
          <p className="text-xs sm:text-sm text-[#66738D] leading-relaxed">
            Build a smarter and more personalized digital fashion experience. We envision an online fashion ecosystem where garments are created, visualized, and purchased with absolute clarity on how fabric drape fits real human diversity.
          </p>
        </div>
      </div>

      {/* Technology Behind FitMe */}
      <div className="bg-white rounded-3xl border border-[#E4E9F2] shadow-xs p-8 sm:p-12 space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-semibold text-[#3569FF] uppercase tracking-wider">
            Architecture & Principles
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#101C3A]">
            The Technology Behind FitMe
          </h2>
          <p className="text-xs sm:text-sm text-[#66738D]">
            Built with modern web standards, privacy-preserving algorithms, and lightweight rendering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="space-y-3 p-5 rounded-xl bg-[#F5F7FC] border border-[#E4E9F2]">
            <Cpu className="w-5 h-5 text-[#3569FF]" />
            <h3 className="text-sm font-bold text-[#101C3A]">Edge Computer Vision</h3>
            <p className="text-xs text-[#66738D] leading-relaxed">
              Silhouette segmentation and landmark detection execute on-device in your browser via HTML5 Canvas and MediaPipe techniques, keeping sensitive photos private.
            </p>
          </div>

          <div className="space-y-3 p-5 rounded-xl bg-[#F5F7FC] border border-[#E4E9F2]">
            <Layers className="w-5 h-5 text-[#3569FF]" />
            <h3 className="text-sm font-bold text-[#101C3A]">WebGL & Three.js 3D</h3>
            <p className="text-xs text-[#66738D] leading-relaxed">
              Real-time parametric geometry adjusts anatomically in milliseconds. Physically based rendering (PBR) simulates authentic cotton, wool, silk, and denim surface finishes.
            </p>
          </div>

          <div className="space-y-3 p-5 rounded-xl bg-[#F5F7FC] border border-[#E4E9F2]">
            <Shield className="w-5 h-5 text-[#3569FF]" />
            <h3 className="text-sm font-bold text-[#101C3A]">Private & Secure Data</h3>
            <p className="text-xs text-[#66738D] leading-relaxed">
              Users retain full ownership of their biometric measurements. We do not store or monetize your biometric profiles without explicit consent.
            </p>
          </div>
        </div>
      </div>

      {/* Future Roadmap */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-[#3569FF] uppercase tracking-wider">
            Innovation Pipeline
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#101C3A]">
            Product Roadmap
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E4E9F2] shadow-xs space-y-3">
            <span className="text-xs font-semibold text-[#3569FF]">Phase 1 · Current Release</span>
            <h3 className="text-base font-bold text-[#101C3A]">Calibrated AI Sizing</h3>
            <p className="text-xs text-[#66738D] leading-relaxed">
              Single-photo calibrated estimation, interactive 3D avatar customizer, procedural garment draping, and measurement history tracking.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E4E9F2] shadow-xs space-y-3">
            <span className="text-xs font-semibold text-[#66738D]">Phase 2 · In Development</span>
            <h3 className="text-base font-bold text-[#101C3A]">Multi-Angle Photogrammetry</h3>
            <p className="text-xs text-[#66738D] leading-relaxed">
              Combining frontal and sagittal side-profile photographs to eliminate circumference ellipse uncertainty down to under 0.5 centimeters.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E4E9F2] shadow-xs space-y-3">
            <span className="text-xs font-semibold text-[#66738D]">Phase 3 · Upcoming</span>
            <h3 className="text-base font-bold text-[#101C3A]">Brand Direct API Integration</h3>
            <p className="text-xs text-[#66738D] leading-relaxed">
              Direct size chart sync with leading global sustainable fashion houses, bringing 1-click tailored sizing to your favorite checkout flows.
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="bg-[#101C3A] text-white rounded-3xl p-10 text-center space-y-4">
        <h2 className="text-2xl font-bold">Join the FitMe Movement</h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          Start your sizing journey today and discover a wardrobe curated precisely for your unique proportions.
        </p>
        <button
          onClick={() => {
            if (isAuthenticated) onRouteChange('dashboard');
            else onOpenAuth('signup');
          }}
          className="px-6 py-3 bg-[#3569FF] hover:bg-[#2554db] text-white text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Get Started with FitMe</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
