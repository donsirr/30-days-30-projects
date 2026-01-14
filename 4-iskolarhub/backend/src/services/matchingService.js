/**
 * Scholarship Matching Service
 * Core algorithm for matching students with scholarships
 * 
 * Matching Process:
 * Phase 1 (Hard Filters): Eliminate non-eligible scholarships
 * Phase 2 (Scoring): Rank remaining matches with weighted scoring
 * Phase 3 (Output): Return sorted results with match percentages
 */

const db = require('../database/db');

// Scoring weights for Phase 2
const SCORING_WEIGHTS = {
    PRIORITY_COURSE: 20,      // Student's course is a priority for provider
    PUBLIC_SHS: 10,           // Student is from public SHS (favored by some providers)
    STRAND_MATCH: 5,          // Student's strand matches allowed strands
    PRIORITY_STRAND: 10,      // Student's strand is a priority strand
    DOCUMENTS_COMPLETE: 15,   // All required documents are ready
    INCOME_LOWER: 5,          // Income significantly below ceiling (more needy)
    GWA_HIGHER: 10,           // GWA above minimum threshold bonus
    RESIDENCY_BONUS: 5,       // Meets residency requirement with margin
    PWD_BONUS: 5,             // PWD status bonus (some scholarships prioritize)
    SOLO_PARENT: 5,           // Solo parent child bonus
    INDIGENOUS: 5,            // Indigenous peoples bonus
};

const MAX_POSSIBLE_SCORE = Object.values(SCORING_WEIGHTS).reduce((a, b) => a + b, 0);

/**
 * Main matching function
 * @param {string} studentId - UUID of the student
 * @returns {Promise<Object>} Matching results
 */
async function matchScholarships(studentId) {
    const startTime = Date.now();

    // Fetch student profile
    const studentResult = await db.query(`
    SELECT 
      s.*,
      cm.name as city_name,
      cm.province_id,
      p.name as province_name,
      p.region_id,
      r.name as region_name
    FROM students s
    LEFT JOIN cities_municipalities cm ON s.city_id = cm.id
    LEFT JOIN provinces p ON cm.province_id = p.id
    LEFT JOIN regions r ON p.region_id = r.id
    WHERE s.id = $1
  `, [studentId]);

    if (studentResult.rows.length === 0) {
        throw new Error('Student not found');
    }

    const student = studentResult.rows[0];

    // Fetch student's document status
    const documentsResult = await db.query(`
    SELECT document_type, status
    FROM student_documents
    WHERE student_id = $1 AND status IN ('uploaded', 'verified')
  `, [studentId]);

    const uploadedDocuments = documentsResult.rows.map(d => d.document_type);

    // Phase 1: Hard Filters Query
    // This query pre-filters scholarships at the database level for performance
    const scholarshipsResult = await db.query(`
    SELECT 
      s.*,
      calculate_days_remaining(s.application_deadline) as days_remaining,
      is_scholarship_urgent(s.application_deadline) as is_urgent
    FROM scholarships s
    WHERE 
      s.application_deadline >= CURRENT_DATE
      AND s.status = 'open'
      -- GWA Filter: Student GWA must be >= minimum required
      AND (
        (s.eligibility->>'min_gwa') IS NULL 
        OR CAST(s.eligibility->>'min_gwa' AS DECIMAL) <= $1
      )
      -- Income Filter: Student income must be <= ceiling
      AND (
        (s.eligibility->>'income_ceiling') IS NULL 
        OR CAST(s.eligibility->>'income_ceiling' AS DECIMAL) >= $2
      )
      -- Location Filter: Nationwide OR matches student's location
      AND (
        (s.location_constraints->>'nationwide')::boolean = true
        OR (s.location_constraints->'region_ids') IS NULL
        OR (s.location_constraints->'region_ids') @> to_jsonb($3::int)
        OR (s.location_constraints->'province_ids') @> to_jsonb($4::int)
        OR (s.location_constraints->'city_ids') @> to_jsonb($5::int)
      )
    ORDER BY s.application_deadline ASC
  `, [
        student.gwa,
        student.annual_household_income,
        student.region_id,
        student.province_id,
        student.city_id
    ]);

    // Phase 2: Scoring each scholarship
    const matchedScholarships = [];

    for (const scholarship of scholarshipsResult.rows) {
        const scoreBreakdown = calculateScore(student, scholarship, uploadedDocuments);

        // Check residency requirement
        if (!checkResidencyRequirement(student, scholarship)) {
            continue; // Skip if residency requirement not met
        }

        // Check strand requirement
        if (!checkStrandRequirement(student, scholarship)) {
            continue; // Skip if strand not allowed
        }

        // Calculate match percentage
        const matchPercentage = Math.round((scoreBreakdown.totalScore / MAX_POSSIBLE_SCORE) * 100);

        matchedScholarships.push({
            scholarship: formatScholarshipOutput(scholarship),
            matchScore: scoreBreakdown.totalScore,
            matchPercentage: matchPercentage,
            scoringBreakdown: scoreBreakdown,
            daysRemaining: scholarship.days_remaining,
            isUrgent: scholarship.is_urgent,
            missingDocuments: getMissingDocuments(uploadedDocuments, scholarship.required_documents || []),
            isHardMatch: scoreBreakdown.allHardFiltersPassed
        });
    }

    // Phase 3: Sort by match score (descending)
    matchedScholarships.sort((a, b) => b.matchScore - a.matchScore);

    const processingTime = Date.now() - startTime;

    return {
        success: true,
        studentId: studentId,
        studentName: `${student.first_name} ${student.last_name}`,
        totalMatches: matchedScholarships.length,
        processingTimeMs: processingTime,
        timestamp: new Date().toISOString(),
        matches: matchedScholarships,
        summary: generateSummary(matchedScholarships)
    };
}

