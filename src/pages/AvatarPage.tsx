import React, { useState } from 'react';
import { AvatarConfig } from '../types';
import { Avatar3DViewer } from '../components/3d/Avatar3DViewer';
import { StorageService } from '../services/storage';
import confetti from 'canvas-confetti';
import {
  User,
  Sparkles,
  Check,
  RotateCw,
  Palette,
  Scissors,
  Sliders,
  ArrowRight,
  Shirt,
  Save
} from 'lucide-react';

interface AvatarPageProps {
  avatarConfig: AvatarConfig;
  onUpdateAvatarConfig: (config: AvatarConfig) => void;
  onRouteChange: (route: string) => void;
}

const SKIN_TONES = [
  { label: 'Fair Ivory', hex: '#F7D0B3' },
  { label: 'Warm Sand', hex: '#E8B98A' },
  { label: 'Honey Beige', hex: '#E0AC69' },
  { label: 'Golden Tan', hex: '#C68642' },
  { label: 'Rich Chestnut', hex: '#8D5524' },
  { label: 'Deep Espresso', hex: '#4A2E1B' }
];

const HAIR_STYLES: { id: AvatarConfig['hairStyle']; label: string }[] = [
  { id: 'buzz', label: 'Buzz Cut' },
  { id: 'short', label: 'Classic Short' },
  { id: 'parted', label: 'Side Part' },
  { id: 'bob', label: 'Modern Bob' },
  { id: 'long', label: 'Shoulder Length' },
  { id: 'ponytail', label: 'High Ponytail' }
];

const HAIR_COLORS = [
  { label: 'Jet Black', hex: '#171717' },
  { label: 'Dark Brown', hex: '#2C1D11' },
  { label: 'Chestnut', hex: '#533422' },
  { label: 'Golden Blonde', hex: '#D4AF37' },
  { label: 'Silver Gray', hex: '#94A3B8' }
];

