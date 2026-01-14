/**
 * Validation Routes
 * Endpoint: /api/validate
 * Provides validation endpoints for frontend
 */

const express = require('express');
const router = express.Router();
const {
    validateGWA,
    validateIncome,
    validateShsType,
    validateStrand,
    validateCourse,
    validateQuickScanProfile,
    validateFullProfile,
    DEGREE_PROGRAMS
} = require('../services/validationService');

/**
 * POST /api/validate/quick-scan
 * Validate all 1-Minute Scan inputs at once
 * 
 * Request Body:
 * {
 *   "gwa": 89.5,
 *   "annualIncome": 280000,
 *   "shsType": "Public",
 *   "strand": "STEM",
 *   "intendedCourse": "Computer Science",
 *   "residencyYears": 5
 * }
 */
router.post('/quick-scan', (req, res) => {
    try {
        const result = validateQuickScanProfile(req.body);

        res.json({
            success: true,
            validation: result.toJSON(),
            courseSuggestions: result.courseSuggestions,
            suggestedCourse: result.suggestedCourse,
            isReadyForMatching: result.isValid
        });

    } catch (error) {
        console.error('Quick scan validation error:', error);
        res.status(500).json({
            success: false,
            error: 'VALIDATION_FAILED',
            message: 'Failed to validate quick scan inputs'
        });
    }
});

/**
 * POST /api/validate/full-profile
 * Validate complete student profile
 */
router.post('/full-profile', (req, res) => {
    try {
        const result = validateFullProfile(req.body);

        res.json({
            success: true,
            validation: result.toJSON(),
            isReadyForRegistration: result.isValid
        });

    } catch (error) {
        console.error('Full profile validation error:', error);
        res.status(500).json({
            success: false,
            error: 'VALIDATION_FAILED',
            message: 'Failed to validate profile'
        });
    }
});

/**
 * POST /api/validate/gwa
 * Validate GWA value
 */
router.post('/gwa', (req, res) => {
    try {
        const { gwa } = req.body;
        const result = validateGWA(gwa);

        res.json({
            success: true,
            field: 'gwa',
            value: gwa,
            validation: result.toJSON()
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'VALIDATION_FAILED'
        });
    }
});

/**
 * POST /api/validate/income
 * Validate income value
 */
router.post('/income', (req, res) => {
    try {
        const { annualIncome } = req.body;
        const result = validateIncome(annualIncome);

        res.json({
            success: true,
            field: 'annualIncome',
            value: annualIncome,
            validation: result.toJSON()
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'VALIDATION_FAILED'
        });
    }
});

/**
 * POST /api/validate/course
 * Validate intended course against standardized list
 */
router.post('/course', (req, res) => {
    try {
        const { intendedCourse } = req.body;
        const result = validateCourse(intendedCourse);

        res.json({
            success: true,
            field: 'intendedCourse',
            value: intendedCourse,
            validation: result.toJSON(),
            suggestions: result.suggestions,
            suggestedCourse: result.suggestedCourse
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'VALIDATION_FAILED'
        });
    }
});

/**
 * GET /api/validate/courses
 * Get list of valid degree programs for autocomplete
 * 
 * Query Parameters:
 * - q: search query (optional)
 * - category: filter by category (optional)
 */
router.get('/courses', (req, res) => {
    try {
        const { q, category } = req.query;

        let courses = [...DEGREE_PROGRAMS];

        // Filter by search query
        if (q) {
            const query = q.toLowerCase();
            courses = courses.filter(course =>
                course.toLowerCase().includes(query)
            );
        }

        // Group by category (simple categorization)
        const categorized = {
            'Engineering': courses.filter(c => c.includes('Engineering')),
            'Information Technology': courses.filter(c =>
                c.includes('Computer') || c.includes('Information') || c.includes('Data') || c.includes('Software')
            ),
            'Business': courses.filter(c =>
                c.includes('Business') || c.includes('Accountancy') || c.includes('Marketing') ||
                c.includes('Finance') || c.includes('Economics') || c.includes('Management')
            ),
            'Health Sciences': courses.filter(c =>
                c.includes('Nursing') || c.includes('Medicine') || c.includes('Pharmacy') ||
                c.includes('Therapy') || c.includes('Medical') || c.includes('Health') || c.includes('Nutrition')
            ),
            'Sciences': courses.filter(c =>
                c.includes('Biology') || c.includes('Chemistry') || c.includes('Physics') ||
                c.includes('Mathematics') || c.includes('Environmental') || c.includes('Agriculture')
            ),
            'Education': courses.filter(c => c.includes('Education')),
            'Arts & Humanities': courses.filter(c =>
                c.includes('Arts') || c.includes('Design') || c.includes('Music') ||
                c.includes('Film') || c.includes('Communication') || c.includes('Journalism')
            ),
            'Social Sciences': courses.filter(c =>
                c.includes('Psychology') || c.includes('Political') || c.includes('Sociology') ||
                c.includes('Social') || c.includes('Philosophy') || c.includes('History')
            ),
            'Hospitality & Tourism': courses.filter(c =>
                c.includes('Hotel') || c.includes('Tourism') || c.includes('Culinary') || c.includes('Travel')
            ),
            'Others': []
        };

        res.json({
            success: true,
            total: courses.length,
            query: q || null,
            courses: q ? courses : undefined,
            categories: q ? undefined : categorized
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'FETCH_FAILED'
        });
    }
});

/**
 * GET /api/validate/strands
 * Get valid SHS strands
 */
router.get('/strands', (req, res) => {
    const strands = [
        { code: 'STEM', name: 'Science, Technology, Engineering, and Mathematics', description: 'For students pursuing science and tech-related degrees' },
        { code: 'ABM', name: 'Accountancy, Business, and Management', description: 'For students pursuing business-related degrees' },
        { code: 'HUMSS', name: 'Humanities and Social Sciences', description: 'For students pursuing social science and humanities degrees' },
        { code: 'GAS', name: 'General Academic Strand', description: 'For students who are still undecided' },
        { code: 'TVL', name: 'Technical-Vocational-Livelihood', description: 'For students pursuing technical and vocational courses' },
        { code: 'Sports', name: 'Sports Track', description: 'For students pursuing sports-related careers' },
        { code: 'Arts', name: 'Arts and Design Track', description: 'For students pursuing arts and design careers' }
    ];

    res.json({
        success: true,
        strands
    });
});

/**
 * GET /api/validate/shs-types
 * Get valid SHS types
 */
router.get('/shs-types', (req, res) => {
    const types = [
        { code: 'Public', name: 'Public School', description: 'Government-funded schools' },
        { code: 'Private', name: 'Private School', description: 'Privately-funded schools' }
    ];

    res.json({
        success: true,
        types
    });
});

module.exports = router;
