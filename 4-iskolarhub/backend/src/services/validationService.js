/**
 * Validation Service
 * Server-side validation for 1-Minute Scan and profile inputs
 */

const {
    VALIDATION_RULES,
    SHS_TYPES,
    STRAND_TYPES,
    DEGREE_PROGRAMS,
    DOCUMENT_TYPES,
    DOCUMENT_STATUSES
} = require('../models/constants');

/**
 * Validation result structure
 */
class ValidationResult {
    constructor() {
        this.isValid = true;
        this.errors = [];
        this.warnings = [];
    }

    addError(field, message) {
        this.isValid = false;
        this.errors.push({ field, message });
    }

    addWarning(field, message) {
        this.warnings.push({ field, message });
    }

    toJSON() {
        return {
            isValid: this.isValid,
            errors: this.errors,
            warnings: this.warnings,
            errorCount: this.errors.length,
            warningCount: this.warnings.length
        };
    }
}

/**
 * Validate GWA (General Weighted Average)
 * @param {number} gwa - The GWA value
 * @returns {ValidationResult}
 */
function validateGWA(gwa) {
    const result = new ValidationResult();

    if (gwa === undefined || gwa === null) {
        result.addError('gwa', 'GWA is required');
        return result;
    }

    const numGwa = parseFloat(gwa);

    if (isNaN(numGwa)) {
        result.addError('gwa', 'GWA must be a valid number');
        return result;
    }

    if (numGwa < VALIDATION_RULES.GWA_MIN) {
        result.addError('gwa', `GWA must be at least ${VALIDATION_RULES.GWA_MIN}`);
    }

    if (numGwa > VALIDATION_RULES.GWA_MAX) {
        result.addError('gwa', `GWA cannot exceed ${VALIDATION_RULES.GWA_MAX}`);
    }

    // Warnings for edge cases
    if (numGwa >= VALIDATION_RULES.GWA_MIN && numGwa < 75) {
        result.addWarning('gwa', 'A GWA below 75 may limit scholarship options');
    }

    return result;
}

/**
 * Validate annual household income
 * @param {number} income - The annual income value
 * @returns {ValidationResult}
 */
function validateIncome(income) {
    const result = new ValidationResult();

    if (income === undefined || income === null) {
        result.addError('annualIncome', 'Annual household income is required');
        return result;
    }

    const numIncome = parseInt(income);

    if (isNaN(numIncome)) {
        result.addError('annualIncome', 'Income must be a valid number');
        return result;
    }

    if (numIncome < VALIDATION_RULES.INCOME_MIN) {
        result.addError('annualIncome', 'Income must be a positive number');
    }

    if (numIncome > VALIDATION_RULES.INCOME_MAX) {
        result.addError('annualIncome', 'Income value seems unrealistic. Please verify.');
    }

    return result;
}

/**
 * Validate SHS Type
 * @param {string} shsType - The SHS type (Public/Private)
 * @returns {ValidationResult}
 */
function validateShsType(shsType) {
    const result = new ValidationResult();

    if (!shsType) {
        result.addError('shsType', 'SHS type is required');
        return result;
    }

    if (!SHS_TYPES.includes(shsType)) {
        result.addError('shsType', `SHS type must be one of: ${SHS_TYPES.join(', ')}`);
    }

    return result;
}

/**
 * Validate strand
 * @param {string} strand - The SHS strand
 * @returns {ValidationResult}
 */
function validateStrand(strand) {
    const result = new ValidationResult();

    if (!strand) {
        // Strand is optional for quick match
        return result;
    }

    if (!STRAND_TYPES.includes(strand)) {
        result.addError('strand', `Strand must be one of: ${STRAND_TYPES.join(', ')}`);
    }

    return result;
}

/**
 * Validate intended course against standardized degree programs
 * @param {string} course - The intended course
 * @returns {ValidationResult}
 */
function validateCourse(course) {
    const result = new ValidationResult();

    if (!course) {
        // Course is optional for quick match
        return result;
    }

    // Normalize for comparison
    const normalizedCourse = course.trim().toLowerCase();

    // Check for exact match (case-insensitive)
    const exactMatch = DEGREE_PROGRAMS.find(
        program => program.toLowerCase() === normalizedCourse
    );

    if (exactMatch) {
        return result; // Valid exact match
    }

    // Check for partial match
    const partialMatches = DEGREE_PROGRAMS.filter(
        program => program.toLowerCase().includes(normalizedCourse) ||
            normalizedCourse.includes(program.toLowerCase())
    );

    if (partialMatches.length === 0) {
        result.addError('intendedCourse',
            `Course "${course}" is not in the standardized list of Philippine degree programs`
        );
        result.suggestions = getSuggestedCourses(normalizedCourse);
    } else if (partialMatches.length === 1) {
        result.addWarning('intendedCourse',
            `Did you mean "${partialMatches[0]}"? Using standardized names helps with matching.`
        );
        result.suggestedCourse = partialMatches[0];
    } else {
        result.addWarning('intendedCourse',
            `Multiple matches found. Please be more specific: ${partialMatches.slice(0, 5).join(', ')}`
        );
        result.suggestions = partialMatches.slice(0, 5);
    }

    return result;
}

/**
 * Get course suggestions based on input
 */
function getSuggestedCourses(input) {
    // Simple fuzzy matching based on common words
    const words = input.split(/\s+/);

    const matches = DEGREE_PROGRAMS.filter(program => {
        const programLower = program.toLowerCase();
        return words.some(word =>
            word.length > 2 && programLower.includes(word)
        );
    });

    return matches.slice(0, 5);
}

