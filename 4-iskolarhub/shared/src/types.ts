/**
 * @iskolarhub/shared - Types
 * Shared TypeScript interfaces for the Iskolar-Hub platform
 * This is "The Contract" between frontend and backend
 */

// ============================================================
// ENUMS
// ============================================================

export type ProviderType = 'Government' | 'Private' | 'LGU' | 'International' | 'NGO';

export type ShsType = 'Public' | 'Private';

export type StrandType = 'STEM' | 'ABM' | 'HUMSS' | 'GAS' | 'TVL' | 'Sports' | 'Arts';

export type DocumentType = 'PSA' | 'Form138' | 'ITR' | 'GoodMoral';

export type DocumentStatus = 'pending' | 'uploaded' | 'verified' | 'rejected';

export type ScholarshipStatus = 'open' | 'closed' | 'upcoming';

export type UrgencyLevel = 'last_day' | 'critical' | 'very_urgent' | 'urgent' | 'soon' | 'normal';

// ============================================================
// CORE ENTITIES
// ============================================================

/**
 * Scholarship Eligibility Criteria (stored as JSONB in DB)
 */
export interface ScholarshipEligibility {
    min_gwa?: number;
    max_gwa?: number;
    income_ceiling?: number;
    allowed_strands?: StrandType[];
    priority_strands?: StrandType[];
    priority_courses?: string[];
    shs_type_required?: ShsType | null;
    age_limit?: number;
    is_undergraduate_only?: boolean;
    is_valedictorian_salutatorian?: boolean;
}

/**
 * Location Constraints for scholarships
 */
export interface LocationConstraints {
    nationwide?: boolean;
    region_ids?: number[];
    province_ids?: number[];
    city_ids?: number[];
    min_residency_years?: number;
}

/**
 * Scholarship Benefits
 */
export interface ScholarshipBenefits {
    tuition?: boolean;
    tuition_amount?: number | null;
    stipend?: boolean;
    stipend_amount_monthly?: number;
    book_allowance?: boolean;
    book_allowance_amount?: number;
    transportation?: boolean;
    graduation_allowance?: boolean;
    other_benefits?: string[];
}

/**
 * Core Scholarship Entity
 */
export interface Scholarship {
    id: string;
    name: string;
    providerName: string;
    providerType: ProviderType;
    description?: string;
    officialLink?: string;
    logoUrl?: string;
    applicationStart?: string; // ISO date string
    applicationDeadline: string; // ISO date string
    academicYear: string;
    status: ScholarshipStatus;
    eligibility: ScholarshipEligibility;
    locationConstraints: LocationConstraints;
    benefits: ScholarshipBenefits;
    requiredDocuments: DocumentType[];
    additionalDocuments?: string[];
    slotsAvailable?: number;
    isRenewable: boolean;
    renewalRequirements?: string;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
}

/**
 * Student Profile
 */
