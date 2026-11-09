import { UserProfile, MeasurementRecord, SavedOutfit, AvatarConfig, ClothingCategory } from '../types';

const STORAGE_KEYS = {
  USER: 'fitme_user_profile',
  MEASUREMENTS: 'fitme_measurements',
  OUTFITS: 'fitme_saved_outfits',
  AVATAR: 'fitme_avatar_config',
  IS_AUTHENTICATED: 'fitme_auth_state'
};

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  gender: 'neutral',
  heightCm: 175,
  skinTone: '#E0AC69', // natural warm tone
  hairStyle: 'parted',
  hairColor: '#2C1D11',
  shoulderRatio: 1.0,
  chestScale: 1.0,
  waistScale: 1.0,
  hipScale: 1.0,
  armScale: 1.0,
  defaultUnderwearColor: '#101C3A'
};

export const DEFAULT_USER: UserProfile = {
  id: 'usr_demo_882',
  name: 'Altaf Raza',
  email: 'altaf33raza@gmail.com',
  phone: '+1 (555) 234-5678',
  heightCm: 175,
  gender: 'menswear',
  avatarConfig: DEFAULT_AVATAR_CONFIG,
  createdAt: '2026-03-01'
};

export const INITIAL_DEMO_MEASUREMENTS: MeasurementRecord[] = [
  {
    id: 'meas_2026_03_08',
    date: '2026-03-08 14:30',
    clothingCategory: 'formal',
    landmarksDetected: 33,
    measurements: {
      heightCm: 175,
      shoulderWidthCm: 44.5,
      chestCircumferenceCm: 98.0,
      waistCircumferenceCm: 81.5,
      hipCircumferenceCm: 97.0,
      armLengthCm: 61.2,
      inseamCm: 80.5,
      confidenceScore: 94,
      uncertaintyMarginCm: 1.2
    },
    notes: 'Standing upright against neutral backdrop. Calibrated to 175cm.'
  },
  {
    id: 'meas_2026_02_15',
    date: '2026-02-15 10:15',
    clothingCategory: 't-shirts',
    landmarksDetected: 33,
    measurements: {
      heightCm: 175,
      shoulderWidthCm: 44.0,
      chestCircumferenceCm: 99.2,
      waistCircumferenceCm: 83.0,
      hipCircumferenceCm: 98.2,
      armLengthCm: 61.0,
      inseamCm: 80.0,
      confidenceScore: 91,
      uncertaintyMarginCm: 1.5
    },
    notes: 'Casual athletic wear scan.'
  },
  {
    id: 'meas_2026_01_10',
    date: '2026-01-10 16:45',
    clothingCategory: 'jeans',
    landmarksDetected: 31,
    measurements: {
      heightCm: 175,
      shoulderWidthCm: 43.8,
      chestCircumferenceCm: 97.5,
      waistCircumferenceCm: 82.2,
      hipCircumferenceCm: 97.4,
      armLengthCm: 60.8,
      inseamCm: 80.2,
      confidenceScore: 89,
      uncertaintyMarginCm: 1.8
    },
    notes: 'Initial onboarding body calibration.'
  }
];

