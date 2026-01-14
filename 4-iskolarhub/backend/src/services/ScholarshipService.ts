/**
 * ScholarshipService
 * ============================================================
 * The "Brain" of Iskolar-Hub: Scholarship Matching Algorithm
 * 
 * This service implements the core matching logic that connects
 * students with scholarships based on eligibility and fit.
 * 
 * @author Iskolar-Hub Team
 * @version 1.0.0
 * ============================================================
 */

import {
    Scholarship,
    QuickScanProfile,
    StudentProfile,
    MatchResult,
    ScholarshipMatch,
    ScoringBreakdown,
    ScholarshipCategory,
    DocumentType,
    GRACE_BUFFER,
    PRIORITY_COURSES,
    MAX_POSSIBLE_SCORE,
} from '@iskolarhub/shared';

// ============================================================
// SCORING CONFIGURATION
// ============================================================

/**
 * Scoring weights for the matching algorithm
 */
const SCORING_CONFIG = {
    BASE_SCORE: 50,
    ACADEMIC_MATCH_BONUS: 20,
    COURSE_PRIORITY_BONUS: 20,
    PUBLIC_SCHOOL_BONUS: 10,
    URGENCY_BONUS: 5,
    STRAND_MATCH_BONUS: 5,
    INCOME_LOWER_BONUS: 5,
    RESIDENCY_BONUS: 5,
} as const;

/**
 * Maximum possible score (for percentage calculation)
 */
const MAX_SCORE =
    SCORING_CONFIG.BASE_SCORE +
    SCORING_CONFIG.ACADEMIC_MATCH_BONUS +
    SCORING_CONFIG.COURSE_PRIORITY_BONUS +
    SCORING_CONFIG.PUBLIC_SCHOOL_BONUS +
    SCORING_CONFIG.URGENCY_BONUS +
    SCORING_CONFIG.STRAND_MATCH_BONUS +
    SCORING_CONFIG.INCOME_LOWER_BONUS +
    SCORING_CONFIG.RESIDENCY_BONUS;

// ============================================================
// TYPES
// ============================================================

/**
 * Input for matching algorithm
 */
export interface MatchInput {
    gwa: number;
    annualIncome: number;
    shsType: 'Public' | 'Private';
    strand?: string;
    targetCourse?: string;
    cityId?: number;
    residencyYears?: number;
    isPwd?: boolean;
    isSoloParentChild?: boolean;
    isIndigenous?: boolean;
    documentsReady?: DocumentType[];
}

/**
 * Filter result with reason
 */
interface FilterResult {
    passed: boolean;
    reason?: string;
    isNearMatch?: boolean;
}

/**
 * Scoring result with breakdown
 */
interface ScoringResult {
    score: number;
    reasons: string[];
    warnings: string[];
    breakdown: Partial<ScoringBreakdown>;
}

// ============================================================
// SCHOLARSHIP SERVICE CLASS
// ============================================================

export class ScholarshipService {

    // ============================================================
    // HARD FILTERS (Pre-Qualification)
    // ============================================================

    /**
     * Apply GWA filter with grace buffer
     * @param studentGwa Student's GWA
     * @param minGwa Scholarship's minimum GWA
     * @returns Filter result with near-match detection
     */
    static filterByGwa(studentGwa: number, minGwa?: number): FilterResult {
        if (!minGwa) {
            return { passed: true };
        }

        // Apply grace buffer
        const effectiveMin = minGwa - GRACE_BUFFER;

        if (studentGwa >= minGwa) {
            return { passed: true };
        }

        if (studentGwa >= effectiveMin) {
            return {
                passed: true,
                isNearMatch: true,
                reason: `Your GWA (${studentGwa}) is slightly below the requirement (${minGwa}) but within the grace buffer`
            };
        }

        return {
            passed: false,
            reason: `Your GWA (${studentGwa}) is below the minimum requirement of ${minGwa}`
        };
    }