/**
 * Validate residency years
 * @param {number} years - Years of residency
 * @returns {ValidationResult}
 */
function validateResidencyYears(years) {
    const result = new ValidationResult();

    if (years === undefined || years === null) {
        // Optional field
        return result;
    }

    const numYears = parseInt(years);

    if (isNaN(numYears)) {
        result.addError('residencyYears', 'Residency years must be a valid number');
        return result;
    }

    if (numYears < VALIDATION_RULES.RESIDENCY_MIN) {
        result.addError('residencyYears', 'Residency years cannot be negative');
    }

    if (numYears > VALIDATION_RULES.RESIDENCY_MAX) {
        result.addError('residencyYears', 'Residency years value seems unrealistic');
    }

    return result;
}

/**
 * Validate document type
 * @param {string} docType - Document type
 * @returns {ValidationResult}
 */
function validateDocumentType(docType) {
    const result = new ValidationResult();

    if (!docType) {
        result.addError('documentType', 'Document type is required');
        return result;
    }

    if (!DOCUMENT_TYPES.includes(docType)) {
        result.addError('documentType', `Document type must be one of: ${DOCUMENT_TYPES.join(', ')}`);
    }

    return result;
}

/**
 * Validate document status
 * @param {string} status - Document status
 * @returns {ValidationResult}
 */
function validateDocumentStatus(status) {
    const result = new ValidationResult();

    if (!status) {
        result.addError('status', 'Status is required');
        return result;
    }

    if (!DOCUMENT_STATUSES.includes(status)) {
        result.addError('status', `Status must be one of: ${DOCUMENT_STATUSES.join(', ')}`);
    }

    return result;
}

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {ValidationResult}
 */
function validateEmail(email) {
    const result = new ValidationResult();

    if (!email) {
        result.addError('email', 'Email is required');
        return result;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        result.addError('email', 'Invalid email format');
    }

    return result;
}

/**
 * Validate coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {ValidationResult}
 */
function validateCoordinates(lat, lng) {
    const result = new ValidationResult();

    if (lat === undefined || lat === null) {
        result.addError('latitude', 'Latitude is required');
    } else if (isNaN(parseFloat(lat))) {
        result.addError('latitude', 'Latitude must be a valid number');
    } else if (lat < -90 || lat > 90) {
        result.addError('latitude', 'Latitude must be between -90 and 90');
    }

    if (lng === undefined || lng === null) {
        result.addError('longitude', 'Longitude is required');
    } else if (isNaN(parseFloat(lng))) {
        result.addError('longitude', 'Longitude must be a valid number');
    } else if (lng < -180 || lng > 180) {
        result.addError('longitude', 'Longitude must be between -180 and 180');
    }

    // Check if coordinates are within Philippine bounds (approximately)
    const PH_BOUNDS = {
        minLat: 4.5,
        maxLat: 21.5,
        minLng: 116.0,
        maxLng: 127.0
    };

    if (result.isValid) {
        const numLat = parseFloat(lat);
        const numLng = parseFloat(lng);

        if (numLat < PH_BOUNDS.minLat || numLat > PH_BOUNDS.maxLat ||
            numLng < PH_BOUNDS.minLng || numLng > PH_BOUNDS.maxLng) {
            result.addWarning('coordinates', 'Coordinates appear to be outside the Philippines');
        }
    }

    return result;
}

/**
 * Validate complete 1-Minute Scan profile
 * @param {Object} profile - The profile data
 * @returns {ValidationResult}
 */
function validateQuickScanProfile(profile) {
    const result = new ValidationResult();

    // Validate each field
    const gwaResult = validateGWA(profile.gwa);
    const incomeResult = validateIncome(profile.annualIncome);
    const shsResult = validateShsType(profile.shsType);
    const strandResult = validateStrand(profile.strand);
    const courseResult = validateCourse(profile.intendedCourse);
    const residencyResult = validateResidencyYears(profile.residencyYears);

    // Merge all results
    const allResults = [gwaResult, incomeResult, shsResult, strandResult, courseResult, residencyResult];

    allResults.forEach(r => {
        r.errors.forEach(e => result.addError(e.field, e.message));
        r.warnings.forEach(w => result.addWarning(w.field, w.message));
    });

    // Add course suggestions if available
    if (courseResult.suggestions) {
        result.courseSuggestions = courseResult.suggestions;
    }
    if (courseResult.suggestedCourse) {
        result.suggestedCourse = courseResult.suggestedCourse;
    }

    return result;
}

/**
 * Validate full student profile
 * @param {Object} profile - Complete student profile
 * @returns {ValidationResult}
 */
function validateFullProfile(profile) {
    const result = validateQuickScanProfile(profile);

    // Additional validations for full profile
    if (!profile.firstName || profile.firstName.trim().length < 1) {
        result.addError('firstName', 'First name is required');
    }

    if (!profile.lastName || profile.lastName.trim().length < 1) {
        result.addError('lastName', 'Last name is required');
    }

    if (profile.email) {
        const emailResult = validateEmail(profile.email);
        emailResult.errors.forEach(e => result.addError(e.field, e.message));
    }

    return result;
}

module.exports = {
    ValidationResult,
    validateGWA,
    validateIncome,
    validateShsType,
    validateStrand,
    validateCourse,
    validateResidencyYears,
    validateDocumentType,
    validateDocumentStatus,
    validateEmail,
    validateCoordinates,
    validateQuickScanProfile,
    validateFullProfile,
    DEGREE_PROGRAMS
};
