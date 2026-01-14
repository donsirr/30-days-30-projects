/**
 * Application Constants
 * Centralized constants for validation and business logic
 */

// Document types for the "Big 4"
const DOCUMENT_TYPES = ['PSA', 'Form138', 'ITR', 'GoodMoral'];

// Document statuses
const DOCUMENT_STATUSES = ['pending', 'uploaded', 'verified', 'rejected'];

// Valid SHS types
const SHS_TYPES = ['Public', 'Private'];

// Valid strands
const STRAND_TYPES = ['STEM', 'ABM', 'HUMSS', 'GAS', 'TVL', 'Sports', 'Arts'];

// Provider types
const PROVIDER_TYPES = ['Government', 'Private', 'LGU', 'International', 'NGO'];

// Standardized Philippine Degree Programs
const DEGREE_PROGRAMS = [
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
    'Foreign Service'
];

// LGU Providers with scholarship programs (City ID -> LGU Info)
const LGU_PROVIDERS = {
    2: {
        name: 'Makati City',
        scholarshipName: 'Makati City College Scholarship',
        minResidencyYears: 3,
        requiresProofOfResidency: true
    },
    3: {
        name: 'Taguig City',
        scholarshipName: 'Taguig City University Scholarship',
        minResidencyYears: 5,
        requiresProofOfResidency: true
    },
    4: {
        name: 'Quezon City',
        scholarshipName: 'QC-CHED Expanded Scholarship Program',
        minResidencyYears: 3,
        requiresProofOfResidency: true
    },
    5: {
        name: 'Pasig City',
        scholarshipName: 'Pamantasan ng Lungsod ng Pasig Scholarship',
        minResidencyYears: 3,
        requiresProofOfResidency: true
    },
    6: {
        name: 'Mandaluyong City',
        scholarshipName: 'Mandaluyong City Scholarship',
        minResidencyYears: 2,
        requiresProofOfResidency: true
    },
    8: {
        name: 'Muntinlupa City',
        scholarshipName: 'Muntinlupa City Scholarship Program',
        minResidencyYears: 3,
        requiresProofOfResidency: true
    },
    11: {
        name: 'Caloocan City',
        scholarshipName: 'Caloocan City Scholarship',
        minResidencyYears: 2,
        requiresProofOfResidency: true
    },
    14: {
        name: 'Valenzuela City',
        scholarshipName: 'Valenzuela City Scholarship',
        minResidencyYears: 3,
        requiresProofOfResidency: true
    },
    15: {
        name: 'Marikina City',
        scholarshipName: 'Marikina City Scholarship',
        minResidencyYears: 2,
        requiresProofOfResidency: true
    }
};

// Philippine Cities/Municipalities with approximate coordinates for reverse geocoding
// Format: { name, cityId, lat, lng, radius (km) }
const CITY_COORDINATES = [
    // Metro Manila
    { name: 'Manila', cityId: 1, lat: 14.5995, lng: 120.9842, radius: 5 },
    { name: 'Makati', cityId: 2, lat: 14.5547, lng: 121.0244, radius: 4 },
    { name: 'Taguig', cityId: 3, lat: 14.5176, lng: 121.0509, radius: 5 },
    { name: 'Quezon City', cityId: 4, lat: 14.6760, lng: 121.0437, radius: 8 },
    { name: 'Pasig', cityId: 5, lat: 14.5764, lng: 121.0851, radius: 4 },
    { name: 'Mandaluyong', cityId: 6, lat: 14.5794, lng: 121.0359, radius: 3 },
    { name: 'Pasay', cityId: 7, lat: 14.5378, lng: 121.0014, radius: 3 },
    { name: 'Muntinlupa', cityId: 8, lat: 14.4081, lng: 121.0415, radius: 5 },
    { name: 'Parañaque', cityId: 9, lat: 14.4793, lng: 121.0198, radius: 4 },
    { name: 'Las Piñas', cityId: 10, lat: 14.4445, lng: 120.9939, radius: 4 },
    { name: 'Caloocan', cityId: 11, lat: 14.6488, lng: 120.9840, radius: 6 },
    { name: 'Malabon', cityId: 12, lat: 14.6625, lng: 120.9567, radius: 3 },
    { name: 'Navotas', cityId: 13, lat: 14.6667, lng: 120.9417, radius: 3 },
    { name: 'Valenzuela', cityId: 14, lat: 14.6942, lng: 120.9603, radius: 4 },
    { name: 'Marikina', cityId: 15, lat: 14.6507, lng: 121.1029, radius: 4 },
    { name: 'San Juan', cityId: 16, lat: 14.6019, lng: 121.0355, radius: 2 },

    // Cavite
    { name: 'Bacoor', cityId: 17, lat: 14.4624, lng: 120.9645, radius: 5 },
    { name: 'Imus', cityId: 18, lat: 14.4297, lng: 120.9367, radius: 5 },
    { name: 'Dasmariñas', cityId: 19, lat: 14.3294, lng: 120.9367, radius: 6 },
    { name: 'General Trias', cityId: 20, lat: 14.3833, lng: 120.8833, radius: 6 },
    { name: 'Cavite City', cityId: 21, lat: 14.4833, lng: 120.9000, radius: 4 },

    // Laguna
    { name: 'Santa Rosa', cityId: 22, lat: 14.3122, lng: 121.1114, radius: 5 },
    { name: 'Biñan', cityId: 23, lat: 14.3408, lng: 121.0803, radius: 4 },
    { name: 'San Pedro', cityId: 24, lat: 14.3595, lng: 121.0475, radius: 4 },
    { name: 'Calamba', cityId: 25, lat: 14.2117, lng: 121.1653, radius: 6 },

    // Rizal
    { name: 'Antipolo', cityId: 26, lat: 14.5864, lng: 121.1761, radius: 7 },
    { name: 'Cainta', cityId: 27, lat: 14.5667, lng: 121.1167, radius: 4 },
    { name: 'Taytay', cityId: 28, lat: 14.5667, lng: 121.1333, radius: 4 },

    // Bulacan
    { name: 'Meycauayan', cityId: 29, lat: 14.7333, lng: 120.9500, radius: 4 },
    { name: 'San Jose del Monte', cityId: 30, lat: 14.8139, lng: 121.0453, radius: 6 },
    { name: 'Malolos', cityId: 31, lat: 14.8433, lng: 120.8114, radius: 5 }
];

// Validation constraints
const VALIDATION_RULES = {
    GWA_MIN: 70.0,
    GWA_MAX: 100.0,
    INCOME_MIN: 0,
    INCOME_MAX: 50000000, // 50 million max
    RESIDENCY_MIN: 0,
    RESIDENCY_MAX: 50,
    AGE_MIN: 15,
    AGE_MAX: 60
};

module.exports = {
    DOCUMENT_TYPES,
    DOCUMENT_STATUSES,
    SHS_TYPES,
    STRAND_TYPES,
    PROVIDER_TYPES,
    DEGREE_PROGRAMS,
    LGU_PROVIDERS,
    CITY_COORDINATES,
    VALIDATION_RULES
};
