export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  heightCm: number;
  gender: 'unisex' | 'menswear' | 'womenswear';
  avatarConfig: AvatarConfig;
  createdAt: string;
}

export interface AvatarConfig {
  gender: 'neutral' | 'masculine' | 'feminine';
  heightCm: number;
  skinTone: string; // hex color
  hairStyle: 'short' | 'buzz' | 'parted' | 'bob' | 'long' | 'ponytail';
  hairColor: string; // hex color
  shoulderRatio: number; // 0.8 - 1.2
  chestScale: number; // 0.8 - 1.3
  waistScale: number; // 0.7 - 1.3
  hipScale: number; // 0.8 - 1.3
  armScale: number; // 0.8 - 1.2
  defaultUnderwearColor: string;
}

export interface BodyMeasurements {
  heightCm: number;
  shoulderWidthCm: number;
  chestCircumferenceCm: number;
  waistCircumferenceCm: number;
  hipCircumferenceCm: number;
  armLengthCm: number;
  inseamCm: number;
  confidenceScore: number; // 0 - 100
  uncertaintyMarginCm: number; // e.g. 1.2 cm
}

export interface MeasurementRecord {
  id: string;
  date: string;
  clothingCategory: ClothingCategory;
  measurements: BodyMeasurements;
  photoUrl?: string;
  notes?: string;
  landmarksDetected: number;
}

export type ClothingCategory =
  | 't-shirts'
  | 'shirts'
  | 'jeans'
  | 'trousers'
  | 'dresses'
  | 'jackets'
  | 'hoodies'
  | 'traditional'
  | 'formal';

export interface GarmentItem {
  id: string;
  name: string;
  category: ClothingCategory;
  defaultColor: string;
  palette: string[];
  fabricType: 'cotton' | 'denim' | 'linen' | 'wool' | 'silk' | 'synthetic';
  fitType: 'slim' | 'regular' | 'relaxed' | 'oversized';
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  description: string;
  recommendedWaistCm?: [number, number];
  recommendedChestCm?: [number, number];
}

export interface SavedOutfit {
  id: string;
  name: string;
  date: string;
  topGarment?: GarmentItem & { selectedColor: string };
  bottomGarment?: GarmentItem & { selectedColor: string };
  outerwearGarment?: GarmentItem & { selectedColor: string };
  overallCategory: ClothingCategory;
  avatarSnapshot?: string;
}

export interface LandmarkPoint {
  x: number; // normalized 0 - 1
  y: number; // normalized 0 - 1
  name: string;
  confidence: number;
}
