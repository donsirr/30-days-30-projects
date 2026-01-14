/**
 * @iskolarhub/shared
 * ============================================================
 * Shared types and constants for the Iskolar-Hub platform
 * 
 * This is "The Contract" between:
 * - Frontend (Gemini 3 Pro workspace)
 * - Backend (Claude Opus 4.5 workspace)
 * 
 * Import examples:
 * ```typescript
 * // Import types
 * import { Scholarship, StudentProfile, MatchResult } from '@iskolarhub/shared';
 * 
 * // Import constants
 * import { STRANDS, BIG_4_DOCS, PRIORITY_COURSES, GRACE_BUFFER } from '@iskolarhub/shared';
 * 
 * // Import from specific files
 * import type { QuickScanProfile } from '@iskolarhub/shared/types';
 * import { DEGREE_PROGRAMS } from '@iskolarhub/shared/constants';
 * ```
 * ============================================================
 */

// ============================================================
// TYPE EXPORTS
// ============================================================

// Enums & Type Aliases
export type {
    ProviderType,
    ScholarshipCategory,
    ShsType,
    StrandType,
    DocumentType,
    DocumentStatus,
    ScholarshipStatus,
    UrgencyLevel,
} from './types';

// Core Entities
export type {
    ScholarshipEligibility,
    LocationConstraints,
    ScholarshipBenefits,
    Scholarship,
    StudentProfile,
    QuickScanProfile,
    StudentDocument,
} from './types';

// Matching & Scoring
export type {
    ScoringBreakdown,
    ScholarshipMatch,
    MatchResult,
    MatchSummary,
    MatchResponse,
} from './types';

// Deadlines
export type {
    DeadlineEntry,
    DeadlineSummary,
} from './types';

// Document Vault
export type {
    VaultCompletion,
    VaultReadinessMessage,
    VaultStatus,
} from './types';

// Location & Residency
export type {
    City,
    LocationResult,
    LguProvider,
    RequiredAction,
    ResidencyValidation,
} from './types';

// Validation
export type {
    ValidationError,
    ValidationResult,
} from './types';

// API Responses
export type {
    ApiResponse,
    PaginatedResponse,
} from './types';

// ============================================================
// CONSTANT EXPORTS
// ============================================================

// Grade Rounding
export { GRACE_BUFFER } from './constants';

// Documents (Big 4)
export {
    DOCUMENT_TYPES,
    BIG_4_DOCS,
    DOCUMENT_DISPLAY_NAMES,
    DOCUMENT_DESCRIPTIONS
} from './constants';

// Strands
export {
    STRAND_TYPES,
    STRANDS,
    STRAND_INFO
} from './constants';
export type { StrandInfo } from './constants';

// SHS Types
export {
    SHS_TYPES,
    SHS_TYPE_INFO
} from './constants';
export type { ShsTypeInfo } from './constants';

// Provider Types
export {
    PROVIDER_TYPES,
    PROVIDER_TYPE_LABELS
} from './constants';

// Degree Programs
export {
    DEGREE_PROGRAMS,
    COURSE_CATEGORIES,
    PRIORITY_COURSES
} from './constants';

// Regions
export { REGIONS } from './constants';
export type { Region } from './constants';

// LGU Providers
export { LGU_PROVIDERS } from './constants';
export type { LguProviderInfo } from './constants';

// City Coordinates
export { CITY_COORDINATES } from './constants';
export type { CityCoordinates } from './constants';

// Validation Rules
export { VALIDATION_RULES } from './constants';

// Scoring
export {
    SCORING_WEIGHTS,
    MAX_POSSIBLE_SCORE
} from './constants';

// UI Constants
export {
    URGENCY_COLORS,
    PROVIDER_TYPE_COLORS
} from './constants';