/**
 * Calculate match score for a scholarship
 */
function calculateScore(student, scholarship, uploadedDocuments) {
    const breakdown = {
        priorityCourseBonus: 0,
        publicShsBonus: 0,
        strandMatchBonus: 0,
        priorityStrandBonus: 0,
        documentsCompleteBonus: 0,
        incomeLowerBonus: 0,
        gwaHigherBonus: 0,
        residencyBonus: 0,
        pwdBonus: 0,
        soloParentBonus: 0,
        indigenousBonus: 0,
        totalScore: 0,
        allHardFiltersPassed: true
    };

    const eligibility = scholarship.eligibility || {};

    // Priority Course Bonus (+20)
    if (eligibility.priority_courses && student.intended_course) {
        const priorityCourses = eligibility.priority_courses.map(c => c.toLowerCase());
        if (priorityCourses.some(course =>
            student.intended_course.toLowerCase().includes(course) ||
            course.includes(student.intended_course.toLowerCase())
        )) {
            breakdown.priorityCourseBonus = SCORING_WEIGHTS.PRIORITY_COURSE;
        }
    }

    // Public SHS Bonus (+10)
    if (student.shs_type === 'Public') {
        // Some providers (SM, Megaworld) favor public SHS
        const publicShsFriendly = ['Private', 'NGO'];
        if (publicShsFriendly.includes(scholarship.provider_type)) {
            breakdown.publicShsBonus = SCORING_WEIGHTS.PUBLIC_SHS;
        }
    }

    // Strand Match Bonus (+5)
    if (eligibility.allowed_strands && student.strand) {
        if (eligibility.allowed_strands.includes(student.strand)) {
            breakdown.strandMatchBonus = SCORING_WEIGHTS.STRAND_MATCH;
        }
    } else if (!eligibility.allowed_strands) {
        // No strand restriction, give bonus
        breakdown.strandMatchBonus = SCORING_WEIGHTS.STRAND_MATCH;
    }

    // Priority Strand Bonus (+10)
    if (eligibility.priority_strands && student.strand) {
        if (eligibility.priority_strands.includes(student.strand)) {
            breakdown.priorityStrandBonus = SCORING_WEIGHTS.PRIORITY_STRAND;
        }
    }

    // Documents Complete Bonus (+15)
    const requiredDocs = scholarship.required_documents || [];
    if (requiredDocs.length > 0) {
        const hasAllDocs = requiredDocs.every(doc => uploadedDocuments.includes(doc));
        if (hasAllDocs) {
            breakdown.documentsCompleteBonus = SCORING_WEIGHTS.DOCUMENTS_COMPLETE;
        }
    } else {
        breakdown.documentsCompleteBonus = SCORING_WEIGHTS.DOCUMENTS_COMPLETE;
    }

    // Income Lower Bonus (+5) - If income is significantly below ceiling
    if (eligibility.income_ceiling) {
        const incomeRatio = student.annual_household_income / eligibility.income_ceiling;
        if (incomeRatio <= 0.5) {
            breakdown.incomeLowerBonus = SCORING_WEIGHTS.INCOME_LOWER;
        }
    }

    // GWA Higher Bonus (+10) - If GWA is above minimum + 5%
    if (eligibility.min_gwa) {
        const gwaMargin = student.gwa - eligibility.min_gwa;
        if (gwaMargin >= 5) {
            breakdown.gwaHigherBonus = SCORING_WEIGHTS.GWA_HIGHER;
        }
    } else {
        // No GWA requirement, give partial bonus
        breakdown.gwaHigherBonus = SCORING_WEIGHTS.GWA_HIGHER / 2;
    }

    // Residency Bonus (+5)
    const locationConstraints = scholarship.location_constraints || {};
    if (locationConstraints.min_residency_years) {
        if (student.residency_years >= locationConstraints.min_residency_years + 2) {
            breakdown.residencyBonus = SCORING_WEIGHTS.RESIDENCY_BONUS;
        }
    }

    // Special Status Bonuses
    if (student.is_pwd) {
        breakdown.pwdBonus = SCORING_WEIGHTS.PWD_BONUS;
    }
    if (student.is_solo_parent_child) {
        breakdown.soloParentBonus = SCORING_WEIGHTS.SOLO_PARENT;
    }
    if (student.is_indigenous) {
        breakdown.indigenousBonus = SCORING_WEIGHTS.INDIGENOUS;
    }

    // Calculate total score
    breakdown.totalScore =
        breakdown.priorityCourseBonus +
        breakdown.publicShsBonus +
        breakdown.strandMatchBonus +
        breakdown.priorityStrandBonus +
        breakdown.documentsCompleteBonus +
        breakdown.incomeLowerBonus +
        breakdown.gwaHigherBonus +
        breakdown.residencyBonus +
        breakdown.pwdBonus +
        breakdown.soloParentBonus +
        breakdown.indigenousBonus;

    return breakdown;
}