    /**
     * Apply income ceiling filter
     * @param studentIncome Student's annual household income
     * @param incomeCeiling Scholarship's income ceiling
     * @returns Filter result
     */
    static filterByIncome(studentIncome: number, incomeCeiling?: number): FilterResult {
        if (!incomeCeiling) {
            return { passed: true };
        }

        if (studentIncome <= incomeCeiling) {
            return { passed: true };
        }

        return {
            passed: false,
            reason: `Your household income (₱${studentIncome.toLocaleString()}) exceeds the ceiling of ₱${incomeCeiling.toLocaleString()}`
        };
    }

    /**
     * Apply location constraint filter
     * @param studentCityId Student's city ID
     * @param locationConstraints Scholarship's location constraints
     * @returns Filter result
     */
    static filterByLocation(
        studentCityId?: number,
        locationConstraints?: {
            nationwide?: boolean;
            region_ids?: number[];
            province_ids?: number[];
            city_ids?: number[];
        }
    ): FilterResult {
        // No constraints = nationwide
        if (!locationConstraints || locationConstraints.nationwide) {
            return { passed: true };
        }

        // No city ID provided = can't filter
        if (!studentCityId) {
            return {
                passed: true,
                reason: 'Location not provided - assuming eligible'
            };
        }

        // Check city-level constraint
        if (locationConstraints.city_ids?.length) {
            if (locationConstraints.city_ids.includes(studentCityId)) {
                return { passed: true };
            }
            return {
                passed: false,
                reason: 'This scholarship is only available in specific cities'
            };
        }

        // If only region/province constraints, pass for now (full check needs DB)
        return { passed: true };
    }

    /**
     * Apply residency requirement filter
     * @param studentResidency Student's years of residency
     * @param minResidency Minimum required years
     * @returns Filter result
     */
    static filterByResidency(
        studentResidency?: number,
        minResidency?: number
    ): FilterResult {
        if (!minResidency) {
            return { passed: true };
        }

        if (!studentResidency) {
            return {
                passed: false,
                reason: `This scholarship requires ${minResidency} years of residency`
            };
        }

        if (studentResidency >= minResidency) {
            return { passed: true };
        }

        return {
            passed: false,
            reason: `You need ${minResidency} years of residency. You have ${studentResidency} years.`
        };
    }

    /**
     * Apply strand filter
     * @param studentStrand Student's strand
     * @param allowedStrands Scholarship's allowed strands
     * @returns Filter result
     */
    static filterByStrand(
        studentStrand?: string,
        allowedStrands?: string[]
    ): FilterResult {
        if (!allowedStrands || allowedStrands.length === 0) {
            return { passed: true };
        }

        if (!studentStrand) {
            return { passed: true, reason: 'Strand not specified' };
        }

        if (allowedStrands.includes(studentStrand)) {
            return { passed: true };
        }

        return {
            passed: false,
            reason: `This scholarship is only for ${allowedStrands.join(', ')} students`
        };
    }

    /**
     * Apply all hard filters
     * @param input Student's profile
     * @param scholarship Scholarship to check
     * @returns Combined filter result
     */
    static applyHardFilters(
        input: MatchInput,
        scholarship: Scholarship
    ): { passed: boolean; reasons: string[]; isNearMatch: boolean } {
        const reasons: string[] = [];
        let isNearMatch = false;

        // GWA Filter
        const gwaResult = this.filterByGwa(input.gwa, scholarship.eligibility?.min_gwa);
        if (!gwaResult.passed) {
            return { passed: false, reasons: [gwaResult.reason!], isNearMatch: false };
        }
        if (gwaResult.isNearMatch) {
            isNearMatch = true;
            if (gwaResult.reason) reasons.push(gwaResult.reason);
        }

        // Income Filter
        const incomeResult = this.filterByIncome(
            input.annualIncome,
            scholarship.eligibility?.income_ceiling
        );
        if (!incomeResult.passed) {
            return { passed: false, reasons: [incomeResult.reason!], isNearMatch: false };
        }

        // Location Filter
        const locationResult = this.filterByLocation(
            input.cityId,
            scholarship.locationConstraints
        );
        if (!locationResult.passed) {
            return { passed: false, reasons: [locationResult.reason!], isNearMatch: false };
        }

        // Residency Filter
        const residencyResult = this.filterByResidency(
            input.residencyYears,
            scholarship.locationConstraints?.min_residency_years
        );
        if (!residencyResult.passed) {
            return { passed: false, reasons: [residencyResult.reason!], isNearMatch: false };
        }

        // Strand Filter
        const strandResult = this.filterByStrand(
            input.strand,
            scholarship.eligibility?.allowed_strands
        );
        if (!strandResult.passed) {
            return { passed: false, reasons: [strandResult.reason!], isNearMatch: false };
        }

        return { passed: true, reasons, isNearMatch };
    }

