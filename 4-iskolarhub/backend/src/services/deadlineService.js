/**
 * Deadline Service
 * Handles deadline calculations and urgency flags
 */

const db = require('../database/db');

/**
 * Get all deadlines with status
 */
async function getAllDeadlines(options = {}) {
    const {
        limit = 50,
        offset = 0,
        urgentOnly = false,
        providerType = null,
        sortBy = 'deadline' // 'deadline' or 'name'
    } = options;

    let whereClause = 'WHERE s.application_deadline >= CURRENT_DATE AND s.status = \'open\'';
    const params = [];
    let paramIndex = 1;

    if (urgentOnly) {
        whereClause += ' AND is_scholarship_urgent(s.application_deadline) = true';
    }

    if (providerType) {
        whereClause += ` AND s.provider_type = $${paramIndex}`;
        params.push(providerType);
        paramIndex++;
    }

    const orderBy = sortBy === 'name'
        ? 'ORDER BY s.name ASC'
        : 'ORDER BY s.application_deadline ASC';

    params.push(limit, offset);

    const result = await db.query(`
    SELECT 
      s.id,
      s.name,
      s.provider_name,
      s.provider_type,
      s.official_link,
      s.logo_url,
      s.application_start,
      s.application_deadline,
      calculate_days_remaining(s.application_deadline) as days_remaining,
      is_scholarship_urgent(s.application_deadline) as is_urgent,
      CASE 
        WHEN calculate_days_remaining(s.application_deadline) = 0 THEN 'last_day'
        WHEN calculate_days_remaining(s.application_deadline) <= 3 THEN 'critical'
        WHEN calculate_days_remaining(s.application_deadline) <= 7 THEN 'very_urgent'
        WHEN calculate_days_remaining(s.application_deadline) <= 14 THEN 'urgent'
        WHEN calculate_days_remaining(s.application_deadline) <= 30 THEN 'soon'
        ELSE 'normal'
      END as urgency_level,
      s.eligibility->>'min_gwa' as min_gwa,
      s.eligibility->>'income_ceiling' as income_ceiling,
      s.tags
    FROM scholarships s
    ${whereClause}
    ${orderBy}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `, params);

    // Get total count for pagination
    const countResult = await db.query(`
    SELECT COUNT(*) as total
    FROM scholarships s
    ${whereClause}
  `, params.slice(0, -2));

    const total = parseInt(countResult.rows[0].total);

    // Categorize deadlines
    const deadlines = result.rows.map(row => ({
        id: row.id,
        name: row.name,
        providerName: row.provider_name,
        providerType: row.provider_type,
        officialLink: row.official_link,
        logoUrl: row.logo_url,
        applicationStart: row.application_start,
        applicationDeadline: row.application_deadline,
        daysRemaining: row.days_remaining,
        isUrgent: row.is_urgent,
        urgencyLevel: row.urgency_level,
        minGwa: row.min_gwa ? parseFloat(row.min_gwa) : null,
        incomeCeiling: row.income_ceiling ? parseFloat(row.income_ceiling) : null,
        tags: row.tags
    }));

    // Summary statistics
    const summary = {
        total: total,
        critical: deadlines.filter(d => d.urgencyLevel === 'critical' || d.urgencyLevel === 'last_day').length,
        urgent: deadlines.filter(d => d.isUrgent).length,
        closingThisWeek: deadlines.filter(d => d.daysRemaining <= 7).length,
        closingThisMonth: deadlines.filter(d => d.daysRemaining <= 30).length
    };

    return {
        success: true,
        timestamp: new Date().toISOString(),
        serverDate: new Date().toISOString().split('T')[0],
        pagination: {
            total,
            limit,
            offset,
            hasMore: offset + limit < total
        },
        summary,
        deadlines
    };
}

/**
 * Get deadline for a specific scholarship
 */
async function getScholarshipDeadline(scholarshipId) {
    const result = await db.query(`
    SELECT 
      s.id,
      s.name,
      s.provider_name,
      s.application_start,
      s.application_deadline,
      calculate_days_remaining(s.application_deadline) as days_remaining,
      is_scholarship_urgent(s.application_deadline) as is_urgent,
      CASE 
        WHEN s.application_deadline < CURRENT_DATE THEN 'closed'
        WHEN s.application_start > CURRENT_DATE THEN 'not_yet_open'
        ELSE 'open'
      END as application_status,
      CASE 
        WHEN calculate_days_remaining(s.application_deadline) = 0 THEN 'last_day'
        WHEN calculate_days_remaining(s.application_deadline) <= 3 THEN 'critical'
        WHEN calculate_days_remaining(s.application_deadline) <= 7 THEN 'very_urgent'
        WHEN calculate_days_remaining(s.application_deadline) <= 14 THEN 'urgent'
        WHEN calculate_days_remaining(s.application_deadline) <= 30 THEN 'soon'
        ELSE 'normal'
      END as urgency_level
    FROM scholarships s
    WHERE s.id = $1
  `, [scholarshipId]);

    if (result.rows.length === 0) {
        return null;
    }

    const row = result.rows[0];

    return {
        id: row.id,
        name: row.name,
        providerName: row.provider_name,
        applicationStart: row.application_start,
        applicationDeadline: row.application_deadline,
        daysRemaining: row.days_remaining,
        isUrgent: row.is_urgent,
        applicationStatus: row.application_status,
        urgencyLevel: row.urgency_level,
        message: generateDeadlineMessage(row.days_remaining, row.urgency_level)
    };
}

