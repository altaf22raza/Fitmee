import React, { useState } from 'react';
import { AvatarConfig, ClothingCategory, GarmentItem } from '../types';
import { Avatar3DViewer } from '../components/3d/Avatar3DViewer';
import { GARMENT_CATALOG, CATEGORY_LABELS } from '../services/garmentCatalog';
import {
  Camera,
  Ruler,
  User,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Shirt,
  Shield,
  Layers,
  TrendingUp,
  RotateCw,
  Compass,
  Check,
  X
} from 'lucide-react';

interface HomePageProps {
  avatarConfig: AvatarConfig;
  onRouteChange: (route: string) => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  isAuthenticated: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  avatarConfig,
  onRouteChange,
  onOpenAuth,
  isAuthenticated
}) => {
  // Try-On Showcase state
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory>('jackets');
  const [selectedColor, setSelectedColor] = useState<string>('#101C3A');
  const [heroSplitMode, setHeroSplitMode] = useState<'3d' | 'split'>('split');

  const filteredGarments = GARMENT_CATALOG.filter((g) => g.category === selectedCategory);
  const activeGarment = filteredGarments[0] || GARMENT_CATALOG[0];

  const handleCtaClick = () => {
    if (isAuthenticated) {
      onRouteChange('measure');
    } else {
      onOpenAuth('signup');
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 md:pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            {/* Unboxed natural kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#3569FF] tracking-wide">
              <span>AI Fashion & Body Technology</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#66738D]">Next-Gen Virtual Fitting</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#101C3A] leading-[1.1] text-balance">
              Your Body. Your Style. Your Perfect Fit.
            </h1>

            <p className="text-base sm:text-lg text-[#66738D] leading-relaxed max-w-xl">
              Discover your body measurements, create your personalized 3D avatar,
              and explore endless fashion possibilities with AI-powered virtual try-on.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleCtaClick}
                className="px-6 py-3.5 bg-[#3569FF] hover:bg-[#2554db] text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Get Started – It&apos;s Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onRouteChange('try-on')}
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-[#101C3A] border border-[#E4E9F2] text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Explore Virtual Try-On
              </button>
            </div>

            {/* Quiet trust points */}
            <div className="pt-4 flex items-center gap-6 text-xs text-[#66738D]">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#3569FF]" />
                <span>Zero measuring tape needed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#3569FF]" />
                <span>Real 3D interactive avatar</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual: Split Visual Mode (Photo + Landmarks + 3D Avatar) */}
          <div className="lg:col-span-6">
            <div className="relative bg-white rounded-2xl border border-[#E4E9F2] shadow-xl p-3 sm:p-4">
              {/* Split Mode Switcher Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F1F4F9]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3569FF]" />
                  <span className="text-xs font-semibold text-[#101C3A]">
                    {heroSplitMode === 'split' ? 'Split AI Calibration & 3D Avatar' : 'Interactive 3D Stage'}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-[#F5F7FC] p-1 rounded-lg">
                  <button
                    onClick={() => setHeroSplitMode('split')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      heroSplitMode === 'split'
                        ? 'bg-white text-[#101C3A] shadow-xs'
                        : 'text-[#66738D] hover:text-[#101C3A]'
                    }`}
                  >
                    Split View
                  </button>
                  <button
                    onClick={() => setHeroSplitMode('3d')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      heroSplitMode === '3d'
                        ? 'bg-white text-[#101C3A] shadow-xs'
                        : 'text-[#66738D] hover:text-[#101C3A]'
                    }`}
                  >
                    Full 3D
                  </button>
                </div>
              </div>

              {heroSplitMode === 'split' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
                  {/* Left: Original Photograph with Measurement Overlay */}
                  <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-3/4 flex flex-col justify-end">
                    <img
                      src="/src/assets/images/hero_model_fashion_1794221429970.jpg"
                      alt="Human model body scan calibration"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover opacity-90"
                    />
                    {/* Measurement Landmark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101C3A]/90 via-transparent to-transparent" />
                    
                    {/* Visual Calibrated Markers */}
                    <div className="absolute top-1/4 left-4 right-4 border-t border-dashed border-[#3569FF]/80 flex justify-between text-[10px] text-white font-mono">
                      <span className="bg-[#101C3A]/80 px-1.5 py-0.5 rounded">Chest: 98.0 cm</span>
                      <span className="text-emerald-400">96% Conf.</span>
                    </div>
                    <div className="absolute top-1/2 left-6 right-6 border-t border-dashed border-[#3569FF]/80 flex justify-between text-[10px] text-white font-mono">
                      <span className="bg-[#101C3A]/80 px-1.5 py-0.5 rounded">Waist: 81.5 cm</span>
                    </div>
                    <div className="absolute top-[65%] left-5 right-5 border-t border-dashed border-[#3569FF]/80 flex justify-between text-[10px] text-white font-mono">
                      <span className="bg-[#101C3A]/80 px-1.5 py-0.5 rounded">Hips: 97.0 cm</span>
                    </div>

                    <div className="relative p-3 text-white">
                      <p className="text-[11px] font-semibold">1. Capture & Landmark Extraction</p>
                      <p className="text-[10px] text-slate-300">Calibrated to 175cm Height</p>
                    </div>
                  </div>

                  {/* Right: Live Interactive 3D Avatar */}
                  <div className="rounded-xl overflow-hidden relative aspect-3/4 bg-[#F5F7FC]">
                    <Avatar3DViewer
                      avatarConfig={avatarConfig}
                      selectedOuterwear={{
                        ...GARMENT_CATALOG.find((g) => g.id === 'garment_jacket_blazer')!,
                        selectedColor: '#101C3A'
                      }}
                      selectedBottom={{
                        ...GARMENT_CATALOG.find((g) => g.id === 'garment_trouser_wool')!,
                        selectedColor: '#334155'
                      }}
                      height="100%"
                      showControls={false}
                      autoRotateDefault={true}
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-xs p-2 rounded-lg border border-[#E4E9F2] text-[10px] flex items-center justify-between">
                      <span className="font-semibold text-[#101C3A]">2. Personalized 3D Avatar</span>
                      <span className="text-[#3569FF]">Interactive</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[460px] rounded-xl overflow-hidden">
                  <Avatar3DViewer
                    avatarConfig={avatarConfig}
                    selectedOuterwear={{
                      ...activeGarment,
                      selectedColor
                    }}
                    height="100%"
                    showControls={true}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Supporting statement bar below hero */}
        <div className="mt-16 pt-10 border-t border-[#E4E9F2] text-center max-w-3xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[#101C3A]">
            Fashion Should Fit You, Not the Other Way Around.
          </h2>
          <p className="text-sm text-[#66738D]">
            FitMe combines AI, computer vision, and 3D technology to make personalized fashion more accessible.
          </p>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <p className="text-xs font-semibold text-[#3569FF] tracking-wider uppercase">
            Four Simple Steps
          </p>
          <h2 className="text-3xl font-extrabold text-[#101C3A]">
            How FitMe Works
          </h2>
          <p className="text-sm text-[#66738D]">
            From a single photograph to an interactive 3D virtual dressing room in under two minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E4E9F2] shadow-xs relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#F5F7FC] text-[#3569FF] flex items-center justify-center font-bold text-lg">
                <Camera className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-[#66738D]">Step 01</span>
              <h3 className="text-base font-bold text-[#101C3A]">Capture Your Photo</h3>
              <p className="text-xs text-[#66738D] leading-relaxed">
                Upload a photograph or capture a live image using your camera against a neutral background.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E4E9F2] shadow-xs relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#F5F7FC] text-[#3569FF] flex items-center justify-center font-bold text-lg">
                <Ruler className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-[#66738D]">Step 02</span>
              <h3 className="text-base font-bold text-[#101C3A]">Discover Your Measurements</h3>
              <p className="text-xs text-[#66738D] leading-relaxed">
                AI detects anatomical body landmarks and computes shoulder width, chest, waist, and hip dimensions.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E4E9F2] shadow-xs relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#F5F7FC] text-[#3569FF] flex items-center justify-center font-bold text-lg">
                <User className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-[#66738D]">Step 03</span>
              <h3 className="text-base font-bold text-[#101C3A]">Create Your 3D Avatar</h3>
              <p className="text-xs text-[#66738D] leading-relaxed">
                Generate an interactive personalized 3D body model matched to your exact proportions and skin tone.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E4E9F2] shadow-xs relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#F5F7FC] text-[#3569FF] flex items-center justify-center font-bold text-lg">
                <Shirt className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-[#66738D]">Step 04</span>
              <h3 className="text-base font-bold text-[#101C3A]">Try Different Styles</h3>
              <p className="text-xs text-[#66738D] leading-relaxed">
                Explore clothing designs, colors, patterns, and drape fits directly on your 3D digital self.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => onRouteChange('measure')}
            className="px-6 py-3 bg-[#101C3A] hover:bg-[#1E293B] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Create Your FitMe Avatar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 3. SIX PREMIUM FEATURE CARDS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <p className="text-xs font-semibold text-[#3569FF] tracking-wider uppercase">
            Platform Capabilities
          </p>
          <h2 className="text-3xl font-extrabold text-[#101C3A]">
            Engineered for Precision & Style
          </h2>
          <p className="text-sm text-[#66738D]">
            Comprehensive technology bridging digital anthropometry and modern apparel visualization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-7 border border-[#E4E9F2] shadow-xs hover:border-[#3569FF]/50 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#3569FF] flex items-center justify-center">
                <Ruler className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#101C3A]">AI Body Measurements</h3>
              <p className="text-xs text-[#66738D] leading-relaxed">
                Discover estimated body measurements using computer vision and personalized height calibration.
              </p>
            </div>
            <div className="pt-5 border-t border-[#F1F4F9] mt-6">
              <button
                onClick={() => onRouteChange('measure')}
                className="text-xs font-semibold text-[#3569FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-7 border border-[#E4E9F2] shadow-xs hover:border-[#3569FF]/50 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#3569FF] flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#101C3A]">Live Camera Capture</h3>
              <p className="text-xs text-[#66738D] leading-relaxed">
                Capture your full-body photograph directly from your device camera with real-time pose guidance.
              </p>
            </div>
            <div className="pt-5 border-t border-[#F1F4F9] mt-6">
              <button
                onClick={() => onRouteChange('measure')}
                className="text-xs font-semibold text-[#3569FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-7 border border-[#E4E9F2] shadow-xs hover:border-[#3569FF]/50 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#3569FF] flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#101C3A]">Personalized 3D Avatar</h3>
              <p className="text-xs text-[#66738D] leading-relaxed">
                Generate an interactive 3D body model based on your measurements and available image information.
              </p>
            </div>
            <div className="pt-5 border-t border-[#F1F4F9] mt-6">
              <button
                onClick={() => onRouteChange('avatar')}
                className="text-xs font-semibold text-[#3569FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl p-7 border border-[#E4E9F2] shadow-xs hover:border-[#3569FF]/50 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#3569FF] flex items-center justify-center">
                <Shirt className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#101C3A]">Virtual Clothing Try-On</h3>
              <p className="text-xs text-[#66738D] leading-relaxed">
                Try different clothing categories and designs on your personalized 3D avatar with 360° inspection.
              </p>
            </div>
            <div className="pt-5 border-t border-[#F1F4F9] mt-6">
              <button
                onClick={() => onRouteChange('try-on')}
                className="text-xs font-semibold text-[#3569FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-2xl p-7 border border-[#E4E9F2] shadow-xs hover:border-[#3569FF]/50 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#3569FF] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#101C3A]">Smart Fit Recommendations</h3>
              <p className="text-xs text-[#66738D] leading-relaxed">
                Explore clothing sizes and fit recommendations based on available body measurements and garment size charts.
              </p>
            </div>
            <div className="pt-5 border-t border-[#F1F4F9] mt-6">
              <button
                onClick={() => onRouteChange('features')}
                className="text-xs font-semibold text-[#3569FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-2xl p-7 border border-[#E4E9F2] shadow-xs hover:border-[#3569FF]/50 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#3569FF] flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#101C3A]">Measurement History</h3>
              <p className="text-xs text-[#66738D] leading-relaxed">
                Save, compare, and manage previous measurements and personalized outfits over time with uniform alignment.
              </p>
            </div>
            <div className="pt-5 border-t border-[#F1F4F9] mt-6">
              <button
                onClick={() => onRouteChange('history')}
                className="text-xs font-semibold text-[#3569FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VIRTUAL TRY-ON SHOWCASE */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#101C3A] text-white rounded-3xl p-6 sm:p-10 lg:p-12 overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Showcase Controls */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#3569FF] uppercase tracking-wider">
                  Interactive Studio Showcase
                </p>
                <h2 className="text-3xl font-extrabold text-white">
                  Try It Before You Buy It.
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Explore different styles and see how they look on your personalized 3D avatar.
                </p>
              </div>

              {/* Category Pills (Functional filter buttons) */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-slate-400">Garment Category:</span>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORY_LABELS.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        const match = GARMENT_CATALOG.find((g) => g.category === cat.id);
                        if (match) setSelectedColor(match.defaultColor);
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-[#3569FF] text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Swatches */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-slate-400">Fabric Color:</span>
                <div className="flex items-center gap-2">
                  {activeGarment.palette.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                        selectedColor === color
                          ? 'border-white scale-110 shadow-md'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Active Garment Info Card */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                <p className="text-xs font-bold text-white">{activeGarment.name}</p>
                <p className="text-[11px] text-slate-300 capitalize">
                  {activeGarment.fabricType} weave · {activeGarment.fitType} fit · Size {activeGarment.size}
                </p>
                <p className="text-[11px] text-slate-400 pt-1">{activeGarment.description}</p>
              </div>

              <div>
                <button
                  onClick={() => onRouteChange('try-on')}
                  className="px-6 py-3 bg-[#3569FF] hover:bg-[#2554db] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Enter Try-On Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Interactive 3D Avatar Centerpiece */}
            <div className="lg:col-span-7">
              <div className="h-[480px] rounded-2xl overflow-hidden bg-[#F5F7FC] shadow-2xl relative">
                <Avatar3DViewer
                  avatarConfig={avatarConfig}
                  selectedTop={
                    selectedCategory === 't-shirts' || selectedCategory === 'shirts'
                      ? { ...activeGarment, selectedColor }
                      : undefined
                  }
                  selectedBottom={
                    selectedCategory === 'jeans' || selectedCategory === 'trousers'
                      ? { ...activeGarment, selectedColor }
                      : {
                          ...GARMENT_CATALOG.find((g) => g.id === 'garment_trouser_wool')!,
                          selectedColor: '#334155'
                        }
                  }
                  selectedOuterwear={
                    selectedCategory === 'jackets' ||
                    selectedCategory === 'hoodies' ||
                    selectedCategory === 'formal' ||
                    selectedCategory === 'traditional'
                      ? { ...activeGarment, selectedColor }
                      : undefined
                  }
                  height="100%"
                  showControls={true}
                  autoRotateDefault={true}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY FITME COMPARISON SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <p className="text-xs font-semibold text-[#3569FF] tracking-wider uppercase">
            The FitMe Advantage
          </p>
          <h2 className="text-3xl font-extrabold text-[#101C3A]">
            Personalized Fashion Starts With Knowing Your Fit.
          </h2>
          <p className="text-sm text-[#66738D]">
            See how FitMe transforms uncertain garment sizing into confidence.
          </p>
        </div>

        {/* Comparison Table Card */}
        <div className="bg-white rounded-2xl border border-[#E4E9F2] shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E4E9F2]">
            {/* Traditional Generic Experience */}
            <div className="p-8 space-y-6 bg-slate-50/50">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#66738D]">Conventional Shopping</span>
                <h3 className="text-lg font-bold text-[#101C3A]">Generic Size Charts</h3>
              </div>

              <ul className="space-y-4 text-xs text-[#66738D]">
                <li className="flex items-start gap-3">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Ambiguous sizing charts based on standardized mannequins.</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>High return rates and shipping waste due to incorrect garment fit.</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Unable to see how sleeve drape and hem lengths fall on your actual frame.</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Manual measuring tapes that are awkward and error-prone to use alone.</span>
                </li>
              </ul>
            </div>

            {/* FitMe Experience */}
            <div className="p-8 space-y-6 bg-white">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#3569FF]">FitMe Platform</span>
                <h3 className="text-lg font-bold text-[#101C3A]">Personalized 3D Fitting</h3>
              </div>

              <ul className="space-y-4 text-xs text-[#15213D]">
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#3569FF] shrink-0 mt-0.5" />
                  <span className="font-medium">Understand your precise calibrated body proportions in seconds.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#3569FF] shrink-0 mt-0.5" />
                  <span className="font-medium">Visualize outfits on your exact digital 3D avatar from 360 degrees.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#3569FF] shrink-0 mt-0.5" />
                  <span className="font-medium">Save favourite styling combinations and access measurements anytime.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#3569FF] shrink-0 mt-0.5" />
                  <span className="font-medium">Make more informed clothing-size decisions before ordering.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL-TO-ACTION SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#101C3A] rounded-3xl p-8 sm:p-14 text-center text-white space-y-6 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Find Your Perfect Fit?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Your measurements, your avatar, your style. Start your personalized fashion journey today.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={handleCtaClick}
              className="px-6 py-3.5 bg-[#3569FF] hover:bg-[#2554db] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Create Your Free Account
            </button>
            <button
              onClick={() => onRouteChange('how-it-works')}
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Explore FitMe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
