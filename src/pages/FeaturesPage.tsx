import React from 'react';
import {
  Ruler,
  Camera,
  User,
  Shirt,
  Sparkles,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sliders
} from 'lucide-react';

interface FeaturesPageProps {
  onRouteChange: (route: string) => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  isAuthenticated: boolean;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({
  onRouteChange,
  onOpenAuth,
  isAuthenticated
}) => {
  const handleFeatureClick = (targetRoute: string) => {
    if (isAuthenticated) onRouteChange(targetRoute);
    else onOpenAuth('signup');
  };

  const features = [
    {
      id: 'measure',
      icon: Ruler,
      title: 'AI Body Measurements',
      tagline: 'Computer Vision & Height Calibration',
      description:
        'Discover estimated body measurements using computer vision and personalized height calibration. Analyzes shoulder width, chest, waist, and hips with documented confidence intervals.',
      details: [
        'Anatomical landmark detection across 33 key joints and contours',
        'Transparent uncertainty margins (e.g. ±1.2 cm) for circumferences',
        'Customizable calibration scale based on true standing stature'
      ],
      route: 'measure',
      actionText: 'Launch Body Scanner'
    },
    {
      id: 'camera',
      icon: Camera,
      title: 'Live Camera Capture',
      tagline: 'Instant On-Device Image Processing',
      description:
        'Capture your full-body photograph directly from your smartphone or desktop webcam with real-time pose guidance and lighting validation.',
      details: [
        'Instant ambient lighting & background contrast quality check',
        'Interactive silhouette framing guide to ensure unclipped head and feet',
        'Zero photo upload to external servers—processed locally in memory'
      ],
      route: 'measure',
      actionText: 'Open Live Camera'
    },
    {
      id: 'avatar',
      icon: User,
      title: 'Personalized 3D Avatar',
      tagline: 'Real-Time WebGL Parametric Geometry',
      description:
        'Generate an interactive 3D body model based on your measurements and available image information. Rotate 360 degrees and inspect front, side, and back views.',
      details: [
        'Real-time anatomical adjustment of chest, waist, hips, and limbs',
        'Customizable skin tones with physically accurate subsurface roughness',
        'Preset camera viewpoints (Front, Side, Back) with smooth damping'
      ],
      route: 'avatar',
      actionText: 'Customize 3D Avatar'
    },
    {
      id: 'tryon',
      icon: Shirt,
      title: 'Virtual Clothing Try-On',
      tagline: 'Procedural 3D Garments & Draping',
      description:
        'Try different clothing categories and designs on your personalized 3D avatar. Explore tailored blazers, shirts, tees, jeans, and formal wear.',
      details: [
        'Actual 3D procedural garment models, not flat photo collages',
        'Multi-color palettes, realistic fabric textures (denim, wool, cotton)',
        'Mix-and-match complete outfits and inspect fit from every angle'
      ],
      route: 'try-on',
      actionText: 'Open Try-On Studio'
    },
    {
      id: 'smartfit',
      icon: Sparkles,
      title: 'Smart Fit Recommendations',
      tagline: 'Intelligent Garment Sizing Guidance',
      description:
        'Explore clothing sizes and fit recommendations based on available body measurements and garment size charts for confident shopping decisions.',
      details: [
        'Size chart translation across XS, S, M, L, XL, XXL standards',
        'Fit style adaptation (Slim Fit, Regular Fit, Relaxed, Oversized)',
        'Actionable tailoring tips for sleeve length and break line'
      ],
      route: 'try-on',
      actionText: 'Explore Fit Advice'
    },
    {
      id: 'history',
      icon: Compass,
      title: 'Measurement History & Saved Outfits',
      tagline: 'Track Progress & Curated Looks',
      description:
        'Save, compare, and manage previous measurements and personalized outfits over time using a clean, uniform CSS Grid dashboard.',
      details: [
        'Aligned cards displaying timestamp, clothing category, and metrics',
        'Side-by-side metric comparison to observe body shape changes',
        'One-click reload of favourite virtual styling ensembles'
      ],
      route: 'history',
      actionText: 'View History & Outfits'
    }
  ];

  return (
    <div className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <p className="text-xs font-semibold text-[#3569FF] uppercase tracking-wider">
          Complete Feature Suite
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#101C3A] tracking-tight">
          Everything You Need for the Perfect Fit
        </h1>
        <p className="text-sm sm:text-base text-[#66738D] leading-relaxed">
          From precise calibrated measurements to 3D virtual dressing and wardrobe management,
          FitMe powers a seamless personal fashion experience.
        </p>
      </div>

      {/* 6 Features List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.id}
              className="bg-white rounded-2xl p-7 border border-[#E4E9F2] shadow-xs hover:border-[#3569FF]/50 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#3569FF] flex items-center justify-center group-hover:bg-[#3569FF] group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-[#66738D] uppercase tracking-wider">
                    {feat.tagline}
                  </span>
                  <h3 className="text-lg font-bold text-[#101C3A] mt-1">{feat.title}</h3>
                </div>
                <p className="text-xs text-[#66738D] leading-relaxed">{feat.description}</p>

                <ul className="space-y-2 pt-2 border-t border-[#F1F4F9] text-xs text-[#15213D]">
                  {feat.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3569FF] shrink-0 mt-0.5" />
                      <span className="text-[11px] text-slate-700">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-[#F1F4F9]">
                <button
                  onClick={() => handleFeatureClick(feat.route)}
                  className="w-full py-2.5 px-4 bg-[#F5F7FC] hover:bg-[#3569FF] hover:text-white text-[#101C3A] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{feat.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="bg-[#101C3A] rounded-3xl p-10 text-center text-white space-y-4">
        <h2 className="text-2xl font-bold">Ready to Put FitMe to Work?</h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          Create your account today or explore with our interactive demo profile to see how easy virtual fitting can be.
        </p>
        <button
          onClick={() => handleFeatureClick('measure')}
          className="px-6 py-3 bg-[#3569FF] hover:bg-[#2554db] text-white text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Start Measuring Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