/**
 * Check residency requirement
 */
function checkResidencyRequirement(student, scholarship) {
    const locationConstraints = scholarship.location_constraints || {};

    if (locationConstraints.min_residency_years) {
        return student.residency_years >= locationConstraints.min_residency_years;
    }

    return true;
}

/**
 * Check strand requirement
 */
function checkStrandRequirement(student, scholarship) {
    const eligibility = scholarship.eligibility || {};

    if (eligibility.allowed_strands && eligibility.allowed_strands.length > 0) {
        return !student.strand || eligibility.allowed_strands.includes(student.strand);
    }

    return true;
}

/**
 * Get missing documents
 */
function getMissingDocuments(uploaded, required) {
    return required.filter(doc => !uploaded.includes(doc));
}

/**
 * Format scholarship for output
 */
function formatScholarshipOutput(scholarship) {
    return {
        id: scholarship.id,
        name: scholarship.name,
        providerName: scholarship.provider_name,
        providerType: scholarship.provider_type,
        description: scholarship.description,
        officialLink: scholarship.official_link,
        logoUrl: scholarship.logo_url,
        applicationDeadline: scholarship.application_deadline,
        academicYear: scholarship.academic_year,
        benefits: scholarship.benefits,
        eligibility: {
            minGwa: scholarship.eligibility?.min_gwa,
            incomeCeiling: scholarship.eligibility?.income_ceiling,
            allowedStrands: scholarship.eligibility?.allowed_strands,
            priorityCourses: scholarship.eligibility?.priority_courses
        },
        requiredDocuments: scholarship.required_documents,
        slotsAvailable: scholarship.slots_available,
        isRenewable: scholarship.is_renewable,
        tags: scholarship.tags
    };
}

/**
 * Generate summary statistics
 */