export interface StudentProfile {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    phone?: string;
    birthDate?: string;
    gwa: number;
    strand?: StrandType;
    shsType: ShsType;
    shsSchoolName?: string;
    graduationYear: number;
    intendedCourse?: string;
    intendedUniversity?: string;
    annualHouseholdIncome: number;
    isSoloParentChild: boolean;
    isPwd: boolean;
    isIndigenous: boolean;
    cityId?: number;
    cityName?: string;
    provinceName?: string;
    regionName?: string;
    residencyYears: number;
    permanentAddress?: string;
    profileCompletionPercentage: number;
    lastScanAt?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Quick Scan Profile (1-Minute Scan input)
 */
export interface QuickScanProfile {
    gwa: number;
    annualIncome: number;
    shsType: ShsType;
    cityId?: number;
    residencyYears?: number;
    strand?: StrandType;
    intendedCourse?: string;
}

/**
 * Student Document Record
 */
export interface StudentDocument {
    id: string;
    studentId: string;
    documentType: DocumentType;
    displayName: string;
    status: DocumentStatus;
    fileName?: string;
    fileUrl?: string;
    uploadedAt?: string;
    verifiedAt?: string;
    verifiedBy?: string;
    rejectionReason?: string;
    isRequired: boolean;
}

// ============================================================
// MATCHING & SCORING
// ============================================================

/**
 * Scoring breakdown for transparency
 */
export interface ScoringBreakdown {
    priorityCourseBonus: number;
    publicShsBonus: number;
    strandMatchBonus: number;
    priorityStrandBonus: number;
    documentsCompleteBonus: number;
    incomeLowerBonus: number;
    gwaHigherBonus: number;
    residencyBonus: number;
    pwdBonus: number;
    soloParentBonus: number;
    indigenousBonus: number;
    totalScore: number;
    allHardFiltersPassed: boolean;
}

/**
 * Individual scholarship match result
 */
export interface ScholarshipMatch {
    scholarship: Scholarship;
    matchScore: number;
    matchPercentage: number;
    scoringBreakdown: ScoringBreakdown;
    daysRemaining: number;
    isUrgent: boolean;
    missingDocuments: DocumentType[];
    isHardMatch: boolean;
}

/**
 * Match results summary
 */
export interface MatchSummary {
    highMatches: number;
    mediumMatches: number;
    lowMatches: number;
    urgentDeadlines: number;
    byProviderType: Record<ProviderType, number>;
}

/**
 * Full match response
 */
export interface MatchResponse {
    success: boolean;
    studentId?: string;
    studentName?: string;
    totalMatches: number;
    processingTimeMs: number;
    timestamp: string;
    matches: ScholarshipMatch[];
    summary: MatchSummary;
}

// ============================================================
// DEADLINES
// ============================================================

/**
 * Deadline entry
 */
export interface DeadlineEntry {
    id: string;
    name: string;
    providerName: string;
    providerType: ProviderType;
    officialLink?: string;
    logoUrl?: string;
    applicationStart?: string;
    applicationDeadline: string;
    daysRemaining: number;
    isUrgent: boolean;
    urgencyLevel: UrgencyLevel;
    minGwa?: number;
    incomeCeiling?: number;
    tags?: string[];
}

/**
 * Deadline summary
 */
export interface DeadlineSummary {
    total: number;
    critical: number;
    urgent: number;
    closingThisWeek: number;
    closingThisMonth: number;
}

// ============================================================
// DOCUMENT VAULT
// ============================================================

/**
 * Vault completion status
 */
export interface VaultCompletion {
    ready: number;
    verified: number;
    pending: number;
    rejected: number;
    percentage: number;
}

/**
 * Readiness message
 */
export interface VaultReadinessMessage {
    status: 'complete' | 'almost' | 'halfway' | 'started' | 'empty';
    icon: string;
    message: string;
    color: 'green' | 'yellow' | 'orange' | 'blue' | 'gray';
}

/**
 * Full vault status
 */
export interface VaultStatus {
    studentId: string;
    totalRequired: number;
    completion: VaultCompletion;
    isComplete: boolean;
    isFullyVerified: boolean;
    documents: StudentDocument[];
    missingDocuments: DocumentType[];
    rejectedDocuments: { documentType: DocumentType; reason: string }[];
    readinessMessage: VaultReadinessMessage;
}

// ============================================================
// LOCATION & RESIDENCY
// ============================================================

/**
 * City/Municipality
 */
export interface City {
    id: number;
    name: string;
    isCity: boolean;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
}

/**
 * Location detection result
 */
export interface LocationResult {
    success: boolean;
    city: City;
    distance: number;
    confidence: 'high' | 'medium' | 'low';
    isWithinCityBounds: boolean;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

/**
 * LGU Scholarship Provider Info
 */
export interface LguProvider {
    name: string;
    scholarshipName: string;
    minResidencyYears: number;
    requiresProofOfResidency: boolean;
    cityId: number;
}

/**
 * Required action from location detection
 */
export interface RequiredAction {
    type: 'VERIFY_RESIDENCY';
    title: string;
    message: string;
    fields: {
        name: string;
        label: string;
        type: 'number' | 'text';
        required: boolean;
        min?: number;
        max?: number;
        hint?: string;
    }[];
    scholarshipInfo: {
        name: string;
        minResidency: number;
        requiresProofOfResidency: boolean;
    };
}

/**
 * Residency validation result
 */
export interface ResidencyValidation {
    isEligible: boolean;
    lguInfo: {
        city: string;
        scholarshipName: string;
        minResidencyRequired: number;
        actualResidency: number;
    };
    message: string;
    yearsNeeded: number;
    nextSteps: string[];
}

// ============================================================
// VALIDATION
// ============================================================

/**
 * Validation error
 */
export interface ValidationError {
    field: string;
    message: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationError[];
    errorCount: number;
    warningCount: number;
}

// ============================================================
// API RESPONSES
// ============================================================

/**
 * Base API response
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
}
