import { GarmentItem, ClothingCategory } from '../types';

export const GARMENT_CATALOG: GarmentItem[] = [
  // T-Shirts
  {
    id: 'garment_tee_essential',
    name: 'Minimalist Heavyweight Crewneck',
    category: 't-shirts',
    defaultColor: '#101C3A',
    palette: ['#101C3A', '#3569FF', '#FFFFFF', '#64748B', '#0F172A'],
    fabricType: 'cotton',
    fitType: 'regular',
    size: 'M',
    description: '280 GSM premium combed organic cotton with reinforced collar and ribbed cuffs.',
    recommendedChestCm: [96, 102],
    recommendedWaistCm: [80, 86]
  },
  {
    id: 'garment_tee_oversized',
    name: 'Studio Oversized Boxy Tee',
    category: 't-shirts',
    defaultColor: '#FFFFFF',
    palette: ['#FFFFFF', '#E2E8F0', '#3569FF', '#1E293B'],
    fabricType: 'cotton',
    fitType: 'oversized',
    size: 'L',
    description: 'Relaxed silhouette with dropped shoulders and a modern architectural drape.',
    recommendedChestCm: [100, 108],
    recommendedWaistCm: [84, 92]
  },

  // Shirts
  {
    id: 'garment_shirt_oxford',
    name: 'Tailored Oxford Cloth Button-Down',
    category: 'shirts',
    defaultColor: '#FFFFFF',
    palette: ['#FFFFFF', '#BFDBFE', '#3569FF', '#1E293B'],
    fabricType: 'cotton',
    fitType: 'slim',
    size: 'M',
    description: 'Pinpoint Egyptian cotton weave with a structured roll collar and mother-of-pearl buttons.',
    recommendedChestCm: [95, 101],
    recommendedWaistCm: [79, 85]
  },
  {
    id: 'garment_shirt_resort',
    name: 'Breathable Linen Camp Collar Shirt',
    category: 'shirts',
    defaultColor: '#3569FF',
    palette: ['#3569FF', '#38BDF8', '#F8FAFC', '#334155'],
    fabricType: 'linen',
    fitType: 'relaxed',
    size: 'M',
    description: 'Pure French flax linen crafted for lightweight ease and effortless summer sophistication.',
    recommendedChestCm: [96, 104],
    recommendedWaistCm: [80, 88]
  },

  // Jeans
  {
    id: 'garment_jeans_selvedge',
    name: 'Raw Indigo Selvedge Denim',
    category: 'jeans',
    defaultColor: '#1E3A8A',
    palette: ['#1E3A8A', '#172554', '#3B82F6', '#1E293B'],
    fabricType: 'denim',
    fitType: 'regular',
    size: 'M',
    description: '14oz authentic shuttle-loom Japanese selvedge denim that shapes to your natural body contours.',
    recommendedWaistCm: [80, 84]
  },
  {
    id: 'garment_jeans_tapered',
    name: 'Modern Washed Slim Denim',
    category: 'jeans',
    defaultColor: '#475569',
    palette: ['#475569', '#1E293B', '#60A5FA', '#0F172A'],
    fabricType: 'denim',
    fitType: 'slim',
    size: 'M',
    description: 'Subtle hand-finished wash with 2% comfort stretch for all-day mobility.',
    recommendedWaistCm: [78, 83]
  },

  // Trousers
  {
    id: 'garment_trouser_wool',
    name: 'Pleated Tropical Wool Trousers',
    category: 'trousers',
    defaultColor: '#101C3A',
    palette: ['#101C3A', '#334155', '#475569', '#E2E8F0'],
    fabricType: 'wool',
    fitType: 'slim',
    size: 'M',
    description: 'Super 120s lightweight wool with a single front pleat and tailored ankle taper.',
    recommendedWaistCm: [80, 85]
  },
  {
    id: 'garment_trouser_chino',
    name: 'Clean Tailored Stretch Chino',
    category: 'trousers',
    defaultColor: '#D97706',
    palette: ['#D97706', '#101C3A', '#475569', '#F1F5F9'],
    fabricType: 'cotton',
    fitType: 'regular',
    size: 'M',
    description: 'Heavyweight twill chino with interior piped seams and slant pockets.',
    recommendedWaistCm: [82, 87]
  },

  // Jackets
  {
    id: 'garment_jacket_blazer',
    name: 'Signature Structured Navy Blazer',
    category: 'jackets',
    defaultColor: '#101C3A',
    palette: ['#101C3A', '#1E293B', '#334155', '#3569FF'],
    fabricType: 'wool',
    fitType: 'regular',
    size: 'M',
    description: 'Hand-tailored half-canvas construction with clean shoulder roping and patch pockets.',
    recommendedChestCm: [98, 104],
    recommendedWaistCm: [81, 87]
  },
  {
    id: 'garment_jacket_bomber',
    name: 'Minimalist Technical Bomber',
    category: 'jackets',
    defaultColor: '#334155',
    palette: ['#334155', '#101C3A', '#0F172A', '#3569FF'],
    fabricType: 'synthetic',
    fitType: 'regular',
    size: 'M',
    description: 'Water-repellent technical matte shell with custom gunmetal two-way zipper.',
    recommendedChestCm: [96, 102],
    recommendedWaistCm: [80, 86]
  },

  // Hoodies
  {
    id: 'garment_hoodie_fleece',
    name: 'Heavyweight French Terry Hoodie',
    category: 'hoodies',
    defaultColor: '#3569FF',
    palette: ['#3569FF', '#101C3A', '#64748B', '#0F172A', '#FFFFFF'],
    fabricType: 'cotton',
    fitType: 'relaxed',
    size: 'M',
    description: '450 GSM diagonal-loop French terry with double-layer hood and clean side panels.',
    recommendedChestCm: [98, 106],
    recommendedWaistCm: [82, 90]
  },

  // Dresses
  {
    id: 'garment_dress_midi',
    name: 'Architectural Column Midi Dress',
    category: 'dresses',
    defaultColor: '#101C3A',
    palette: ['#101C3A', '#3569FF', '#DC2626', '#1E293B'],
    fabricType: 'silk',
    fitType: 'slim',
    size: 'S',
    description: 'Precision draped silhouette with subtle jewel neckline and side slit movement.',
    recommendedChestCm: [86, 92],
    recommendedWaistCm: [68, 74]
  },

  // Traditional Wear
  {
    id: 'garment_trad_kurta',
    name: 'Handcrafted Linen Mandarin Kurta',
    category: 'traditional',
    defaultColor: '#FFFFFF',
    palette: ['#FFFFFF', '#101C3A', '#3569FF', '#E2E8F0', '#0D9488'],
    fabricType: 'linen',
    fitType: 'relaxed',
    size: 'M',
    description: 'Refined standing band collar with delicate tonal embroidery and side seam slits.',
    recommendedChestCm: [96, 104],
    recommendedWaistCm: [80, 88]
  },

  // Formal Wear
  {
    id: 'garment_formal_tuxedo',
    name: 'Midnight Black Peak Lapel Tuxedo',
    category: 'formal',
    defaultColor: '#0F172A',
    palette: ['#0F172A', '#101C3A', '#334155'],
    fabricType: 'wool',
    fitType: 'slim',
    size: 'M',
    description: 'Barathea wool with grosgrain silk peak lapels and covered fabric buttons.',
    recommendedChestCm: [98, 104],
    recommendedWaistCm: [80, 86]
  }
];

export const CATEGORY_LABELS: { id: ClothingCategory; label: string }[] = [
  { id: 't-shirts', label: 'T-shirts' },
  { id: 'shirts', label: 'Shirts' },
  { id: 'jeans', label: 'Jeans' },
  { id: 'trousers', label: 'Trousers' },
  { id: 'dresses', label: 'Dresses' },
  { id: 'jackets', label: 'Jackets' },
  { id: 'hoodies', label: 'Hoodies' },
  { id: 'traditional', label: 'Traditional Wear' },
  { id: 'formal', label: 'Formal Wear' }
];
