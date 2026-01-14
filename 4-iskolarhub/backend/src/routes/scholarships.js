/**
 * Scholarship Routes
 * Endpoint: /api/scholarships
 */

const express = require('express');
const router = express.Router();
const db = require('../database/db');

/**
 * GET /api/scholarships
 * Get all scholarships with optional filters
 */
router.get('/', async (req, res) => {
    try {
        const {
            limit = 50,
            offset = 0,
            providerType,
            status = 'open',
            search
        } = req.query;

        let whereConditions = ['s.status = $1'];
        const params = [status];
        let paramIndex = 2;

        if (providerType) {
            whereConditions.push(`s.provider_type = $${paramIndex}`);
            params.push(providerType);
            paramIndex++;
        }

        if (search) {
            whereConditions.push(`(s.name ILIKE $${paramIndex} OR s.provider_name ILIKE $${paramIndex})`);
            params.push(`%${search}%`);
            paramIndex++;
        }

        params.push(parseInt(limit), parseInt(offset));

        const result = await db.query(`
      SELECT 
        s.*,
        calculate_days_remaining(s.application_deadline) as days_remaining,
        is_scholarship_urgent(s.application_deadline) as is_urgent
      FROM scholarships s
      WHERE ${whereConditions.join(' AND ')}
        AND s.application_deadline >= CURRENT_DATE
      ORDER BY s.application_deadline ASC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, params);

        const countResult = await db.query(`
      SELECT COUNT(*) as total
      FROM scholarships s
      WHERE ${whereConditions.join(' AND ')}
        AND s.application_deadline >= CURRENT_DATE
    `, params.slice(0, -2));

        res.json({
            success: true,
            total: parseInt(countResult.rows[0].total),
            limit: parseInt(limit),
            offset: parseInt(offset),
            scholarships: result.rows
        });

    } catch (error) {
        console.error('Get scholarships error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch scholarships'
        });
    }
});

/**
 * GET /api/scholarships/:id
 * Get a specific scholarship by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(`
      SELECT 
        s.*,
        calculate_days_remaining(s.application_deadline) as days_remaining,
        is_scholarship_urgent(s.application_deadline) as is_urgent
      FROM scholarships s
      WHERE s.id = $1
    `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Scholarship not found'
            });
        }

        res.json({
            success: true,
            scholarship: result.rows[0]
        });

    } catch (error) {
        console.error('Get scholarship error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch scholarship'
        });
    }
});

/**
 * GET /api/scholarships/provider/:providerType
 * Get scholarships by provider type
 */
router.get('/provider/:providerType', async (req, res) => {
    try {
        const { providerType } = req.params;
        const validTypes = ['Government', 'Private', 'LGU', 'International', 'NGO'];

        if (!validTypes.includes(providerType)) {
            return res.status(400).json({
                success: false,
                error: `Invalid provider type. Must be one of: ${validTypes.join(', ')}`
            });
        }

        const result = await db.query(`
      SELECT 
        s.*,
        calculate_days_remaining(s.application_deadline) as days_remaining,
        is_scholarship_urgent(s.application_deadline) as is_urgent
      FROM scholarships s
      WHERE s.provider_type = $1
        AND s.application_deadline >= CURRENT_DATE
        AND s.status = 'open'
      ORDER BY s.application_deadline ASC
    `, [providerType]);

        res.json({
            success: true,
            providerType,
            total: result.rows.length,
            scholarships: result.rows
        });

    } catch (error) {
        console.error('Get scholarships by provider error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch scholarships'
        });
    }
});

/**
 * POST /api/scholarships
 * Create a new scholarship (admin only)
 */
router.post('/', async (req, res) => {
    try {
        const {
            name,
            providerName,
            providerType,
            description,
            officialLink,
            logoUrl,
            applicationStart,
            applicationDeadline,
            eligibility,
            locationConstraints,
            benefits,
            requiredDocuments,
            additionalDocuments,
            slotsAvailable,
            isRenewable,
            renewalRequirements,
            tags
        } = req.body;

        // Validate required fields
        if (!name || !providerName || !providerType || !applicationDeadline) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: name, providerName, providerType, applicationDeadline'
            });
        }

        const result = await db.query(`
      INSERT INTO scholarships (
        name, provider_name, provider_type, description, official_link,
        logo_url, application_start, application_deadline, eligibility,
        location_constraints, benefits, required_documents, additional_documents,
        slots_available, is_renewable, renewal_requirements, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `, [
            name,
            providerName,
            providerType,
            description,
            officialLink,
            logoUrl,
            applicationStart,
            applicationDeadline,
            JSON.stringify(eligibility || {}),
            JSON.stringify(locationConstraints || {}),
            JSON.stringify(benefits || {}),
            requiredDocuments || [],
            additionalDocuments || [],
            slotsAvailable,
            isRenewable || false,
            renewalRequirements,
            tags || []
        ]);

        res.status(201).json({
            success: true,
            scholarship: result.rows[0]
        });

    } catch (error) {
        console.error('Create scholarship error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create scholarship'
        });
    }
});

module.exports = router;
