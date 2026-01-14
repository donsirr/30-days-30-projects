/**
 * Deadline Routes
 * Endpoint: /api/deadlines
 */

const express = require('express');
const router = express.Router();
const deadlineService = require('../services/deadlineService');

/**
 * GET /api/deadlines
 * Get all scholarship deadlines with optional filters
 * 
 * Query Parameters:
 * - limit: number (default 50)
 * - offset: number (default 0)
 * - urgentOnly: boolean (default false)
 * - providerType: string (Government/Private/LGU/International/NGO)
 * - sortBy: string (deadline/name)
 */
router.get('/', async (req, res) => {
    try {
        const options = {
            limit: parseInt(req.query.limit) || 50,
            offset: parseInt(req.query.offset) || 0,
            urgentOnly: req.query.urgentOnly === 'true',
            providerType: req.query.providerType || null,
            sortBy: req.query.sortBy || 'deadline'
        };

        const results = await deadlineService.getAllDeadlines(options);
        res.json(results);

    } catch (error) {
        console.error('Deadlines error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch deadlines'
        });
    }
});

/**
 * GET /api/deadlines/urgent
 * Get only urgent deadlines (< 14 days)
 */
router.get('/urgent', async (req, res) => {
    try {
        const results = await deadlineService.getAllDeadlines({
            urgentOnly: true,
            limit: 20
        });
        res.json(results);

    } catch (error) {
        console.error('Urgent deadlines error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch urgent deadlines'
        });
    }
});

/**
 * GET /api/deadlines/calendar
 * Get deadlines in calendar format for a date range
 * 
 * Query Parameters:
 * - startDate: string (YYYY-MM-DD, default: today)
 * - endDate: string (YYYY-MM-DD, default: 3 months from today)
 */
router.get('/calendar', async (req, res) => {
    try {
        const today = new Date();
        const threeMonthsLater = new Date(today);
        threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

        const startDate = req.query.startDate || today.toISOString().split('T')[0];
        const endDate = req.query.endDate || threeMonthsLater.toISOString().split('T')[0];

        const results = await deadlineService.getDeadlineCalendar(startDate, endDate);
        res.json(results);

    } catch (error) {
        console.error('Calendar error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch calendar deadlines'
        });
    }
});

/**
 * GET /api/deadlines/student/:studentId
 * Get deadlines for a student's saved scholarships
 */
router.get('/student/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const results = await deadlineService.getStudentDeadlines(studentId);
        res.json(results);

    } catch (error) {
        console.error('Student deadlines error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch student deadlines'
        });
    }
});

/**
 * GET /api/deadlines/:scholarshipId
 * Get deadline info for a specific scholarship
 */
router.get('/:scholarshipId', async (req, res) => {
    try {
        const { scholarshipId } = req.params;
        const result = await deadlineService.getScholarshipDeadline(scholarshipId);

        if (!result) {
            return res.status(404).json({
                success: false,
                error: 'Scholarship not found'
            });
        }

        res.json({
            success: true,
            deadline: result
        });

    } catch (error) {
        console.error('Scholarship deadline error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch scholarship deadline'
        });
    }
});

module.exports = router;
