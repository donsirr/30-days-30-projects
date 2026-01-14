/**
 * Match Routes
 * Endpoint: /api/match
 */

const express = require('express');
const router = express.Router();
const matchingService = require('../services/matchingService');

/**
 * POST /api/match
 * Full matching for registered students
 * 
 * Request Body:
 * {
 *   "studentId": "uuid"
 * }
 */
router.post('/', async (req, res) => {
    try {
        const { studentId } = req.body;

        if (!studentId) {
            return res.status(400).json({
                success: false,
                error: 'Student ID is required'
            });
        }

        const results = await matchingService.matchScholarships(studentId);
        res.json(results);

    } catch (error) {
        console.error('Match error:', error);

        if (error.message === 'Student not found') {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to process matching request',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * POST /api/match/quick
 * Quick matching for 1-Minute Scan (anonymous/simplified)
 * 
 * Request Body:
 * {
 *   "gwa": 88.5,
 *   "annualIncome": 300000,
 *   "shsType": "Public",
 *   "cityId": 101,
 *   "residencyYears": 5,
 *   "strand": "STEM",
 *   "intendedCourse": "Computer Science"
 * }
 */
router.post('/quick', async (req, res) => {
    try {
        const profile = req.body;

        // Validate required fields
        const requiredFields = ['gwa', 'annualIncome', 'shsType'];
        const missingFields = requiredFields.filter(field => profile[field] === undefined);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Validate GWA range
        if (profile.gwa < 0 || profile.gwa > 100) {
            return res.status(400).json({
                success: false,
                error: 'GWA must be between 0 and 100'
            });
        }

        // Validate SHS type
        if (!['Public', 'Private'].includes(profile.shsType)) {
            return res.status(400).json({
                success: false,
                error: 'SHS type must be either "Public" or "Private"'
            });
        }

        const results = await matchingService.quickMatch(profile);
        res.json(results);

    } catch (error) {
        console.error('Quick match error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process quick matching request',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * GET /api/match/scoring-weights
 * Get the scoring weights used in matching algorithm
 */
router.get('/scoring-weights', (req, res) => {
    res.json({
        success: true,
        weights: matchingService.SCORING_WEIGHTS,
        maxPossibleScore: matchingService.MAX_POSSIBLE_SCORE,
        description: {
            PRIORITY_COURSE: 'Student\'s intended course matches scholarship priority',
            PUBLIC_SHS: 'Student is from public SHS (favored by some private providers)',
            STRAND_MATCH: 'Student\'s strand is allowed by the scholarship',
            PRIORITY_STRAND: 'Student\'s strand is a priority for the scholarship',
            DOCUMENTS_COMPLETE: 'All required documents are ready',
            INCOME_LOWER: 'Income is significantly below the ceiling (more needy)',
            GWA_HIGHER: 'GWA exceeds minimum requirement by 5+ points',
            RESIDENCY_BONUS: 'Exceeds minimum residency requirement',
            PWD_BONUS: 'Person with disability status',
            SOLO_PARENT: 'Child of solo parent',
            INDIGENOUS: 'Indigenous peoples member'
        }
    });
});

module.exports = router;