function generateSummary(matches) {
    const highMatches = matches.filter(m => m.matchPercentage >= 70).length;
    const mediumMatches = matches.filter(m => m.matchPercentage >= 40 && m.matchPercentage < 70).length;
    const lowMatches = matches.filter(m => m.matchPercentage < 40).length;
    const urgentMatches = matches.filter(m => m.isUrgent).length;

    const byProviderType = matches.reduce((acc, m) => {
        const type = m.scholarship.providerType;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    return {
        highMatches,
        mediumMatches,
        lowMatches,
        urgentDeadlines: urgentMatches,
        byProviderType
    };
}

/**
 * Quick match for 1-Minute Scan (simplified profile)
 */
async function quickMatch(profile) {
    const startTime = Date.now();

    const { gwa, annualIncome, shsType, cityId, residencyYears, strand, intendedCourse } = profile;

    // Fetch city info for location matching
    let regionId = null;
    let provinceId = null;

    if (cityId) {
        const cityResult = await db.query(`
      SELECT cm.province_id, p.region_id
      FROM cities_municipalities cm
      JOIN provinces p ON cm.province_id = p.id
      WHERE cm.id = $1
    `, [cityId]);

        if (cityResult.rows.length > 0) {
            provinceId = cityResult.rows[0].province_id;
            regionId = cityResult.rows[0].region_id;
        }
    }

    // Quick filter query
    const scholarshipsResult = await db.query(`
    SELECT 
      s.id, s.name, s.provider_name, s.provider_type, s.description,
      s.official_link, s.logo_url, s.application_deadline, s.eligibility,
      s.location_constraints, s.benefits, s.required_documents, s.tags,
      calculate_days_remaining(s.application_deadline) as days_remaining,
      is_scholarship_urgent(s.application_deadline) as is_urgent
    FROM scholarships s
    WHERE 
      s.application_deadline >= CURRENT_DATE
      AND s.status = 'open'
      AND (
        (s.eligibility->>'min_gwa') IS NULL 
        OR CAST(s.eligibility->>'min_gwa' AS DECIMAL) <= $1
      )
      AND (
        (s.eligibility->>'income_ceiling') IS NULL 
        OR CAST(s.eligibility->>'income_ceiling' AS DECIMAL) >= $2
      )
      AND (
        (s.location_constraints->>'nationwide')::boolean = true
        OR (s.location_constraints->'region_ids') IS NULL
        OR (s.location_constraints->'region_ids') @> to_jsonb($3::int)
        OR (s.location_constraints->'province_ids') @> to_jsonb($4::int)
        OR (s.location_constraints->'city_ids') @> to_jsonb($5::int)
      )
    ORDER BY s.application_deadline ASC
    LIMIT 50
  `, [gwa, annualIncome, regionId, provinceId, cityId]);

    // Calculate quick scores
    const matches = scholarshipsResult.rows.map(scholarship => {
        let score = 0;
        const eligibility = scholarship.eligibility || {};

        // Priority course bonus
        if (eligibility.priority_courses && intendedCourse) {
            const priorityCourses = eligibility.priority_courses.map(c => c.toLowerCase());
            if (priorityCourses.some(c => intendedCourse.toLowerCase().includes(c))) {
                score += SCORING_WEIGHTS.PRIORITY_COURSE;
            }
        }

        // Public SHS bonus
        if (shsType === 'Public' && ['Private', 'NGO'].includes(scholarship.provider_type)) {
            score += SCORING_WEIGHTS.PUBLIC_SHS;
        }

        // Strand match
        if (!eligibility.allowed_strands || eligibility.allowed_strands.includes(strand)) {
            score += SCORING_WEIGHTS.STRAND_MATCH;
        }

        // Priority strand
        if (eligibility.priority_strands && eligibility.priority_strands.includes(strand)) {
            score += SCORING_WEIGHTS.PRIORITY_STRAND;
        }

        const matchPercentage = Math.round((score / MAX_POSSIBLE_SCORE) * 100) + 25; // Base 25% for passing hard filters

        return {
            scholarship: formatScholarshipOutput(scholarship),
            matchPercentage: Math.min(matchPercentage, 100),
            matchScore: score,
            daysRemaining: scholarship.days_remaining,
            isUrgent: scholarship.is_urgent
        };
    });

    // Sort by match percentage
    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return {
        success: true,
        totalMatches: matches.length,
        processingTimeMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        matches: matches
    };
}

module.exports = {
    matchScholarships,
    quickMatch,
    SCORING_WEIGHTS,
    MAX_POSSIBLE_SCORE
};
