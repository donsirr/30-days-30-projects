/**
 * @iskolarhub/shared - Constants
 * Philippine-specific data and application constants
 */

import type { StrandType, DocumentType, ProviderType, ShsType } from './types';

// ============================================================
// DOCUMENT TYPES
// ============================================================

export const DOCUMENT_TYPES: readonly DocumentType[] = ['PSA', 'Form138', 'ITR', 'GoodMoral'] as const;

export const DOCUMENT_DISPLAY_NAMES: Record<DocumentType, string> = {
    PSA: 'PSA Birth Certificate',
    Form138: 'Form 138 (Report Card)',
    ITR: 'Income Tax Return (ITR)',
    GoodMoral: 'Certificate of Good Moral Character',
};

export const DOCUMENT_DESCRIPTIONS: Record<DocumentType, string> = {
    PSA: 'Official birth certificate issued by the Philippine Statistics Authority',
    Form138: 'Official high school report card showing your GWA/grades',
    ITR: "Parent/Guardian's latest Income Tax Return or Certificate of No Income",
    GoodMoral: 'Good Moral Certificate from your current/previous school',
};

// ============================================================
// SHS STRANDS
// ============================================================

export const STRAND_TYPES: readonly StrandType[] = [
    'STEM',
    'ABM',
    'HUMSS',
    'GAS',
    'TVL',
    'Sports',
    'Arts',
] as const;

export interface StrandInfo {
    code: StrandType;
    name: string;
    description: string;
}

export const STRAND_INFO: StrandInfo[] = [
    { code: 'STEM', name: 'Science, Technology, Engineering, and Mathematics', description: 'For students pursuing science and tech-related degrees' },
    { code: 'ABM', name: 'Accountancy, Business, and Management', description: 'For students pursuing business-related degrees' },
    { code: 'HUMSS', name: 'Humanities and Social Sciences', description: 'For students pursuing social science and humanities degrees' },
    { code: 'GAS', name: 'General Academic Strand', description: 'For students who are still undecided' },
    { code: 'TVL', name: 'Technical-Vocational-Livelihood', description: 'For students pursuing technical and vocational courses' },
    { code: 'Sports', name: 'Sports Track', description: 'For students pursuing sports-related careers' },
    { code: 'Arts', name: 'Arts and Design Track', description: 'For students pursuing arts and design careers' },
];

// ============================================================
// SHS TYPES
// ============================================================

export const SHS_TYPES: readonly ShsType[] = ['Public', 'Private'] as const;

export interface ShsTypeInfo {
    code: ShsType;
    name: string;
    description: string;
}

export const SHS_TYPE_INFO: ShsTypeInfo[] = [
    { code: 'Public', name: 'Public School', description: 'Government-funded schools' },
    { code: 'Private', name: 'Private School', description: 'Privately-funded schools' },
];

// ============================================================
// PROVIDER TYPES
// ============================================================

export const PROVIDER_TYPES: readonly ProviderType[] = [
    'Government',
    'Private',
    'LGU',
    'International',
    'NGO',
] as const;

export const PROVIDER_TYPE_LABELS: Record<ProviderType, string> = {
    Government: 'Government',
    Private: 'Private Company/Foundation',
    LGU: 'Local Government Unit',
    International: 'International Organization',
    NGO: 'Non-Government Organization',
};

// ============================================================
// PHILIPPINE DEGREE PROGRAMS (Standardized List)
// ============================================================