export const AvatarPage: React.FC<AvatarPageProps> = ({
  avatarConfig,
  onUpdateAvatarConfig,
  onRouteChange
}) => {
  const [config, setConfig] = useState<AvatarConfig>(avatarConfig);
  const [activeTab, setActiveTab] = useState<'appearance' | 'proportions'>('appearance');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSliderChange = (field: keyof AvatarConfig, value: number) => {
    const updated = { ...config, [field]: value };
    setConfig(updated);
    onUpdateAvatarConfig(updated);
    setSaveSuccess(false);
  };

  const handleSave = () => {
    StorageService.saveAvatarConfig(config);
    onUpdateAvatarConfig(config);
    setSaveSuccess(true);
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#3569FF]">
            <span>Personalized 3D Body Studio</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#66738D]">WebGL Parametric Anatomical Mesh</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#101C3A]">
            Customize Your 3D Avatar
          </h1>
          <p className="text-xs sm:text-sm text-[#66738D]">
            Adjust proportions, complexion, and hairstyles to create an accurate digital reflection of yourself.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onRouteChange('try-on')}
            className="px-5 py-2.5 bg-[#3569FF] hover:bg-[#2554db] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Shirt className="w-4 h-4" />
            <span>Virtual Try-On Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive 3D Canvas */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E4E9F2] shadow-xs p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F1F4F9]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3569FF]" />
              <span className="text-xs font-semibold text-[#101C3A]">360° Interactive Canvas</span>
            </div>
            <span className="text-xs text-[#66738D]">Click and drag to inspect</span>
          </div>

          <div className="h-[520px] rounded-2xl overflow-hidden bg-[#F5F7FC]">
            <Avatar3DViewer
              avatarConfig={config}
              height="100%"
              showControls={true}
              autoRotateDefault={false}
            />
          </div>
        </div>

        {/* Right Column: Customization Controls Panel */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E4E9F2] shadow-xs p-6 space-y-6">
          {/* Tabs: Appearance vs Proportions */}
          <div className="grid grid-cols-2 gap-1 bg-[#F5F7FC] p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('appearance')}
              className={`py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'appearance'
                  ? 'bg-white text-[#101C3A] shadow-xs'
                  : 'text-[#66738D] hover:text-[#101C3A]'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Appearance</span>
            </button>
            <button
              onClick={() => setActiveTab('proportions')}
              className={`py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'proportions'
                  ? 'bg-white text-[#101C3A] shadow-xs'
                  : 'text-[#66738D] hover:text-[#101C3A]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Body Proportions</span>
            </button>
          </div>

          {activeTab === 'appearance' ? (
            <div className="space-y-6">
              {/* Skin Tone Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#101C3A]">
                  Skin Tone Complexion
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SKIN_TONES.map((tone) => (
                    <button
                      key={tone.hex}
                      onClick={() => {
                        const updated = { ...config, skinTone: tone.hex };
                        setConfig(updated);
                        onUpdateAvatarConfig(updated);
                      }}
                      className={`p-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                        config.skinTone === tone.hex
                          ? 'border-[#3569FF] ring-2 ring-[#3569FF]/20 bg-blue-50/30'
                          : 'border-[#E4E9F2] hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: tone.hex }}
                      />
                      <span className="text-[11px] font-medium text-[#101C3A] truncate">
                        {tone.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hairstyle Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#101C3A]">Hairstyle</label>
                <div className="grid grid-cols-2 gap-2">
                  {HAIR_STYLES.map((hair) => (
                    <button
                      key={hair.id}
                      onClick={() => {
                        const updated = { ...config, hairStyle: hair.id };
                        setConfig(updated);
                        onUpdateAvatarConfig(updated);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                        config.hairStyle === hair.id
                          ? 'border-[#3569FF] bg-blue-50/40 text-[#101C3A] font-semibold'
                          : 'border-[#E4E9F2] text-[#66738D] hover:text-[#101C3A]'
                      }`}
                    >
                      <span className="text-xs">{hair.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair Color Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#101C3A]">Hair Color</label>
                <div className="flex items-center gap-2">
                  {HAIR_COLORS.map((hc) => (
                    <button
                      key={hc.hex}
                      onClick={() => {
                        const updated = { ...config, hairColor: hc.hex };
                        setConfig(updated);
                        onUpdateAvatarConfig(updated);
                      }}
                      className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                        config.hairColor === hc.hex
                          ? 'border-[#3569FF] scale-110 shadow-xs'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: hc.hex }}
                      title={hc.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Proportions Sliders */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#101C3A]">Shoulder Breadth</span>
                  <span className="font-mono text-[#66738D] tabular-nums">
                    {Math.round(config.shoulderRatio * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0.85}
                  max={1.25}
                  step={0.01}
                  value={config.shoulderRatio}
                  onChange={(e) => handleSliderChange('shoulderRatio', parseFloat(e.target.value))}
                  className="w-full accent-[#3569FF]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#101C3A]">Chest Prominence</span>
                  <span className="font-mono text-[#66738D] tabular-nums">
                    {Math.round(config.chestScale * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0.85}
                  max={1.30}
                  step={0.01}
                  value={config.chestScale}
                  onChange={(e) => handleSliderChange('chestScale', parseFloat(e.target.value))}
                  className="w-full accent-[#3569FF]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#101C3A]">Waist Definition</span>
                  <span className="font-mono text-[#66738D] tabular-nums">
                    {Math.round(config.waistScale * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0.75}
                  max={1.30}
                  step={0.01}
                  value={config.waistScale}
                  onChange={(e) => handleSliderChange('waistScale', parseFloat(e.target.value))}
                  className="w-full accent-[#3569FF]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#101C3A]">Hip & Pelvis Breadth</span>
                  <span className="font-mono text-[#66738D] tabular-nums">
                    {Math.round(config.hipScale * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0.80}
                  max={1.30}
                  step={0.01}
                  value={config.hipScale}
                  onChange={(e) => handleSliderChange('hipScale', parseFloat(e.target.value))}
                  className="w-full accent-[#3569FF]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#101C3A]">Arm Musculature</span>
                  <span className="font-mono text-[#66738D] tabular-nums">
                    {Math.round(config.armScale * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0.85}
                  max={1.20}
                  step={0.01}
                  value={config.armScale}
                  onChange={(e) => handleSliderChange('armScale', parseFloat(e.target.value))}
                  className="w-full accent-[#3569FF]"
                />
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-4 border-t border-[#F1F4F9]">
            <button
              onClick={handleSave}
              className="w-full py-2.5 px-4 bg-[#101C3A] hover:bg-[#1E293B] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Avatar Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Avatar Configuration</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