/**
 * Get deadlines for a student's matched/saved scholarships
 */
async function getStudentDeadlines(studentId) {
    const result = await db.query(`
    SELECT 
      s.id,
      s.name,
      s.provider_name,
      s.provider_type,
      s.official_link,
      s.application_deadline,
      calculate_days_remaining(s.application_deadline) as days_remaining,
      is_scholarship_urgent(s.application_deadline) as is_urgent,
      CASE 
        WHEN calculate_days_remaining(s.application_deadline) = 0 THEN 'last_day'
        WHEN calculate_days_remaining(s.application_deadline) <= 3 THEN 'critical'
        WHEN calculate_days_remaining(s.application_deadline) <= 7 THEN 'very_urgent'
        WHEN calculate_days_remaining(s.application_deadline) <= 14 THEN 'urgent'
        WHEN calculate_days_remaining(s.application_deadline) <= 30 THEN 'soon'
        ELSE 'normal'
      END as urgency_level,
      ss.created_at as saved_at,
      mr.match_percentage
    FROM saved_scholarships ss
    JOIN scholarships s ON ss.scholarship_id = s.id
    LEFT JOIN match_results mr ON mr.scholarship_id = s.id AND mr.student_id = ss.student_id
    WHERE ss.student_id = $1
      AND s.application_deadline >= CURRENT_DATE
    ORDER BY s.application_deadline ASC
  `, [studentId]);

    const deadlines = result.rows.map(row => ({
        id: row.id,
        name: row.name,
        providerName: row.provider_name,
        providerType: row.provider_type,
        officialLink: row.official_link,
        applicationDeadline: row.application_deadline,
        daysRemaining: row.days_remaining,
        isUrgent: row.is_urgent,
        urgencyLevel: row.urgency_level,
        savedAt: row.saved_at,
        matchPercentage: row.match_percentage,
        message: generateDeadlineMessage(row.days_remaining, row.urgency_level)
    }));

    return {
        success: true,
        studentId,
        totalSaved: deadlines.length,
        urgentCount: deadlines.filter(d => d.isUrgent).length,
        deadlines
    };
}

/**
 * Generate human-readable deadline message
 */
function generateDeadlineMessage(daysRemaining, urgencyLevel) {
    switch (urgencyLevel) {
        case 'last_day':
            return '⚠️ LAST DAY TO APPLY! Submit your application today!';
        case 'critical':
            return `🔴 CRITICAL: Only ${daysRemaining} day${daysRemaining > 1 ? 's' : ''} left! Apply immediately!`;
        case 'very_urgent':
            return `🟠 VERY URGENT: ${daysRemaining} days remaining. Don't miss this deadline!`;
        case 'urgent':
            return `🟡 URGENT: ${daysRemaining} days remaining. Start your application now.`;
        case 'soon':
            return `📅 Deadline approaching: ${daysRemaining} days left. Plan your application.`;
        default:
            return `${daysRemaining} days until deadline.`;
    }
}

/**
 * Get upcoming deadlines (calendar view)
 */
async function getDeadlineCalendar(startDate, endDate) {
    const result = await db.query(`
    SELECT 
      s.application_deadline as date,
      json_agg(json_build_object(
        'id', s.id,
        'name', s.name,
        'providerName', s.provider_name,
        'providerType', s.provider_type
      ) ORDER BY s.name) as scholarships,
      COUNT(*) as count
    FROM scholarships s
    WHERE s.application_deadline BETWEEN $1 AND $2
      AND s.status = 'open'
    GROUP BY s.application_deadline
    ORDER BY s.application_deadline ASC
  `, [startDate, endDate]);

    return {
        success: true,
        startDate,
        endDate,
        entries: result.rows.map(row => ({
            date: row.date,
            count: parseInt(row.count),
            scholarships: row.scholarships
        }))
    };
}

module.exports = {
    getAllDeadlines,
    getScholarshipDeadline,
    getStudentDeadlines,
    getDeadlineCalendar,
    generateDeadlineMessage
};
