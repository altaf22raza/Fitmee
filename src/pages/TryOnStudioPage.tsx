import React, { useState } from 'react';
import {
  AvatarConfig,
  ClothingCategory,
  GarmentItem,
  SavedOutfit,
  BodyMeasurements
} from '../types';
import { Avatar3DViewer } from '../components/3d/Avatar3DViewer';
import { GARMENT_CATALOG, CATEGORY_LABELS } from '../services/garmentCatalog';
import { getSmartFitAdvice, StylingAdvice } from '../services/geminiService';
import { StorageService } from '../services/storage';
import confetti from 'canvas-confetti';
import {
  Shirt,
  Sparkles,
  Layers,
  Heart,
  Save,
  Check,
  RotateCw,
  Palette,
  Sliders,
  ChevronRight,
  Info,
  Maximize2
} from 'lucide-react';

interface TryOnStudioPageProps {
  avatarConfig: AvatarConfig;
  latestMeasurements?: BodyMeasurements;
  onSaveOutfit: (outfit: SavedOutfit) => void;
  onRouteChange: (route: string) => void;
}

export const TryOnStudioPage: React.FC<TryOnStudioPageProps> = ({
  avatarConfig,
  latestMeasurements,
  onSaveOutfit,
  onRouteChange
}) => {
  // Selected category & garment in studio
  const [activeCategory, setActiveCategory] = useState<ClothingCategory>('jackets');
  const [selectedTop, setSelectedTop] = useState<(GarmentItem & { selectedColor: string }) | undefined>({
    ...GARMENT_CATALOG.find((g) => g.id === 'garment_shirt_oxford')!,
    selectedColor: '#FFFFFF'
  });
  const [selectedBottom, setSelectedBottom] = useState<(GarmentItem & { selectedColor: string }) | undefined>({
    ...GARMENT_CATALOG.find((g) => g.id === 'garment_trouser_wool')!,
    selectedColor: '#101C3A'
  });
  const [selectedOuterwear, setSelectedOuterwear] = useState<(GarmentItem & { selectedColor: string }) | undefined>({
    ...GARMENT_CATALOG.find((g) => g.id === 'garment_jacket_blazer')!,
    selectedColor: '#101C3A'
  });

  // Current item being customized in panel
  const categoryGarments = GARMENT_CATALOG.filter((g) => g.category === activeCategory);
  const [currentGarment, setCurrentGarment] = useState<GarmentItem>(categoryGarments[0] || GARMENT_CATALOG[0]);
  const [currentColor, setCurrentColor] = useState<string>(currentGarment.defaultColor);
  const [currentFit, setCurrentFit] = useState<'slim' | 'regular' | 'relaxed' | 'oversized'>(currentGarment.fitType);
  const [currentSize, setCurrentSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'>(currentGarment.size);
  const [currentFabric, setCurrentFabric] = useState<GarmentItem['fabricType']>(currentGarment.fabricType);

  // Smart AI Fit advice state
  const [aiAdvice, setAiAdvice] = useState<StylingAdvice | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState<boolean>(false);

  // Save outfit modal state
  const [outfitName, setOutfitName] = useState<string>('Custom Studio Ensemble');
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const applyGarmentToAvatar = (item: GarmentItem, color: string) => {
    const customized = {
      ...item,
      selectedColor: color,
      fitType: currentFit,
      size: currentSize,
      fabricType: currentFabric
    };

    if (item.category === 't-shirts' || item.category === 'shirts') {
      setSelectedTop(customized);
    } else if (item.category === 'jeans' || item.category === 'trousers') {
      setSelectedBottom(customized);
    } else if (
      item.category === 'jackets' ||
      item.category === 'hoodies' ||
      item.category === 'formal' ||
      item.category === 'traditional'
    ) {
      setSelectedOuterwear(customized);
    } else if (item.category === 'dresses') {
      setSelectedTop(undefined);
      setSelectedBottom(undefined);
      setSelectedOuterwear(customized);
    }
  };

  const handleSelectCategory = (cat: ClothingCategory) => {
    setActiveCategory(cat);
    const matches = GARMENT_CATALOG.filter((g) => g.category === cat);
    if (matches.length > 0) {
      const first = matches[0];
      setCurrentGarment(first);
      setCurrentColor(first.defaultColor);
      setCurrentFit(first.fitType);
      setCurrentSize(first.size);
      setCurrentFabric(first.fabricType);
      applyGarmentToAvatar(first, first.defaultColor);
    }
  };

  const handleSelectGarment = (item: GarmentItem) => {
    setCurrentGarment(item);
    setCurrentColor(item.defaultColor);
    setCurrentFit(item.fitType);
    setCurrentSize(item.size);
    setCurrentFabric(item.fabricType);
    applyGarmentToAvatar(item, item.defaultColor);
  };

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    applyGarmentToAvatar(currentGarment, color);
  };

  const fetchSmartFitAdvice = async () => {
    setLoadingAdvice(true);
    try {
      const dummyMeasurements: BodyMeasurements = latestMeasurements || {
        heightCm: avatarConfig.heightCm,
        shoulderWidthCm: 44.5,
        chestCircumferenceCm: 98.0,
        waistCircumferenceCm: 81.5,
        hipCircumferenceCm: 97.0,
        armLengthCm: 61.2,
        inseamCm: 80.5,
        confidenceScore: 94,
        uncertaintyMarginCm: 1.2
      };

      const advice = await getSmartFitAdvice(dummyMeasurements, activeCategory, avatarConfig.heightCm);
      setAiAdvice(advice);
      if (advice.recommendedSize) {
        setCurrentSize(advice.recommendedSize as any);
      }
    } catch (e) {
      console.warn('Smart advice error', e);
    } finally {
      setLoadingAdvice(false);
    }
  };

  const handleSaveOutfit = (e: React.FormEvent) => {
    e.preventDefault();
    const outfit: SavedOutfit = {
      id: `outfit_${Date.now()}`,
      name: outfitName || 'Tailored Studio Look',
      date: new Date().toISOString().substring(0, 10),
      overallCategory: activeCategory,
      topGarment: selectedTop,
      bottomGarment: selectedBottom,
      outerwearGarment: selectedOuterwear
    };

    onSaveOutfit(outfit);
    setSaveSuccess(true);
    setShowSaveModal(false);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#3569FF]">
            <span>Virtual Fitting Atelier</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#66738D]">Procedural 3D Garment Geometry</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#101C3A]">
            Virtual Try-On Studio
          </h1>
          <p className="text-xs sm:text-sm text-[#66738D]">
            Explore tailored apparel combinations on your 3D digital self with 360-degree rotation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSaveModal(true)}
            className="px-5 py-2.5 bg-[#101C3A] hover:bg-[#1E293B] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#3569FF]" />
            <span>Save Outfit Combination</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 text-center flex items-center justify-center gap-2">
          <Check className="w-4 h-4" />
          <span>Outfit saved to your curated wardrobe!</span>
        </div>
      )}

      {/* Main Studio 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Large Interactive 3D Avatar Viewer */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E4E9F2] shadow-xs p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F1F4F9]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3569FF]" />
              <span className="text-xs font-semibold text-[#101C3A]">Interactive 3D Dressing Stage</span>
            </div>
            <div className="text-xs text-[#66738D] flex items-center gap-2">
              <span>360° Drag & Zoom</span>
            </div>
          </div>

          <div className="h-[540px] rounded-2xl overflow-hidden bg-[#F5F7FC]">
            <Avatar3DViewer
              avatarConfig={avatarConfig}
              selectedTop={selectedTop}
              selectedBottom={selectedBottom}
              selectedOuterwear={selectedOuterwear}
              height="100%"
              showControls={true}
              autoRotateDefault={false}
            />
          </div>

          {/* Currently Worn Outfit Summary Badge Bar */}
          <div className="p-3 rounded-xl bg-[#F5F7FC] border border-[#E4E9F2] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              {selectedTop && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedTop.selectedColor }} />
                  <span className="text-[#101C3A] font-medium">{selectedTop.name}</span>
                </div>
              )}
              {selectedBottom && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedBottom.selectedColor }} />
                  <span className="text-[#101C3A] font-medium">{selectedBottom.name}</span>
                </div>
              )}
              {selectedOuterwear && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedOuterwear.selectedColor }} />
                  <span className="text-[#101C3A] font-medium">{selectedOuterwear.name}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setSelectedTop(undefined);
                setSelectedBottom(undefined);
                setSelectedOuterwear(undefined);
              }}
              className="text-[#66738D] hover:text-rose-600 transition-colors"
            >
              Clear Outfit
            </button>
          </div>
        </div>

        {/* Right Column: Garment Customization Panel */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E4E9F2] shadow-xs p-6 space-y-6">
          {/* Clothing Categories Selector */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#101C3A]">1. Select Category</span>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_LABELS.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-[#3569FF] text-white shadow-xs'
                      : 'bg-[#F5F7FC] text-[#66738D] hover:text-[#101C3A]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Garments in Selected Category */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#101C3A]">2. Choose Garment Style</span>
            <div className="space-y-2">
              {categoryGarments.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectGarment(item)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    currentGarment.id === item.id
                      ? 'border-[#3569FF] ring-2 ring-[#3569FF]/20 bg-blue-50/20'
                      : 'border-[#E4E9F2] hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#101C3A]">{item.name}</p>
                    <span className="text-[10px] text-[#66738D] capitalize font-medium">
                      {item.fabricType} weave
                    </span>
                  </div>
                  <p className="text-[11px] text-[#66738D] mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Color Palette Swatches */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#101C3A]">3. Fabric Color</span>
            <div className="flex items-center gap-2">
              {currentGarment.palette.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                    currentColor === color
                      ? 'border-[#3569FF] scale-110 shadow-sm'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Size & Fit Selector */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-xs font-bold text-[#101C3A] mb-1.5">Garment Size</span>
              <div className="grid grid-cols-3 gap-1">
                {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setCurrentSize(s);
                      applyGarmentToAvatar(currentGarment, currentColor);
                    }}
                    className={`py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      currentSize === s
                        ? 'border-[#3569FF] bg-[#3569FF] text-white'
                        : 'border-[#E4E9F2] bg-[#F5F7FC] text-[#101C3A] hover:bg-slate-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-xs font-bold text-[#101C3A] mb-1.5">Fit Silhouette</span>
              <select
                value={currentFit}
                onChange={(e) => {
                  const fit = e.target.value as any;
                  setCurrentFit(fit);
                  applyGarmentToAvatar(currentGarment, currentColor);
                }}
                className="w-full text-xs py-2 px-2.5 bg-[#F5F7FC] border border-[#E4E9F2] rounded-xl outline-hidden text-[#101C3A]"
              >
                <option value="slim">Slim Tailored</option>
                <option value="regular">Regular Classic</option>
                <option value="relaxed">Relaxed Drape</option>
                <option value="oversized">Modern Oversized</option>
              </select>
            </div>
          </div>

          {/* Smart Fit Advice Trigger */}
          <div className="pt-2 border-t border-[#F1F4F9]">
            <button
              onClick={fetchSmartFitAdvice}
              disabled={loadingAdvice}
              className="w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-[#3569FF] border border-blue-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loadingAdvice ? 'Analyzing Fit Geometry...' : 'Get Smart Fit Recommendation'}</span>
            </button>
          </div>

          {/* Smart Fit Advice Card */}
          {aiAdvice && (
            <div className="p-4 rounded-2xl bg-[#F5F7FC] border border-[#E4E9F2] space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#101C3A]">Fit Assessment</span>
                <span className="text-xs font-mono font-semibold text-[#3569FF] bg-white px-2 py-0.5 rounded border border-[#E4E9F2]">
                  Rec: Size {aiAdvice.recommendedSize}
                </span>
              </div>
              <p className="text-xs text-[#66738D] leading-relaxed">
                {aiAdvice.fitAssessment}
              </p>
              <ul className="space-y-1.5 text-[11px] text-[#15213D] pt-1">
                {aiAdvice.stylingTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <ChevronRight className="w-3 h-3 text-[#3569FF] shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Save Outfit Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E4E9F2] shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#101C3A]">Save Outfit to Wardrobe</h3>
            <p className="text-xs text-[#66738D]">
              Give this ensemble a name so you can reload and compare it anytime in your History tab.
            </p>

            <form onSubmit={handleSaveOutfit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#101C3A] mb-1">
                  Outfit Title
                </label>
                <input
                  type="text"
                  value={outfitName}
                  onChange={(e) => setOutfitName(e.target.value)}
                  placeholder="e.g. Royal Navy Evening Blazer"
                  className="w-full text-xs py-2 px-3 bg-[#F5F7FC] border border-[#E4E9F2] rounded-xl outline-hidden focus:border-[#3569FF] font-medium"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#66738D] hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#3569FF] hover:bg-[#2554db] rounded-lg shadow-xs"
                >
                  Save Outfit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
