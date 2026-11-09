import React, { useState } from 'react';
import { MeasurementRecord, SavedOutfit } from '../types';
import {
  Ruler,
  Shirt,
  Calendar,
  Trash2,
  GitCompare,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  X
} from 'lucide-react';

interface HistoryPageProps {
  measurements: MeasurementRecord[];
  savedOutfits: SavedOutfit[];
  onDeleteMeasurement: (id: string) => void;
  onDeleteOutfit: (id: string) => void;
  onRouteChange: (route: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  measurements,
  savedOutfits,
  onDeleteMeasurement,
  onDeleteOutfit,
  onRouteChange
}) => {
  const [activeTab, setActiveTab] = useState<'measurements' | 'outfits'>('measurements');
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState<boolean>(false);

  const toggleSelectForComparison = (id: string) => {
    if (selectedForComparison.includes(id)) {
      setSelectedForComparison(selectedForComparison.filter((item) => item !== id));
    } else {
      if (selectedForComparison.length >= 2) {
        // Replace second
        setSelectedForComparison([selectedForComparison[0], id]);
      } else {
        setSelectedForComparison([...selectedForComparison, id]);
      }
    }
  };

  const comparedRecords = measurements.filter((m) => selectedForComparison.includes(m.id));

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#3569FF]">
            <span>Personal Body Records & Lookbook</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#66738D]">Uniform Aligned CSS Grid Layout</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#101C3A]">
            History & Saved Designs
          </h1>
          <p className="text-xs sm:text-sm text-[#66738D]">
            Review your previously calibrated body scans and reload your saved 3D outfit combinations.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E4E9F2] shadow-xs">
          <button
            onClick={() => setActiveTab('measurements')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'measurements'
                ? 'bg-[#101C3A] text-white'
                : 'text-[#66738D] hover:text-[#101C3A]'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Measurements ({measurements.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('outfits')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'outfits'
                ? 'bg-[#101C3A] text-white'
                : 'text-[#66738D] hover:text-[#101C3A]'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>Saved Outfits ({savedOutfits.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'measurements' ? (
        <div className="space-y-6">
          {/* Comparison Action Bar */}
          <div className="bg-white rounded-2xl p-4 border border-[#E4E9F2] shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#101C3A]">
              <GitCompare className="w-4 h-4 text-[#3569FF]" />
              <span className="font-bold">Compare Records:</span>
              <span className="text-[#66738D]">
                Select any 2 scans to see dimensional variance side-by-side (
                {selectedForComparison.length}/2 selected)
              </span>
            </div>

            <div className="flex items-center gap-2">
              {selectedForComparison.length > 0 && (
                <button
                  onClick={() => setSelectedForComparison([])}
                  className="px-3 py-1.5 text-xs text-[#66738D] hover:text-[#101C3A]"
                >
                  Clear Selection
                </button>
              )}
              <button
                disabled={selectedForComparison.length !== 2}
                onClick={() => setShowComparisonModal(true)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  selectedForComparison.length === 2
                    ? 'bg-[#3569FF] text-white hover:bg-[#2554db] shadow-xs cursor-pointer'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Launch Side-by-Side Comparison</span>
              </button>
            </div>
          </div>

          {/* UNIFORM CSS GRID LAYOUT FOR MEASUREMENTS (Mandatory UI Fix) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {measurements.map((record) => {
              const isSelected = selectedForComparison.includes(record.id);
              return (
                <div
                  key={record.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-[#3569FF] ring-2 ring-[#3569FF]/20'
                      : 'border-[#E4E9F2] hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header: Date, Category and Select Checkbox */}
                    <div className="flex items-start justify-between pb-3 border-b border-[#F1F4F9]">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#66738D]">
                          <Calendar className="w-3.5 h-3.5 text-[#3569FF]" />
                          <span className="font-mono">{record.date}</span>
                        </div>
                        <p className="text-xs font-bold text-[#101C3A] capitalize">
                          Category: {record.clothingCategory}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleSelectForComparison(record.id)}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#3569FF] text-white border-[#3569FF]'
                              : 'bg-[#F5F7FC] text-[#66738D] border-[#E4E9F2] hover:bg-slate-100'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Compare'}
                        </button>
                        <button
                          onClick={() => onDeleteMeasurement(record.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Uniform 2x3 Metric Figures Grid */}
                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                      <div className="p-2.5 rounded-xl bg-[#F5F7FC] border border-[#E4E9F2]">
                        <span className="text-[10px] text-[#66738D] block">Height</span>
                        <span className="font-mono font-bold text-[#101C3A] tabular-nums text-sm">
                          {record.measurements.heightCm} cm
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#F5F7FC] border border-[#E4E9F2]">
                        <span className="text-[10px] text-[#66738D] block">Shoulder Width</span>
                        <span className="font-mono font-bold text-[#101C3A] tabular-nums text-sm">
                          {record.measurements.shoulderWidthCm} cm
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#F5F7FC] border border-[#E4E9F2]">
                        <span className="text-[10px] text-[#66738D] block">Chest Circumference</span>
                        <span className="font-mono font-bold text-[#101C3A] tabular-nums text-sm">
                          {record.measurements.chestCircumferenceCm} cm
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#F5F7FC] border border-[#E4E9F2]">
                        <span className="text-[10px] text-[#66738D] block">Waist Circumference</span>
                        <span className="font-mono font-bold text-[#101C3A] tabular-nums text-sm">
                          {record.measurements.waistCircumferenceCm} cm
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#F5F7FC] border border-[#E4E9F2]">
                        <span className="text-[10px] text-[#66738D] block">Hip Circumference</span>
                        <span className="font-mono font-bold text-[#101C3A] tabular-nums text-sm">
                          {record.measurements.hipCircumferenceCm} cm
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#F5F7FC] border border-[#E4E9F2]">
                        <span className="text-[10px] text-[#66738D] block">Arm Length</span>
                        <span className="font-mono font-bold text-[#101C3A] tabular-nums text-sm">
                          {record.measurements.armLengthCm} cm
                        </span>
                      </div>
                    </div>

                    {record.notes && (
                      <p className="text-[11px] text-[#66738D] line-clamp-1 italic">
                        &ldquo;{record.notes}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Card Footer with Confidence & Uncertainty */}
                  <div className="pt-3 mt-3 border-t border-[#F1F4F9] flex items-center justify-between text-[11px]">
                    <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {record.measurements.confidenceScore}% Confidence
                    </span>
                    <span className="text-[#66738D]">
                      Uncertainty: ±{record.measurements.uncertaintyMarginCm} cm
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* SAVED OUTFITS UNIFORM CSS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {savedOutfits.map((outfit) => (
            <div
              key={outfit.id}
              className="bg-white rounded-2xl border border-[#E4E9F2] p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between pb-3 border-b border-[#F1F4F9]">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-[#3569FF] uppercase tracking-wider">
                      {outfit.overallCategory}
                    </span>
                    <h3 className="text-sm font-bold text-[#101C3A] truncate">{outfit.name}</h3>
                    <p className="text-[11px] text-[#66738D] font-mono">{outfit.date}</p>
                  </div>
                  <button
                    onClick={() => onDeleteOutfit(outfit.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete outfit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Outfit Items Breakdown */}
                <div className="space-y-2 text-xs">
                  {outfit.topGarment && (
                    <div className="p-2.5 rounded-xl bg-[#F5F7FC] border border-[#E4E9F2] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: outfit.topGarment.selectedColor }}
                        />
                        <span className="font-medium text-[#101C3A]">{outfit.topGarment.name}</span>
                      </div>
                      <span className="text-[10px] text-[#66738D]">Top</span>
                    </div>
                  )}

                  {outfit.bottomGarment && (
                    <div className="p-2.5 rounded-xl bg-[#F5F7FC] border border-[#E4E9F2] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: outfit.bottomGarment.selectedColor }}
                        />
                        <span className="font-medium text-[#101C3A]">{outfit.bottomGarment.name}</span>
                      </div>
                      <span className="text-[10px] text-[#66738D]">Bottom</span>
                    </div>
                  )}

                  {outfit.outerwearGarment && (
                    <div className="p-2.5 rounded-xl bg-[#F5F7FC] border border-[#E4E9F2] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: outfit.outerwearGarment.selectedColor }}
                        />
                        <span className="font-medium text-[#101C3A]">{outfit.outerwearGarment.name}</span>
                      </div>
                      <span className="text-[10px] text-[#66738D]">Outerwear</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#F1F4F9]">
                <button
                  onClick={() => onRouteChange('try-on')}
                  className="w-full py-2.5 px-3 bg-[#3569FF] hover:bg-[#2554db] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>Open in Virtual Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comparison Modal */}
      {showComparisonModal && comparedRecords.length === 2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-[#E4E9F2] shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F4F9]">
              <div className="flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-[#3569FF]" />
                <h3 className="text-base font-bold text-[#101C3A]">
                  Side-by-Side Measurement Comparison
                </h3>
              </div>
              <button
                onClick={() => setShowComparisonModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#E4E9F2] text-[#66738D]">
                    <th className="text-left py-2 font-medium">Dimension</th>
                    <th className="text-center py-2 font-medium">
                      Scan 1 ({comparedRecords[0].date})
                    </th>
                    <th className="text-center py-2 font-medium">
                      Scan 2 ({comparedRecords[1].date})
                    </th>
                    <th className="text-right py-2 font-medium">Variance (Δ)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F4F9] font-mono">
                  {[
                    {
                      label: 'Height',
                      v1: comparedRecords[0].measurements.heightCm,
                      v2: comparedRecords[1].measurements.heightCm
                    },
                    {
                      label: 'Shoulder Width',
                      v1: comparedRecords[0].measurements.shoulderWidthCm,
                      v2: comparedRecords[1].measurements.shoulderWidthCm
                    },
                    {
                      label: 'Chest Circumference',
                      v1: comparedRecords[0].measurements.chestCircumferenceCm,
                      v2: comparedRecords[1].measurements.chestCircumferenceCm
                    },
                    {
                      label: 'Waist Circumference',
                      v1: comparedRecords[0].measurements.waistCircumferenceCm,
                      v2: comparedRecords[1].measurements.waistCircumferenceCm
                    },
                    {
                      label: 'Hip Circumference',
                      v1: comparedRecords[0].measurements.hipCircumferenceCm,
                      v2: comparedRecords[1].measurements.hipCircumferenceCm
                    },
                    {
                      label: 'Arm Length',
                      v1: comparedRecords[0].measurements.armLengthCm,
                      v2: comparedRecords[1].measurements.armLengthCm
                    }
                  ].map((row) => {
                    const diff = Math.round((row.v2 - row.v1) * 10) / 10;
                    return (
                      <tr key={row.label} className="hover:bg-slate-50/50">
                        <td className="py-2.5 font-sans font-medium text-[#101C3A]">
                          {row.label}
                        </td>
                        <td className="py-2.5 text-center text-[#15213D]">{row.v1} cm</td>
                        <td className="py-2.5 text-center text-[#15213D]">{row.v2} cm</td>
                        <td
                          className={`py-2.5 text-right font-bold ${
                            diff > 0 ? 'text-amber-600' : diff < 0 ? 'text-emerald-600' : 'text-slate-400'
                          }`}
                        >
                          {diff > 0 ? `+${diff}` : diff} cm
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowComparisonModal(false)}
                className="px-5 py-2.5 bg-[#101C3A] text-white text-xs font-semibold rounded-xl hover:bg-[#1E293B]"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