export const INITIAL_DEMO_OUTFITS: SavedOutfit[] = [
  {
    id: 'outfit_navy_executive',
    name: 'Executive Navy Suit Ensemble',
    date: '2026-03-05',
    overallCategory: 'formal',
    topGarment: {
      id: 'shirt_oxford_white',
      name: 'Tailored Oxford Shirt',
      category: 'shirts',
      defaultColor: '#FFFFFF',
      palette: ['#FFFFFF', '#E2E8F0', '#93C5FD'],
      fabricType: 'cotton',
      fitType: 'slim',
      size: 'M',
      description: 'Crisp Egyptian cotton tailored collar shirt',
      selectedColor: '#FFFFFF'
    },
    outerwearGarment: {
      id: 'blazer_navy_wool',
      name: 'Heritage Navy Blazer',
      category: 'jackets',
      defaultColor: '#101C3A',
      palette: ['#101C3A', '#1E293B', '#334155'],
      fabricType: 'wool',
      fitType: 'regular',
      size: 'M',
      description: 'Structured single-breasted blazer with notch lapel',
      selectedColor: '#101C3A'
    },
    bottomGarment: {
      id: 'trousers_slate_wool',
      name: 'Pleated Wool Trousers',
      category: 'trousers',
      defaultColor: '#334155',
      palette: ['#334155', '#1E293B', '#475569'],
      fabricType: 'wool',
      fitType: 'slim',
      size: 'M',
      description: 'Clean tapered drape trousers',
      selectedColor: '#334155'
    }
  },
  {
    id: 'outfit_weekend_casual',
    name: 'Royal Blue Street Minimalist',
    date: '2026-03-02',
    overallCategory: 't-shirts',
    topGarment: {
      id: 'tee_heavy_royal',
      name: 'Signature Royal Crewneck',
      category: 't-shirts',
      defaultColor: '#3569FF',
      palette: ['#3569FF', '#101C3A', '#FFFFFF', '#0F172A'],
      fabricType: 'cotton',
      fitType: 'regular',
      size: 'M',
      description: '280gsm heavyweight combed organic cotton tee',
      selectedColor: '#3569FF'
    },
    bottomGarment: {
      id: 'denim_raw_selvedge',
      name: 'Selvedge Straight Denim',
      category: 'jeans',
      defaultColor: '#1E3A8A',
      palette: ['#1E3A8A', '#172554', '#3B82F6', '#1E293B'],
      fabricType: 'denim',
      fitType: 'regular',
      size: 'M',
      description: '14oz indigo dyed Japanese selvedge denim',
      selectedColor: '#1E3A8A'
    }
  }
];

export class StorageService {
  static getUser(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return DEFAULT_USER;
  }

  static saveUser(user: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }

  static isAuthenticated(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED) === 'true';
    } catch {
      return false;
    }
  }

  static setAuthenticated(val: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, val ? 'true' : 'false');
    } catch (e) {
      console.warn('Storage auth set error', e);
    }
  }

  static getMeasurements(): MeasurementRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEASUREMENTS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_DEMO_MEASUREMENTS;
  }

  static saveMeasurement(record: MeasurementRecord): void {
    try {
      const existing = this.getMeasurements();
      const updated = [record, ...existing.filter(m => m.id !== record.id)];
      localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed saving measurement', e);
    }
  }

  static deleteMeasurement(id: string): void {
    try {
      const existing = this.getMeasurements();
      const updated = existing.filter(m => m.id !== id);
      localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed deleting measurement', e);
    }
  }

  static getOutfits(): SavedOutfit[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OUTFITS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_DEMO_OUTFITS;
  }

  static saveOutfit(outfit: SavedOutfit): void {
    try {
      const existing = this.getOutfits();
      const updated = [outfit, ...existing.filter(o => o.id !== outfit.id)];
      localStorage.setItem(STORAGE_KEYS.OUTFITS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed saving outfit', e);
    }
  }

  static deleteOutfit(id: string): void {
    try {
      const existing = this.getOutfits();
      const updated = existing.filter(o => o.id !== id);
      localStorage.setItem(STORAGE_KEYS.OUTFITS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed deleting outfit', e);
    }
  }

  static getAvatarConfig(): AvatarConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AVATAR);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return DEFAULT_AVATAR_CONFIG;
  }

  static saveAvatarConfig(config: AvatarConfig): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AVATAR, JSON.stringify(config));
      const user = this.getUser();
      user.avatarConfig = config;
      this.saveUser(user);
    } catch (e) {
      console.warn('Failed saving avatar config', e);
    }
  }

  static resetToDemoData(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
      localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(INITIAL_DEMO_MEASUREMENTS));
      localStorage.setItem(STORAGE_KEYS.OUTFITS, JSON.stringify(INITIAL_DEMO_OUTFITS));
      localStorage.setItem(STORAGE_KEYS.AVATAR, JSON.stringify(DEFAULT_AVATAR_CONFIG));
    } catch (e) {
      console.warn('Reset error', e);
    }
  }
}