    // ============================================================
    // WEIGHTED SCORING (Ranking)
    // ============================================================

    /**
     * Calculate match score for a scholarship
     * @param input Student's profile
     * @param scholarship Scholarship to score
     * @param daysRemaining Days until deadline
     * @returns Scoring result with reasons
     */
    static calculateScore(
        input: MatchInput,
        scholarship: Scholarship,
        daysRemaining: number
    ): ScoringResult {
        let score = SCORING_CONFIG.BASE_SCORE;
        const reasons: string[] = [];
        const warnings: string[] = [];
        const breakdown: Partial<ScoringBreakdown> = {};

        // Academic Match (+20): GWA is >5% above minimum
        if (scholarship.eligibility?.min_gwa) {
            const threshold = scholarship.eligibility.min_gwa * 1.05;
            if (input.gwa >= threshold) {
                score += SCORING_CONFIG.ACADEMIC_MATCH_BONUS;
                breakdown.gwaHigherBonus = SCORING_CONFIG.ACADEMIC_MATCH_BONUS;
                reasons.push(
                    `Your GWA of ${input.gwa} exceeds the minimum requirement of ${scholarship.eligibility.min_gwa} by more than 5%`
                );
            } else if (input.gwa >= scholarship.eligibility.min_gwa) {
                // Partial bonus for meeting requirement
                const partialBonus = Math.round(SCORING_CONFIG.ACADEMIC_MATCH_BONUS * 0.5);
                score += partialBonus;
                breakdown.gwaHigherBonus = partialBonus;
                reasons.push(
                    `Your GWA of ${input.gwa} meets the minimum requirement of ${scholarship.eligibility.min_gwa}`
                );
            }
        } else {
            // No GWA requirement = everyone qualifies academically
            score += Math.round(SCORING_CONFIG.ACADEMIC_MATCH_BONUS * 0.5);
            breakdown.gwaHigherBonus = Math.round(SCORING_CONFIG.ACADEMIC_MATCH_BONUS * 0.5);
        }

        // Course Priority (+20): Target course in priority list
        if (input.targetCourse && scholarship.eligibility?.priority_courses?.length) {
            const normalizedCourse = input.targetCourse.toLowerCase();
            const isMatch = scholarship.eligibility.priority_courses.some(
                course => course.toLowerCase().includes(normalizedCourse) ||
                    normalizedCourse.includes(course.toLowerCase())
            );

            if (isMatch) {
                score += SCORING_CONFIG.COURSE_PRIORITY_BONUS;
                breakdown.priorityCourseBonus = SCORING_CONFIG.COURSE_PRIORITY_BONUS;
                reasons.push(
                    `Your target course "${input.targetCourse}" is a priority for this scholarship`
                );
            }
        }

        // Check against global priority courses
        if (input.targetCourse && !breakdown.priorityCourseBonus) {
            const normalizedCourse = input.targetCourse.toLowerCase();
            const isPriorityCourse = PRIORITY_COURSES.some(
                course => course.toLowerCase().includes(normalizedCourse) ||
                    normalizedCourse.includes(course.toLowerCase())
            );

            if (isPriorityCourse) {
                const partialBonus = Math.round(SCORING_CONFIG.COURSE_PRIORITY_BONUS * 0.5);
                score += partialBonus;
                breakdown.priorityCourseBonus = partialBonus;
                reasons.push(
                    `Your target course "${input.targetCourse}" is a nationally-prioritized field`
                );
            }
        }

        // Public School Advantage (+10)
        if (input.shsType === 'Public') {
            // Check if scholarship favors public school students
            const favorsPublic =
                scholarship.providerType === 'Private' ||
                scholarship.providerType === 'NGO' ||
                scholarship.eligibility?.shs_type_required === 'Public';

            if (favorsPublic) {
                score += SCORING_CONFIG.PUBLIC_SCHOOL_BONUS;
                breakdown.publicShsBonus = SCORING_CONFIG.PUBLIC_SCHOOL_BONUS;
                reasons.push(
                    'This scholarship prioritizes public school students'
                );
            }
        }

        // Strand Match (+5)
        if (input.strand && scholarship.eligibility?.priority_strands?.length) {
            if (scholarship.eligibility.priority_strands.includes(input.strand as any)) {
                score += SCORING_CONFIG.STRAND_MATCH_BONUS;
                breakdown.strandMatchBonus = SCORING_CONFIG.STRAND_MATCH_BONUS;
                reasons.push(
                    `Your ${input.strand} strand is prioritized for this scholarship`
                );
            }
        }

        // Income Lower Bonus (+5)
        if (scholarship.eligibility?.income_ceiling) {
            const halfCeiling = scholarship.eligibility.income_ceiling * 0.5;
            if (input.annualIncome <= halfCeiling) {
                score += SCORING_CONFIG.INCOME_LOWER_BONUS;
                breakdown.incomeLowerBonus = SCORING_CONFIG.INCOME_LOWER_BONUS;
                reasons.push(
                    'Your household income demonstrates higher financial need'
                );
            }
        }

        // Residency Bonus (+5)
        if (
            scholarship.locationConstraints?.min_residency_years &&
            input.residencyYears
        ) {
            if (input.residencyYears >= scholarship.locationConstraints.min_residency_years + 2) {
                score += SCORING_CONFIG.RESIDENCY_BONUS;
                breakdown.residencyBonus = SCORING_CONFIG.RESIDENCY_BONUS;
                reasons.push(
                    `You exceed the minimum residency requirement by ${input.residencyYears - scholarship.locationConstraints.min_residency_years} years`
                );
            }
        }

        // Urgency Bonus (+5): Deadline in less than 7 days
        if (daysRemaining <= 7 && daysRemaining > 0) {
            score += SCORING_CONFIG.URGENCY_BONUS;
            warnings.push(
                `Deadline is in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} - apply now!`
            );
        }

        // Document warnings
        if (input.documentsReady && scholarship.requiredDocuments) {
            const missing = scholarship.requiredDocuments.filter(
                doc => !input.documentsReady!.includes(doc)
            );
            if (missing.length > 0) {
                warnings.push(
                    `Missing documents: ${missing.join(', ')}`
                );
            }
        }

        return { score, reasons, warnings, breakdown };
    }