export const DEGREE_PROGRAMS: readonly string[] = [
    // Engineering
    'Civil Engineering',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Electronics Engineering',
    'Chemical Engineering',
    'Computer Engineering',
    'Industrial Engineering',
    'Geodetic Engineering',
    'Mining Engineering',
    'Sanitary Engineering',
    'Agricultural Engineering',
    'Aerospace Engineering',

    // Information Technology
    'Computer Science',
    'Information Technology',
    'Information Systems',
    'Data Science',
    'Cyber Security',
    'Software Engineering',

    // Business & Accountancy
    'Accountancy',
    'Business Administration',
    'Business Management',
    'Entrepreneurship',
    'Marketing Management',
    'Financial Management',
    'Human Resource Management',
    'Operations Management',
    'Economics',
    'Banking and Finance',

    // Health Sciences
    'Nursing',
    'Medicine',
    'Pharmacy',
    'Medical Technology',
    'Physical Therapy',
    'Occupational Therapy',
    'Radiologic Technology',
    'Dentistry',
    'Midwifery',
    'Public Health',
    'Nutrition and Dietetics',

    // Sciences
    'Biology',
    'Chemistry',
    'Physics',
    'Mathematics',
    'Statistics',
    'Environmental Science',
    'Marine Biology',
    'Geology',
    'Food Technology',
    'Agriculture',

    // Education
    'Elementary Education',
    'Secondary Education',
    'Special Education',
    'Early Childhood Education',
    'Physical Education',

    // Arts & Humanities
    'Communication Arts',
    'Journalism',
    'Broadcasting',
    'Multimedia Arts',
    'Fine Arts',
    'Graphic Design',
    'Interior Design',
    'Architecture',
    'Music',
    'Theatre Arts',
    'Film',

    // Social Sciences
    'Psychology',
    'Political Science',
    'Sociology',
    'Social Work',
    'Public Administration',
    'International Studies',
    'Philosophy',
    'History',

    // Law & Criminology
    'Criminology',
    'Legal Management',
    'Law',

    // Hospitality & Tourism
    'Hotel and Restaurant Management',
    'Tourism Management',
    'Culinary Arts',
    'Travel Management',

    // Agriculture & Marine
    'Fisheries',
    'Forestry',
    'Veterinary Medicine',
    'Animal Science',

    // Others
    'Library Science',
    'Real Estate Management',
    'Customs Administration',
    'Foreign Service',
] as const;

// Course categories for grouping
export const COURSE_CATEGORIES: Record<string, string[]> = {
    Engineering: DEGREE_PROGRAMS.filter((c) => c.includes('Engineering')),
    'Information Technology': DEGREE_PROGRAMS.filter(
        (c) => c.includes('Computer') || c.includes('Information') || c.includes('Data') || c.includes('Software')
    ),
    Business: DEGREE_PROGRAMS.filter(
        (c) =>
            c.includes('Business') ||
            c.includes('Accountancy') ||
            c.includes('Marketing') ||
            c.includes('Finance') ||
            c.includes('Economics') ||
            c.includes('Management')
    ),
    'Health Sciences': DEGREE_PROGRAMS.filter(
        (c) =>
            c.includes('Nursing') ||
            c.includes('Medicine') ||
            c.includes('Pharmacy') ||
            c.includes('Therapy') ||
            c.includes('Medical') ||
            c.includes('Health') ||
            c.includes('Nutrition')
    ),
    Sciences: DEGREE_PROGRAMS.filter(
        (c) =>
            c.includes('Biology') ||
            c.includes('Chemistry') ||
            c.includes('Physics') ||
            c.includes('Mathematics') ||
            c.includes('Environmental') ||
            c.includes('Agriculture')
    ),
    Education: DEGREE_PROGRAMS.filter((c) => c.includes('Education')),
    'Arts & Humanities': DEGREE_PROGRAMS.filter(
        (c) =>
            c.includes('Arts') ||
            c.includes('Design') ||
            c.includes('Music') ||
            c.includes('Film') ||
            c.includes('Communication') ||
            c.includes('Journalism')
    ),
    'Social Sciences': DEGREE_PROGRAMS.filter(
        (c) =>
            c.includes('Psychology') ||
            c.includes('Political') ||
            c.includes('Sociology') ||
            c.includes('Social') ||
            c.includes('Philosophy') ||
            c.includes('History')
    ),
    'Hospitality & Tourism': DEGREE_PROGRAMS.filter(
        (c) => c.includes('Hotel') || c.includes('Tourism') || c.includes('Culinary') || c.includes('Travel')
    ),
};

// ============================================================
// PHILIPPINE REGIONS (PSGC)
// ============================================================

export interface Region {
    id: number;
    psgcCode: string;
    name: string;
}

export const REGIONS: Region[] = [
    { id: 1, psgcCode: '130000000', name: 'National Capital Region (NCR)' },
    { id: 2, psgcCode: '040000000', name: 'CALABARZON' },
    { id: 3, psgcCode: '030000000', name: 'Central Luzon' },
    { id: 4, psgcCode: '010000000', name: 'Ilocos Region' },
    { id: 5, psgcCode: '020000000', name: 'Cagayan Valley' },
    { id: 6, psgcCode: '050000000', name: 'Bicol Region' },
    { id: 7, psgcCode: '060000000', name: 'Western Visayas' },
    { id: 8, psgcCode: '070000000', name: 'Central Visayas' },
    { id: 9, psgcCode: '080000000', name: 'Eastern Visayas' },
    { id: 10, psgcCode: '090000000', name: 'Zamboanga Peninsula' },
    { id: 11, psgcCode: '100000000', name: 'Northern Mindanao' },
    { id: 12, psgcCode: '110000000', name: 'Davao Region' },
    { id: 13, psgcCode: '120000000', name: 'SOCCSKSARGEN' },
    { id: 14, psgcCode: '140000000', name: 'Cordillera Administrative Region' },
    { id: 15, psgcCode: '150000000', name: 'BARMM' },
    { id: 16, psgcCode: '160000000', name: 'Caraga' },
    { id: 17, psgcCode: '170000000', name: 'MIMAROPA' },
];

