import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ClothingCategory, MeasurementRecord } from '../types';
import { analyzePoseAndMeasurements, PoseAnalysisResult } from '../services/poseEstimation';
import { StorageService } from '../services/storage';
import { CATEGORY_LABELS } from '../services/garmentCatalog';
import confetti from 'canvas-confetti';
import {
  Camera,
  Upload,
  Ruler,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCw,
  Info,
  ShieldCheck,
  Check
} from 'lucide-react';

interface MeasurementPageProps {
  user: UserProfile;
  onSaveRecord: (record: MeasurementRecord) => void;
  onRouteChange: (route: string) => void;
}

export const MeasurementPage: React.FC<MeasurementPageProps> = ({
  user,
  onSaveRecord,
  onRouteChange
}) => {
  const [inputMode, setInputMode] = useState<'camera' | 'upload'>('upload');
  const [userHeightCm, setUserHeightCm] = useState<number>(user.heightCm || 175);
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory>('formal');
  const [notes, setNotes] = useState<string>('');

  // Image source states
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<PoseAnalysisResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Live Camera states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>('');
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access error', err);
      setCameraError(
        'Unable to access device camera. Please check camera permissions or use the upload photo option.'
      );
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  };

  const captureCameraSnapshot = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setImagePreviewUrl(dataUrl);
    stopCamera();
    runPoseAnalysis(dataUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImagePreviewUrl(result);
      runPoseAnalysis(result);
    };
    reader.readAsDataURL(file);
  };

  const handleUseSamplePhoto = () => {
    const sampleUrl = '/src/assets/images/how_it_works_scan_1794221430759.jpg';
    setImagePreviewUrl(sampleUrl);
    runPoseAnalysis(sampleUrl);
  };

  const runPoseAnalysis = (imageSrc: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setSavedSuccess(false);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      try {
        const result = await analyzePoseAndMeasurements(img, userHeightCm);
        setAnalysisResult(result);
      } catch (err) {
        console.error('Pose estimation error', err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    img.src = imageSrc;
  };

  const handleSaveRecord = () => {
    if (!analysisResult) return;

    const record: MeasurementRecord = {
      id: `meas_${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      clothingCategory: selectedCategory,
      measurements: analysisResult.measurements,
      photoUrl: analysisResult.processedCanvasUrl,
      notes: notes || `Scanned for ${selectedCategory}. Calibrated to ${userHeightCm}cm.`,
      landmarksDetected: analysisResult.landmarks.length
    };

    onSaveRecord(record);

    // Update avatar proportions based on calibrated metrics
    const currentAvatar = StorageService.getAvatarConfig();
    const shoulderRatio = Math.max(0.85, Math.min(1.25, analysisResult.measurements.shoulderWidthCm / 44.0));
    const chestScale = Math.max(0.85, Math.min(1.30, analysisResult.measurements.chestCircumferenceCm / 98.0));
    const waistScale = Math.max(0.75, Math.min(1.30, analysisResult.measurements.waistCircumferenceCm / 82.0));
    const hipScale = Math.max(0.80, Math.min(1.30, analysisResult.measurements.hipCircumferenceCm / 98.0));

    StorageService.saveAvatarConfig({
      ...currentAvatar,
      heightCm: userHeightCm,
      shoulderRatio,
      chestScale,
      waistScale,
      hipScale
    });

    setSavedSuccess(true);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
  };

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#3569FF]">
          <span>AI Body Measurement Scanner</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#66738D]">Computer Vision Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#101C3A]">
          Capture & Estimate Body Measurements
        </h1>
        <p className="text-xs sm:text-sm text-[#66738D] max-w-2xl">
          Calibrated to your exact standing height. Real-time edge detection and anthropometric landmarking calculate shoulder width, limb span, and circumference models.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Input & Camera Stage */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E4E9F2] shadow-xs p-6 space-y-6">
          {/* Controls: Mode Switcher & Height Calibration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#F1F4F9]">
            {/* Input Mode Switch */}
            <div>
              <label className="block text-xs font-semibold text-[#101C3A] mb-1.5">
                Input Source
              </label>
              <div className="flex items-center gap-1 bg-[#F5F7FC] p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setInputMode('upload');
                    stopCamera();
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                    inputMode === 'upload'
                      ? 'bg-white text-[#101C3A] shadow-xs'
                      : 'text-[#66738D] hover:text-[#101C3A]'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputMode('camera');
                    startCamera();
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                    inputMode === 'camera'
                      ? 'bg-white text-[#101C3A] shadow-xs'
                      : 'text-[#66738D] hover:text-[#101C3A]'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Live Camera</span>
                </button>
              </div>
            </div>

            {/* Height Calibration Input */}
            <div>
              <label className="block text-xs font-semibold text-[#101C3A] mb-1.5">
                Your Height (cm) <span className="text-[#3569FF]">*required for scale</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={120}
                  max={240}
                  value={userHeightCm}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setUserHeightCm(val);
                    if (imagePreviewUrl) runPoseAnalysis(imagePreviewUrl);
                  }}
                  className="w-full text-xs font-mono py-2 px-3 bg-[#F5F7FC] border border-[#E4E9F2] rounded-xl focus:border-[#3569FF] focus:bg-white outline-hidden font-bold"
                />
                <span className="absolute right-3 top-2.5 text-xs text-[#66738D]">cm</span>
              </div>
            </div>
          </div>

          {/* Clothing Category Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#101C3A]">
              Target Clothing Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_LABELS.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#101C3A] text-white'
                      : 'bg-[#F5F7FC] text-[#66738D] hover:text-[#101C3A]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Capture / Upload Viewport */}
          <div className="relative rounded-2xl overflow-hidden border border-[#E4E9F2] bg-[#F5F7FC] aspect-4/3 flex items-center justify-center">
            {inputMode === 'camera' && cameraActive ? (
              <div className="relative w-full h-full bg-black">
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className="w-full h-full object-cover mirror"
                />
                {/* Silhouette Alignment Guide Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-80 border-2 border-dashed border-[#3569FF]/70 rounded-full flex flex-col justify-between py-4 items-center">
                    <span className="text-[10px] text-white bg-black/60 px-2 py-0.5 rounded">
                      Align Head Here
                    </span>
                    <span className="text-[10px] text-white bg-black/60 px-2 py-0.5 rounded">
                      Stand Full Length
                    </span>
                  </div>
                </div>

                {/* Capture Trigger Button */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <button
                    onClick={captureCameraSnapshot}
                    className="p-3 bg-[#3569FF] text-white rounded-full shadow-lg hover:bg-[#2554db] transition-transform active:scale-95"
                    title="Capture image"
                  >
                    <Camera className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ) : analysisResult ? (
              <div className="relative w-full h-full">
                <img
                  src={analysisResult.processedCanvasUrl}
                  alt="Calibrated landmark skeleton analysis"
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#E4E9F2] text-xs font-semibold text-[#101C3A] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{analysisResult.landmarks.length} Landmarks Tracked</span>
                </div>
              </div>
            ) : imagePreviewUrl ? (
              <div className="relative w-full h-full">
                <img
                  src={imagePreviewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
                    <RotateCw className="w-6 h-6 animate-spin text-[#3569FF]" />
                    <p className="text-xs font-semibold">Running Computer Vision Landmarking...</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center space-y-4 max-w-sm">
                <div className="w-12 h-12 rounded-2xl bg-white text-[#3569FF] shadow-xs flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#101C3A]">Upload Full-Body Photograph</p>
                  <p className="text-[11px] text-[#66738D] mt-1">
                    Stand upright with head-to-toe visible in frame
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="px-4 py-2.5 bg-[#3569FF] text-white text-xs font-semibold rounded-xl hover:bg-[#2554db] transition-colors cursor-pointer shadow-xs">
                    <span>Browse Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleUseSamplePhoto}
                    className="text-xs text-[#3569FF] hover:underline font-medium"
                  >
                    Or load standard calibration model photo
                  </button>
                </div>
              </div>
            )}
          </div>

          {cameraError && (
            <div className="p-3 bg-amber-50 text-amber-800 rounded-xl text-xs border border-amber-200">
              {cameraError}
            </div>
          )}
        </div>

        {/* Right Column: Measurements Output & Validation Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-[#E4E9F2] shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F4F9]">
              <h2 className="text-sm font-bold text-[#101C3A]">Calibrated Metric Results</h2>
              {analysisResult ? (
                <span className="text-xs font-mono font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100">
                  {analysisResult.measurements.confidenceScore}% Confidence
                </span>
              ) : (
                <span className="text-xs text-[#66738D]">Awaiting scan</span>
              )}
            </div>

            {analysisResult ? (
              <div className="space-y-4">
                {/* 6 Key Body Measurements Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#F5F7FC] border border-[#E4E9F2]">
                    <span className="text-[11px] text-[#66738D]">Calibrated Height</span>
                    <p className="text-lg font-bold font-mono text-[#101C3A] tabular-nums mt-0.5">
                      {analysisResult.measurements.heightCm}{' '}
                      <span className="text-xs font-sans font-normal text-[#66738D]">cm</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F5F7FC] border border-[#E4E9F2]">
                    <span className="text-[11px] text-[#66738D]">Shoulder Width</span>
                    <p className="text-lg font-bold font-mono text-[#101C3A] tabular-nums mt-0.5">
                      {analysisResult.measurements.shoulderWidthCm}{' '}
                      <span className="text-xs font-sans font-normal text-[#66738D]">cm</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F5F7FC] border border-[#E4E9F2]">
                    <span className="text-[11px] text-[#66738D]">Chest Circumference*</span>
                    <p className="text-lg font-bold font-mono text-[#101C3A] tabular-nums mt-0.5">
                      {analysisResult.measurements.chestCircumferenceCm}{' '}
                      <span className="text-xs font-sans font-normal text-[#66738D]">cm</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F5F7FC] border border-[#E4E9F2]">
                    <span className="text-[11px] text-[#66738D]">Waist Circumference*</span>
                    <p className="text-lg font-bold font-mono text-[#101C3A] tabular-nums mt-0.5">
                      {analysisResult.measurements.waistCircumferenceCm}{' '}
                      <span className="text-xs font-sans font-normal text-[#66738D]">cm</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F5F7FC] border border-[#E4E9F2]">
                    <span className="text-[11px] text-[#66738D]">Hip Circumference*</span>
                    <p className="text-lg font-bold font-mono text-[#101C3A] tabular-nums mt-0.5">
                      {analysisResult.measurements.hipCircumferenceCm}{' '}
                      <span className="text-xs font-sans font-normal text-[#66738D]">cm</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F5F7FC] border border-[#E4E9F2]">
                    <span className="text-[11px] text-[#66738D]">Arm Length</span>
                    <p className="text-lg font-bold font-mono text-[#101C3A] tabular-nums mt-0.5">
                      {analysisResult.measurements.armLengthCm}{' '}
                      <span className="text-xs font-sans font-normal text-[#66738D]">cm</span>
                    </p>
                  </div>
                </div>

                {/* Experimental Circumference & Uncertainty Disclaimer */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-[#66738D] space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-[#101C3A]">
                    <Info className="w-3.5 h-3.5 text-[#3569FF]" />
                    <span>*Experimental Sizing Notice</span>
                  </div>
                  <p>
                    A single front-facing photograph cannot determine 3D body volume with absolute finality. Circumference dimensions are calculated via anthropometric Ramanujan ellipse geometry with an estimated uncertainty margin of ±
                    {analysisResult.measurements.uncertaintyMarginCm} cm.
                  </p>
                </div>

                {/* Quality Report Checklist */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-semibold text-[#101C3A]">Scan Quality Assessment:</span>
                  <div className="space-y-1 text-xs">
                    {analysisResult.qualityReport.tips.map((tip, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-emerald-700">
                        <Check className="w-3.5 h-3.5" />
                        <span>{tip}</span>
                      </div>
                    ))}
                    {analysisResult.qualityReport.warnings.map((warn, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-amber-700">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{warn}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save Record Action */}
                <div className="pt-3 border-t border-[#F1F4F9] space-y-2">
                  {savedSuccess ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 text-center flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Saved to Measurement History & Updated 3D Avatar!</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleSaveRecord}
                      className="w-full py-3 px-4 bg-[#3569FF] hover:bg-[#2554db] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Save Record & Update 3D Avatar</span>
                    </button>
                  )}

                  <button
                    onClick={() => onRouteChange('avatar')}
                    className="w-full py-2.5 px-4 bg-[#F5F7FC] hover:bg-[#E4E9F2] text-[#101C3A] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View Avatar in 3D Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-[#66738D] space-y-2">
                <Ruler className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">Take a photo or upload an image to begin landmark extraction.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
