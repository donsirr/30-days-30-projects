/**
 * Student Routes
 * Endpoint: /api/students
 */

const express = require('express');
const router = express.Router();
const db = require('../database/db');

/**
 * POST /api/students
 * Create a new student profile
 */
router.post('/', async (req, res) => {
    try {
        const {
            firstName,
            middleName,
            lastName,
            email,
            phone,
            birthDate,
            gwa,
            strand,
            shsType,
            shsSchoolName,
            graduationYear,
            intendedCourse,
            intendedUniversity,
            annualHouseholdIncome,
            isSoloParentChild,
            isPwd,
            isIndigenous,
            cityId,
            residencyYears,
            permanentAddress
        } = req.body;

        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'gwa', 'shsType', 'annualHouseholdIncome'];
        const missingFields = requiredFields.filter(field => req.body[field] === undefined);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Check if email already exists
        const existingUser = await db.query('SELECT id FROM students WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                error: 'Email already registered'
            });
        }

        const result = await db.query(`
      INSERT INTO students (
        first_name, middle_name, last_name, email, phone, birth_date,
        gwa, strand, shs_type, shs_school_name, graduation_year,
        intended_course, intended_university, annual_household_income,
        is_solo_parent_child, is_pwd, is_indigenous, city_id,
        residency_years, permanent_address, profile_completion_percentage
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING *
    `, [
            firstName,
            middleName,
            lastName,
            email,
            phone,
            birthDate,
            gwa,
            strand,
            shsType,
            shsSchoolName,
            graduationYear || 2026,
            intendedCourse,
            intendedUniversity,
            annualHouseholdIncome,
            isSoloParentChild || false,
            isPwd || false,
            isIndigenous || false,
            cityId,
            residencyYears || 0,
            permanentAddress,
            calculateProfileCompletion(req.body)
        ]);

        res.status(201).json({
            success: true,
            student: result.rows[0]
        });

    } catch (error) {
        console.error('Create student error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create student profile'
        });
    }
});

/**
 * GET /api/students/:id
 * Get a student profile by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(`
      SELECT 
        s.*,
        cm.name as city_name,
        p.name as province_name,
        r.name as region_name
      FROM students s
      LEFT JOIN cities_municipalities cm ON s.city_id = cm.id
      LEFT JOIN provinces p ON cm.province_id = p.id
      LEFT JOIN regions r ON p.region_id = r.id
      WHERE s.id = $1
    `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }

        // Get document status
        const docsResult = await db.query(`
      SELECT document_type, status, uploaded_at
      FROM student_documents
      WHERE student_id = $1
    `, [id]);

        const student = result.rows[0];
        student.documents = docsResult.rows;

        res.json({
            success: true,
            student
        });

    } catch (error) {
        console.error('Get student error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch student profile'
        });
    }
});

/**
 * PUT /api/students/:id
 * Update a student profile
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Check if student exists
        const existing = await db.query('SELECT id FROM students WHERE id = $1', [id]);
        if (existing.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }

        // Build dynamic update query
        const updateFields = [];
        const values = [];
        let paramIndex = 1;

        const fieldMapping = {
            firstName: 'first_name',
            middleName: 'middle_name',
            lastName: 'last_name',
            phone: 'phone',
            birthDate: 'birth_date',
            gwa: 'gwa',
            strand: 'strand',
            shsType: 'shs_type',
            shsSchoolName: 'shs_school_name',
            graduationYear: 'graduation_year',
            intendedCourse: 'intended_course',
            intendedUniversity: 'intended_university',
            annualHouseholdIncome: 'annual_household_income',
            isSoloParentChild: 'is_solo_parent_child',
            isPwd: 'is_pwd',
            isIndigenous: 'is_indigenous',
            cityId: 'city_id',
            residencyYears: 'residency_years',
            permanentAddress: 'permanent_address'
        };

        for (const [jsField, dbField] of Object.entries(fieldMapping)) {
            if (updates[jsField] !== undefined) {
                updateFields.push(`${dbField} = $${paramIndex}`);
                values.push(updates[jsField]);
                paramIndex++;
            }
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No valid fields to update'
            });
        }

        values.push(id);

        const result = await db.query(`
      UPDATE students
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *
    `, values);

        res.json({
            success: true,
            student: result.rows[0]
        });

    } catch (error) {
        console.error('Update student error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update student profile'
        });
    }
});

/**
 * POST /api/students/:id/save-scholarship
 * Save a scholarship to student's list
 */
router.post('/:id/save-scholarship', async (req, res) => {
    try {
        const { id } = req.params;
        const { scholarshipId, notes } = req.body;

        if (!scholarshipId) {
            return res.status(400).json({
                success: false,
                error: 'Scholarship ID is required'
            });
        }

        const result = await db.query(`
      INSERT INTO saved_scholarships (student_id, scholarship_id, notes)
      VALUES ($1, $2, $3)
      ON CONFLICT (student_id, scholarship_id) DO UPDATE SET notes = $3
      RETURNING *
    `, [id, scholarshipId, notes]);

        res.json({
            success: true,
            saved: result.rows[0]
        });

    } catch (error) {
        console.error('Save scholarship error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save scholarship'
        });
    }
});

/**
 * GET /api/students/:id/saved-scholarships
 * Get student's saved scholarships
 */
router.get('/:id/saved-scholarships', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(`
      SELECT 
        ss.*,
        s.name,
        s.provider_name,
        s.provider_type,
        s.application_deadline,
        calculate_days_remaining(s.application_deadline) as days_remaining,
        is_scholarship_urgent(s.application_deadline) as is_urgent
      FROM saved_scholarships ss
      JOIN scholarships s ON ss.scholarship_id = s.id
      WHERE ss.student_id = $1
      ORDER BY s.application_deadline ASC
    `, [id]);

        res.json({
            success: true,
            total: result.rows.length,
            savedScholarships: result.rows
        });

    } catch (error) {
        console.error('Get saved scholarships error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch saved scholarships'
        });
    }
});

/**
 * Calculate profile completion percentage
 */
function calculateProfileCompletion(profile) {
    const fields = [
        'firstName', 'lastName', 'email', 'phone', 'birthDate',
        'gwa', 'strand', 'shsType', 'shsSchoolName',
        'intendedCourse', 'intendedUniversity', 'annualHouseholdIncome',
        'cityId', 'residencyYears', 'permanentAddress'
    ];

    const filledFields = fields.filter(field => profile[field] !== undefined && profile[field] !== null && profile[field] !== '');
    return Math.round((filledFields.length / fields.length) * 100);
}

module.exports = router;