// ============================================================
// LGU SCHOLARSHIP PROVIDERS
// ============================================================

export interface LguProviderInfo {
    cityId: number;
    name: string;
    scholarshipName: string;
    minResidencyYears: number;
    requiresProofOfResidency: boolean;
}

export const LGU_PROVIDERS: LguProviderInfo[] = [
    { cityId: 2, name: 'Makati City', scholarshipName: 'Makati City College Scholarship', minResidencyYears: 3, requiresProofOfResidency: true },
    { cityId: 3, name: 'Taguig City', scholarshipName: 'Taguig City University Scholarship', minResidencyYears: 5, requiresProofOfResidency: true },
    { cityId: 4, name: 'Quezon City', scholarshipName: 'QC-CHED Expanded Scholarship Program', minResidencyYears: 3, requiresProofOfResidency: true },
    { cityId: 5, name: 'Pasig City', scholarshipName: 'Pamantasan ng Lungsod ng Pasig Scholarship', minResidencyYears: 3, requiresProofOfResidency: true },
    { cityId: 6, name: 'Mandaluyong City', scholarshipName: 'Mandaluyong City Scholarship', minResidencyYears: 2, requiresProofOfResidency: true },
    { cityId: 8, name: 'Muntinlupa City', scholarshipName: 'Muntinlupa City Scholarship Program', minResidencyYears: 3, requiresProofOfResidency: true },
    { cityId: 11, name: 'Caloocan City', scholarshipName: 'Caloocan City Scholarship', minResidencyYears: 2, requiresProofOfResidency: true },
    { cityId: 14, name: 'Valenzuela City', scholarshipName: 'Valenzuela City Scholarship', minResidencyYears: 3, requiresProofOfResidency: true },
    { cityId: 15, name: 'Marikina City', scholarshipName: 'Marikina City Scholarship', minResidencyYears: 2, requiresProofOfResidency: true },
];

// ============================================================
// CITY COORDINATES (for reverse geocoding)
// ============================================================

export interface CityCoordinates {
    name: string;
    cityId: number;
    lat: number;
    lng: number;
    radius: number; // km
    province?: string;
}

