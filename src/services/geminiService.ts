import { GoogleGenAI } from '@google/genai';
import { BodyMeasurements, ClothingCategory } from '../types';

let aiInstance: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (aiInstance) return aiInstance;
  const apiKey = process.env.GEMINI_API_KEY || (typeof window !== 'undefined' && (window as any).__GEMINI_KEY__);
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    aiInstance = new GoogleGenAI({ apiKey });
    return aiInstance;
  }
  return null;
}

export interface StylingAdvice {
  recommendedSize: string;
  fitAssessment: string;
  stylingTips: string[];
  alternativeCategories: string[];
}

export async function getSmartFitAdvice(
  measurements: BodyMeasurements,
  category: ClothingCategory,
  userHeightCm: number
): Promise<StylingAdvice> {
  const ai = getAiClient();

  if (ai) {
    try {
      const prompt = `You are FitMe's AI Fashion Sizing Specialist. 
Analyze the following calibrated body measurements for a user shopping for ${category}:
- Height: ${userHeightCm} cm
- Shoulder Width: ${measurements.shoulderWidthCm} cm
- Chest Circumference: ${measurements.chestCircumferenceCm} cm
- Waist Circumference: ${measurements.waistCircumferenceCm} cm
- Hip Circumference: ${measurements.hipCircumferenceCm} cm
- Arm Length: ${measurements.armLengthCm} cm
- Inseam: ${measurements.inseamCm} cm

Provide a concise JSON response with:
1. recommendedSize (e.g. S, M, L, XL, or 32R)
2. fitAssessment (1-2 sentences on how standard silhouettes in ${category} will drape on this build)
3. stylingTips (3 short, concrete bullet tips on collar, drape, or hem length)
4. alternativeCategories (2 complementary clothing items)

Return ONLY valid JSON matching this structure:
{"recommendedSize": "M", "fitAssessment": "...", "stylingTips": ["..."], "alternativeCategories": ["..."]}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      if (response.text) {
        return JSON.parse(response.text);
      }
    } catch (e) {
      console.warn('Gemini fit advice fallback used', e);
    }
  }

  // Robust analytical fallback based on international sizing standards
  let size = 'M';
  const chest = measurements.chestCircumferenceCm;
  const waist = measurements.waistCircumferenceCm;

  if (chest < 92 || waist < 76) {
    size = 'S';
  } else if (chest > 104 || waist > 88) {
    size = 'L';
  } else if (chest > 112 || waist > 96) {
    size = 'XL';
  }

  return {
    recommendedSize: size,
    fitAssessment: `Based on your ${measurements.chestCircumferenceCm}cm chest and ${measurements.waistCircumferenceCm}cm waist, size ${size} provides a balanced drape across the shoulders with a natural taper through the torso.`,
    stylingTips: [
      `Your ${measurements.shoulderWidthCm}cm shoulder width pairs best with structured shoulder seams that hit right at the acromion bone.`,
      `With an inseam of ${measurements.inseamCm}cm, look for a slight break or clean no-break trouser hem to elongate your leg line.`,
      `Opt for breathable natural weaves like 100% combed cotton or tropical wool to maintain silhouette crispness.`
    ],
    alternativeCategories: [
      category === 't-shirts' ? 'Jeans' : 'Formal Wear',
      category === 'shirts' ? 'Trousers' : 'Jackets'
    ]
  };
}