    // ============================================================
    // MAIN MATCHING FUNCTION
    // ============================================================

    /**
     * Match a student profile against a list of scholarships
     * @param input Student's profile/quick scan input
     * @param scholarships List of scholarships to match against
     * @returns Sorted array of MatchResult
     */
    static matchScholarships(
        input: MatchInput,
        scholarships: Scholarship[]
    ): MatchResult[] {
        const results: MatchResult[] = [];
        const now = new Date();

        for (const scholarship of scholarships) {
            // Calculate days remaining
            const deadline = new Date(scholarship.applicationDeadline);
            const daysRemaining = Math.ceil(
                (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            );

            // Skip expired scholarships
            if (daysRemaining < 0) {
                continue;
            }

            // Apply hard filters
            const filterResult = this.applyHardFilters(input, scholarship);

            if (!filterResult.passed) {
                // Optionally include near-miss scholarships with low score
                continue;
            }

            // Calculate weighted score
            const scoringResult = this.calculateScore(input, scholarship, daysRemaining);

            // Calculate percentage (0-100)
            const matchPercentage = Math.min(
                100,
                Math.round((scoringResult.score / MAX_SCORE) * 100)
            );

            // Add near-match warning if applicable
            if (filterResult.isNearMatch) {
                scoringResult.warnings.push(
                    'Near Match: You are slightly below a requirement but within the grace buffer'
                );
            }

            // Build the MatchResult
            const matchResult: MatchResult = {
                scholarshipId: scholarship.id,
                scholarshipName: scholarship.name,
                category: scholarship.providerType as ScholarshipCategory,
                matchScore: matchPercentage,
                reasons: scoringResult.reasons.length > 0
                    ? scoringResult.reasons
                    : ['You meet the basic eligibility requirements'],
                deadline: scholarship.applicationDeadline,
                daysRemaining,
                isUrgent: daysRemaining <= 14,
                isStrongMatch: matchPercentage >= 70,
                warnings: scoringResult.warnings.length > 0 ? scoringResult.warnings : undefined,
            };

            results.push(matchResult);
        }

        // Sort by match percentage descending
        results.sort((a, b) => b.matchScore - a.matchScore);

        return results;
    }

    /**
     * Quick match for 1-Minute Scan
     * @param profile Quick scan profile input
     * @param scholarships List of scholarships
     * @returns Top matches sorted by score
     */
    static quickMatch(
        profile: QuickScanProfile,
        scholarships: Scholarship[]
    ): MatchResult[] {
        const input: MatchInput = {
            gwa: profile.gwa,
            annualIncome: profile.annualIncome,
            shsType: profile.shsType,
            strand: profile.strand,
            targetCourse: profile.intendedCourse,
            cityId: profile.cityId,
            residencyYears: profile.residencyYears,
        };

        return this.matchScholarships(input, scholarships);
    }

    /**
     * Full match for registered students
     * @param student Full student profile
     * @param scholarships List of scholarships
     * @param documentsReady List of ready document types
     * @returns Detailed matches sorted by score
     */
    static fullMatch(
        student: StudentProfile,
        scholarships: Scholarship[],
        documentsReady: DocumentType[] = []
    ): MatchResult[] {
        const input: MatchInput = {
            gwa: student.gwa,
            annualIncome: student.annualHouseholdIncome,
            shsType: student.shsType,
            strand: student.strand,
            targetCourse: student.intendedCourse,
            cityId: student.cityId,
            residencyYears: student.residencyYears,
            isPwd: student.isPwd,
            isSoloParentChild: student.isSoloParentChild,
            isIndigenous: student.isIndigenous,
            documentsReady,
        };

        return this.matchScholarships(input, scholarships);
    }

    // ============================================================
    // UTILITY FUNCTIONS
    // ============================================================

    /**
     * Get match summary statistics
     * @param matches Array of match results
     * @returns Summary statistics
     */
    static getMatchSummary(matches: MatchResult[]): {
        total: number;
        strongMatches: number;
        moderateMatches: number;
        weakMatches: number;
        urgentDeadlines: number;
        byCategory: Record<string, number>;
    } {
        const byCategory: Record<string, number> = {};

        let strongMatches = 0;
        let moderateMatches = 0;
        let weakMatches = 0;
        let urgentDeadlines = 0;

        for (const match of matches) {
            // Count by category
            byCategory[match.category] = (byCategory[match.category] || 0) + 1;

            // Count by strength
            if (match.matchScore >= 70) {
                strongMatches++;
            } else if (match.matchScore >= 40) {
                moderateMatches++;
            } else {
                weakMatches++;
            }

            // Count urgent
            if (match.isUrgent) {
                urgentDeadlines++;
            }
        }

        return {
            total: matches.length,
            strongMatches,
            moderateMatches,
            weakMatches,
            urgentDeadlines,
            byCategory,
        };
    }

    /**
     * Filter matches by minimum score
     * @param matches Array of match results
     * @param minScore Minimum score threshold (0-100)
     * @returns Filtered matches
     */
    static filterByMinScore(matches: MatchResult[], minScore: number): MatchResult[] {
        return matches.filter(m => m.matchScore >= minScore);
    }

    /**
     * Get only strong matches (>= 70%)
     * @param matches Array of match results
     * @returns Strong matches only
     */
    static getStrongMatches(matches: MatchResult[]): MatchResult[] {
        return this.filterByMinScore(matches, 70);
    }

    /**
     * Get urgent matches (deadline within 14 days)
     * @param matches Array of match results
     * @returns Urgent matches only
     */
    static getUrgentMatches(matches: MatchResult[]): MatchResult[] {
        return matches.filter(m => m.isUrgent);
    }
}

// Export for testing
export { SCORING_CONFIG, MAX_SCORE };