export const CITY_COORDINATES: CityCoordinates[] = [
    // Metro Manila
    { name: 'Manila', cityId: 1, lat: 14.5995, lng: 120.9842, radius: 5, province: 'Metro Manila' },
    { name: 'Makati', cityId: 2, lat: 14.5547, lng: 121.0244, radius: 4, province: 'Metro Manila' },
    { name: 'Taguig', cityId: 3, lat: 14.5176, lng: 121.0509, radius: 5, province: 'Metro Manila' },
    { name: 'Quezon City', cityId: 4, lat: 14.676, lng: 121.0437, radius: 8, province: 'Metro Manila' },
    { name: 'Pasig', cityId: 5, lat: 14.5764, lng: 121.0851, radius: 4, province: 'Metro Manila' },
    { name: 'Mandaluyong', cityId: 6, lat: 14.5794, lng: 121.0359, radius: 3, province: 'Metro Manila' },
    { name: 'Pasay', cityId: 7, lat: 14.5378, lng: 121.0014, radius: 3, province: 'Metro Manila' },
    { name: 'Muntinlupa', cityId: 8, lat: 14.4081, lng: 121.0415, radius: 5, province: 'Metro Manila' },
    { name: 'Parañaque', cityId: 9, lat: 14.4793, lng: 121.0198, radius: 4, province: 'Metro Manila' },
    { name: 'Las Piñas', cityId: 10, lat: 14.4445, lng: 120.9939, radius: 4, province: 'Metro Manila' },
    { name: 'Caloocan', cityId: 11, lat: 14.6488, lng: 120.984, radius: 6, province: 'Metro Manila' },
    { name: 'Malabon', cityId: 12, lat: 14.6625, lng: 120.9567, radius: 3, province: 'Metro Manila' },
    { name: 'Navotas', cityId: 13, lat: 14.6667, lng: 120.9417, radius: 3, province: 'Metro Manila' },
    { name: 'Valenzuela', cityId: 14, lat: 14.6942, lng: 120.9603, radius: 4, province: 'Metro Manila' },
    { name: 'Marikina', cityId: 15, lat: 14.6507, lng: 121.1029, radius: 4, province: 'Metro Manila' },
    { name: 'San Juan', cityId: 16, lat: 14.6019, lng: 121.0355, radius: 2, province: 'Metro Manila' },

    // Cavite
    { name: 'Bacoor', cityId: 17, lat: 14.4624, lng: 120.9645, radius: 5, province: 'Cavite' },
    { name: 'Imus', cityId: 18, lat: 14.4297, lng: 120.9367, radius: 5, province: 'Cavite' },
    { name: 'Dasmariñas', cityId: 19, lat: 14.3294, lng: 120.9367, radius: 6, province: 'Cavite' },
    { name: 'General Trias', cityId: 20, lat: 14.3833, lng: 120.8833, radius: 6, province: 'Cavite' },
    { name: 'Cavite City', cityId: 21, lat: 14.4833, lng: 120.9, radius: 4, province: 'Cavite' },

    // Laguna
    { name: 'Santa Rosa', cityId: 22, lat: 14.3122, lng: 121.1114, radius: 5, province: 'Laguna' },
    { name: 'Biñan', cityId: 23, lat: 14.3408, lng: 121.0803, radius: 4, province: 'Laguna' },
    { name: 'San Pedro', cityId: 24, lat: 14.3595, lng: 121.0475, radius: 4, province: 'Laguna' },
    { name: 'Calamba', cityId: 25, lat: 14.2117, lng: 121.1653, radius: 6, province: 'Laguna' },

    // Rizal
    { name: 'Antipolo', cityId: 26, lat: 14.5864, lng: 121.1761, radius: 7, province: 'Rizal' },
    { name: 'Cainta', cityId: 27, lat: 14.5667, lng: 121.1167, radius: 4, province: 'Rizal' },
    { name: 'Taytay', cityId: 28, lat: 14.5667, lng: 121.1333, radius: 4, province: 'Rizal' },

    // Bulacan
    { name: 'Meycauayan', cityId: 29, lat: 14.7333, lng: 120.95, radius: 4, province: 'Bulacan' },
    { name: 'San Jose del Monte', cityId: 30, lat: 14.8139, lng: 121.0453, radius: 6, province: 'Bulacan' },
    { name: 'Malolos', cityId: 31, lat: 14.8433, lng: 120.8114, radius: 5, province: 'Bulacan' },
];

// ============================================================
// VALIDATION RULES
// ============================================================

export const VALIDATION_RULES = {
    GWA_MIN: 70.0,
    GWA_MAX: 100.0,
    INCOME_MIN: 0,
    INCOME_MAX: 50_000_000, // 50 million max
    RESIDENCY_MIN: 0,
    RESIDENCY_MAX: 50,
    AGE_MIN: 15,
    AGE_MAX: 60,
} as const;

// ============================================================
// SCORING WEIGHTS
// ============================================================

export const SCORING_WEIGHTS = {
    PRIORITY_COURSE: 20,
    PUBLIC_SHS: 10,
    STRAND_MATCH: 5,
    PRIORITY_STRAND: 10,
    DOCUMENTS_COMPLETE: 15,
    INCOME_LOWER: 5,
    GWA_HIGHER: 10,
    RESIDENCY_BONUS: 5,
    PWD_BONUS: 5,
    SOLO_PARENT: 5,
    INDIGENOUS: 5,
} as const;

export const MAX_POSSIBLE_SCORE = Object.values(SCORING_WEIGHTS).reduce((a, b) => a + b, 0);

// ============================================================
// UI CONSTANTS
// ============================================================

export const URGENCY_COLORS: Record<string, string> = {
    last_day: '#ef4444', // red-500
    critical: '#f97316', // orange-500
    very_urgent: '#eab308', // yellow-500
    urgent: '#facc15', // yellow-400
    soon: '#22c55e', // green-500
    normal: '#6b7280', // gray-500
};

export const PROVIDER_TYPE_COLORS: Record<ProviderType, string> = {
    Government: '#3b82f6', // blue-500
    Private: '#8b5cf6', // violet-500
    LGU: '#10b981', // emerald-500
    International: '#f59e0b', // amber-500
    NGO: '#ec4899', // pink-500
};
