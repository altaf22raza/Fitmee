import React from 'react';
import { UserProfile, MeasurementRecord, SavedOutfit, AvatarConfig } from '../types';
import { Avatar3DViewer } from '../components/3d/Avatar3DViewer';
import {
  Camera,
  Upload,
  Ruler,
  User,
  Shirt,
  Sparkles,
  ArrowRight,
  Clock,
  Compass,
  ChevronRight,
  TrendingDown
} from 'lucide-react';

interface DashboardPageProps {
  user: UserProfile;
  measurements: MeasurementRecord[];
  savedOutfits: SavedOutfit[];
  avatarConfig: AvatarConfig;
  onRouteChange: (route: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  measurements,
  savedOutfits,
  avatarConfig,
  onRouteChange
}) => {
  const latestRecord = measurements[0];

  return (
    <div className="py-8 md:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl border border-[#E4E9F2] shadow-xs p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#3569FF]">
            <span>Personal Fashion Dashboard</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#66738D]">Height: {user.heightCm} cm</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101C3A]">
            Welcome back, {user.name}!
          </h1>
          <p className="text-xs sm:text-sm text-[#66738D]">
            Your digital 3D avatar is calibrated and ready for virtual try-on.
          </p>
        </div>

        {/* Quick Scan Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onRouteChange('measure')}
            className="px-5 py-2.5 bg-[#3569FF] hover:bg-[#2554db] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>New Measurement Scan</span>
          </button>
        </div>
      </div>

      {/* Quick Action Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <button
          onClick={() => onRouteChange('measure')}
          className="p-4 bg-white rounded-2xl border border-[#E4E9F2] hover:border-[#3569FF]/50 shadow-xs text-left transition-all group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#3569FF] flex items-center justify-center mb-3 group-hover:bg-[#3569FF] group-hover:text-white transition-colors">
            <Camera className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-[#101C3A]">Capture Photo</p>
          <p className="text-[11px] text-[#66738D]">Use device camera</p>
        </button>

        <button
          onClick={() => onRouteChange('measure')}
          className="p-4 bg-white rounded-2xl border border-[#E4E9F2] hover:border-[#3569FF]/50 shadow-xs text-left transition-all group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#3569FF] flex items-center justify-center mb-3 group-hover:bg-[#3569FF] group-hover:text-white transition-colors">
            <Upload className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-[#101C3A]">Upload Photo</p>
          <p className="text-[11px] text-[#66738D]">From device storage</p>
        </button>

        <button
          onClick={() => onRouteChange('measure')}
          className="p-4 bg-white rounded-2xl border border-[#E4E9F2] hover:border-[#3569FF]/50 shadow-xs text-left transition-all group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#3569FF] flex items-center justify-center mb-3 group-hover:bg-[#3569FF] group-hover:text-white transition-colors">
            <Ruler className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-[#101C3A]">Generate Metrics</p>
          <p className="text-[11px] text-[#66738D]">AI body landmarking</p>
        </button>

        <button
          onClick={() => onRouteChange('avatar')}
          className="p-4 bg-white rounded-2xl border border-[#E4E9F2] hover:border-[#3569FF]/50 shadow-xs text-left transition-all group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#3569FF] flex items-center justify-center mb-3 group-hover:bg-[#3569FF] group-hover:text-white transition-colors">
            <User className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-[#101C3A]">3D Avatar</p>
          <p className="text-[11px] text-[#66738D]">Sculpt proportions</p>
        </button>

        <button
          onClick={() => onRouteChange('try-on')}
          className="p-4 bg-white rounded-2xl border border-[#E4E9F2] hover:border-[#3569FF]/50 shadow-xs text-left transition-all group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#3569FF] flex items-center justify-center mb-3 group-hover:bg-[#3569FF] group-hover:text-white transition-colors">
            <Shirt className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-[#101C3A]">Explore Designs</p>
          <p className="text-[11px] text-[#66738D]">Virtual Try-On</p>
        </button>
      </div>

      {/* Main Grid: 3D Avatar Centerpiece & Latest Measurements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive 3D Avatar Widget */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E4E9F2] shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F4F9]">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#3569FF]" />
              <h2 className="text-sm font-bold text-[#101C3A]">My 3D Avatar</h2>
            </div>
            <button
              onClick={() => onRouteChange('avatar')}
              className="text-xs font-semibold text-[#3569FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Customize</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-[360px] rounded-2xl overflow-hidden bg-[#F5F7FC]">
            <Avatar3DViewer
              avatarConfig={avatarConfig}
              height="100%"
              showControls={false}
              autoRotateDefault={true}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-[#66738D] pt-1">
            <span>Stature: {avatarConfig.heightCm} cm</span>
            <span className="capitalize">{avatarConfig.hairStyle} hair</span>
            <button
              onClick={() => onRouteChange('try-on')}
              className="font-semibold text-[#3569FF] hover:underline"
            >
              Dress in Studio →
            </button>
          </div>
        </div>

        {/* Right Column: Latest Calibrated Measurements & Statistics */}
        <div className="lg:col-span-7 space-y-6">
          {/* Latest Measurements Card */}
          <div className="bg-white rounded-3xl border border-[#E4E9F2] shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F4F9]">
              <div>
                <h2 className="text-sm font-bold text-[#101C3A]">Latest Calibrated Measurements</h2>
                <p className="text-xs text-[#66738D]">
                  {latestRecord ? `Recorded on ${latestRecord.date}` : 'No measurements on file'}
                </p>
              </div>
              <span className="text-xs font-mono font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                Confidence: {latestRecord ? `${latestRecord.measurements.confidenceScore}%` : 'N/A'}
              </span>
            </div>

            {latestRecord && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl bg-[#F5F7FC] border border-[#E4E9F2]">
                  <span className="text-[11px] text-[#66738D]">Shoulder Width</span>
                  <p className="text-xl font-bold font-mono text-[#101C3A] tabular-nums mt-1">
                    {latestRecord.measurements.shoulderWidthCm}{' '}
                    <span className="text-xs font-sans font-normal text-[#66738D]">cm</span>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F5F7FC] border border-[#E4E9F2]">
                  <span className="text-[11px] text-[#66738D]">Chest Circumference</span>
                  <p className="text-xl font-bold font-mono text-[#101C3A] tabular-nums mt-1">
                    {latestRecord.measurements.chestCircumferenceCm}{' '}
                    <span className="text-xs font-sans font-normal text-[#66738D]">cm</span>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F5F7FC] border border-[#E4E9F2]">
                  <span className="text-[11px] text-[#66738D]">Waist Circumference</span>
                  <p className="text-xl font-bold font-mono text-[#101C3A] tabular-nums mt-1">
                    {latestRecord.measurements.waistCircumferenceCm}{' '}
                    <span className="text-xs font-sans font-normal text-[#66738D]">cm</span>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F5F7FC] border border-[#E4E9F2]">
                  <span className="text-[11px] text-[#66738D]">Hip Circumference</span>
                  <p className="text-xl font-bold font-mono text-[#101C3A] tabular-nums mt-1">
                    {latestRecord.measurements.hipCircumferenceCm}{' '}
                    <span className="text-xs font-sans font-normal text-[#66738D]">cm</span>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F5F7FC] border border-[#E4E9F2]">
                  <span className="text-[11px] text-[#66738D]">Arm Length</span>
                  <p className="text-xl font-bold font-mono text-[#101C3A] tabular-nums mt-1">
                    {latestRecord.measurements.armLengthCm}{' '}
                    <span className="text-xs font-sans font-normal text-[#66738D]">cm</span>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F5F7FC] border border-[#E4E9F2]">
                  <span className="text-[11px] text-[#66738D]">Inseam</span>
                  <p className="text-xl font-bold font-mono text-[#101C3A] tabular-nums mt-1">
                    {latestRecord.measurements.inseamCm}{' '}
                    <span className="text-xs font-sans font-normal text-[#66738D]">cm</span>
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#66738D]">
                Uncertainty margin: ±{latestRecord?.measurements.uncertaintyMarginCm || 1.2} cm
              </span>
              <button
                onClick={() => onRouteChange('history')}
                className="text-xs font-semibold text-[#3569FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Measurement History ({measurements.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Saved Outfits Quick Bar */}
          <div className="bg-white rounded-3xl border border-[#E4E9F2] shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F4F9]">
              <div className="flex items-center gap-2">
                <Shirt className="w-4 h-4 text-[#3569FF]" />
                <h2 className="text-sm font-bold text-[#101C3A]">Saved Outfits ({savedOutfits.length})</h2>
              </div>
              <button
                onClick={() => onRouteChange('try-on')}
                className="text-xs font-semibold text-[#3569FF] hover:underline"
              >
                + New Outfit
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {savedOutfits.slice(0, 2).map((outfit) => (
                <div
                  key={outfit.id}
                  className="p-3.5 rounded-xl border border-[#E4E9F2] bg-[#F5F7FC] space-y-2 hover:border-[#3569FF]/50 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#101C3A] truncate">{outfit.name}</span>
                    <span className="text-[11px] text-[#66738D]">{outfit.date}</span>
                  </div>
                  <p className="text-[11px] text-[#66738D] capitalize">
                    Category: {outfit.overallCategory}
                  </p>
                  <button
                    onClick={() => onRouteChange('try-on')}
                    className="text-xs font-semibold text-[#3569FF] hover:underline pt-1 flex items-center gap-1"
                  >
                    <span>Load in Studio</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
