/**
 * @iskolarhub/shared - Types
 * ============================================================
 * THE CONTRACT between Frontend (Gemini 3 Pro) and Backend (Claude Opus 4.5)
 * 
 * This file defines all shared TypeScript interfaces for the Iskolar-Hub platform.
 * Any changes here will trigger type errors in both frontend and backend if they
 * are no longer compliant.
 * 
 * @author Iskolar-Hub Team
 * @version 1.0.0
 * @since 2026-01-14
 * ============================================================
 */

// ============================================================
// ENUMS & TYPE ALIASES
// ============================================================

/**
 * Scholarship provider category
 * - Government: DOST, CHED, TESDA, etc.
 * - Private: SM Foundation, Ayala, Megaworld, etc.
 * - LGU: City/Municipal scholarships (Makati, Taguig, QC)
 * - International: Foreign government/org scholarships
 * - NGO: Non-profit organizations
 */
export type ProviderType = 'Government' | 'Private' | 'LGU' | 'International' | 'NGO';

/**
 * Scholarship category (alias for ProviderType for cleaner imports)
 */
export type ScholarshipCategory = ProviderType;

/**
 * Senior High School type
 */
export type ShsType = 'Public' | 'Private';

/**
 * SHS Academic/Track strands
 */
export type StrandType = 'STEM' | 'ABM' | 'HUMSS' | 'GAS' | 'TVL' | 'Sports' | 'Arts';

/**
 * The "Big 4" required documents for most scholarships
 */
export type DocumentType = 'PSA' | 'Form138' | 'ITR' | 'GoodMoral';

/**
 * Document processing status
 */
export type DocumentStatus = 'pending' | 'uploaded' | 'verified' | 'rejected';

/**
 * Scholarship application status
 */
export type ScholarshipStatus = 'open' | 'closed' | 'upcoming';

/**
 * Deadline urgency levels
 */
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
 * This is the core output structure from the matching engine
 */
export interface ScholarshipMatch {
    /** The matched scholarship details */
    scholarship: Scholarship;
    /** Raw match score (0 to MAX_POSSIBLE_SCORE) */
    matchScore: number;
    /** Percentage match (0-100) */
    matchPercentage: number;
    /** Detailed breakdown of how the score was calculated */
    scoringBreakdown: ScoringBreakdown;
    /** Days until application deadline */
    daysRemaining: number;
    /** True if deadline is within 14 days */
    isUrgent: boolean;
    /** Documents the student still needs to upload */
    missingDocuments: DocumentType[];
    /** True if all hard eligibility requirements are met */
    isHardMatch: boolean;
}

/**
 * Simplified match result with human-readable reasons
 * Used for quick display in UI cards
 */
export interface MatchResult {
    /** Scholarship ID */
    scholarshipId: string;
    /** Scholarship name */
    scholarshipName: string;
    /** Provider/Category (LGU, National, Private) */
    category: ScholarshipCategory;
    /** Match score percentage (0-100) */
    matchScore: number;
    /** Human-readable reasons why this scholarship matched */
    reasons: string[];
    /** Application deadline */
    deadline: string;
    /** Days remaining until deadline */
    daysRemaining: number;
    /** Is the deadline urgent (<14 days)? */
    isUrgent: boolean;
    /** Is this a strong match (>70%)? */
    isStrongMatch: boolean;
    /** Missing eligibility reasons (if any) */
    warnings?: string[];
}

/**
 * Match results summary statistics
 */
export interface MatchSummary {
    /** Matches with >70% score */
    highMatches: number;
    /** Matches with 40-70% score */
    mediumMatches: number;
    /** Matches with <40% score */
    lowMatches: number;
    /** Scholarships with urgent deadlines */
    urgentDeadlines: number;
    /** Count by provider type */
    byProviderType: Record<ProviderType, number>;
}

/**
 * Full match response from /api/match endpoint
 */
export interface MatchResponse {
    success: boolean;
    studentId?: string;
    studentName?: string;
    totalMatches: number;
    processingTimeMs: number;
    timestamp: string;
    /** Detailed matches (for full profile matching) */
    matches: ScholarshipMatch[];
    /** Simplified results (for quick scan) */
    results?: MatchResult[];
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
