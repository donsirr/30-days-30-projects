/**
 * Vault Service
 * Handles document status updates and completion tracking
 */

const db = require('../database/db');
const { DOCUMENT_TYPES, DOCUMENT_STATUSES } = require('../models/constants');

// Document display names
const DOCUMENT_DISPLAY_NAMES = {
    'PSA': 'PSA Birth Certificate',
    'Form138': 'Form 138 (Report Card)',
    'ITR': 'Income Tax Return (ITR)',
    'GoodMoral': 'Certificate of Good Moral Character'
};

/**
 * Update document status for a student
 * @param {string} studentId - Student UUID
 * @param {string} documentType - Document type (PSA, Form138, ITR, GoodMoral)
 * @param {string} status - New status (pending, uploaded, verified, rejected)
 * @param {Object} metadata - Optional metadata (fileName, rejectionReason, etc.)
 * @returns {Promise<Object>} Updated document record
 */
async function updateDocumentStatus(studentId, documentType, status, metadata = {}) {
    // Validate document type
    if (!DOCUMENT_TYPES.includes(documentType)) {
        throw new Error(`Invalid document type. Must be one of: ${DOCUMENT_TYPES.join(', ')}`);
    }

    // Validate status
    if (!DOCUMENT_STATUSES.includes(status)) {
        throw new Error(`Invalid status. Must be one of: ${DOCUMENT_STATUSES.join(', ')}`);
    }

    // Check if student exists
    const studentCheck = await db.query('SELECT id FROM students WHERE id = $1', [studentId]);
    if (studentCheck.rows.length === 0) {
        throw new Error('Student not found');
    }

    // Build the upsert query
    const now = new Date().toISOString();

    let query;
    let params;

    if (status === 'uploaded') {
        query = `
      INSERT INTO student_documents (
        student_id, document_type, status, file_name, file_url, uploaded_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (student_id, document_type) 
      DO UPDATE SET
        status = $3,
        file_name = COALESCE($4, student_documents.file_name),
        file_url = COALESCE($5, student_documents.file_url),
        uploaded_at = CASE WHEN $3 = 'uploaded' THEN $6 ELSE student_documents.uploaded_at END,
        rejection_reason = NULL,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
        params = [studentId, documentType, status, metadata.fileName, metadata.fileUrl, now];
    } else if (status === 'verified') {
        query = `
      INSERT INTO student_documents (
        student_id, document_type, status, verified_at, verified_by
      ) VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (student_id, document_type) 
      DO UPDATE SET
        status = $3,
        verified_at = $4,
        verified_by = $5,
        rejection_reason = NULL,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
        params = [studentId, documentType, status, now, metadata.verifiedBy || 'System'];
    } else if (status === 'rejected') {
        query = `
      INSERT INTO student_documents (
        student_id, document_type, status, rejection_reason
      ) VALUES ($1, $2, $3, $4)
      ON CONFLICT (student_id, document_type) 
      DO UPDATE SET
        status = $3,
        rejection_reason = $4,
        verified_at = NULL,
        verified_by = NULL,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
        params = [studentId, documentType, status, metadata.rejectionReason || 'Document rejected'];
    } else {
        // pending status
        query = `
      INSERT INTO student_documents (
        student_id, document_type, status
      ) VALUES ($1, $2, $3)
      ON CONFLICT (student_id, document_type) 
      DO UPDATE SET
        status = $3,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
        params = [studentId, documentType, status];
    }

    const result = await db.query(query, params);
    const doc = result.rows[0];

    // Get updated completion status
    const completionStatus = await getVaultStatus(studentId);

    return {
        document: {
            id: doc.id,
            documentType: doc.document_type,
            displayName: DOCUMENT_DISPLAY_NAMES[doc.document_type],
            status: doc.status,
            fileName: doc.file_name,
            uploadedAt: doc.uploaded_at,
            verifiedAt: doc.verified_at,
            verifiedBy: doc.verified_by,
            rejectionReason: doc.rejection_reason
        },
        vaultStatus: completionStatus
    };
}

/**
 * Batch update multiple document statuses
 * @param {string} studentId - Student UUID
 * @param {Array} updates - Array of { documentType, status, metadata }
 * @returns {Promise<Object>} Updated documents and vault status
 */
async function batchUpdateDocumentStatus(studentId, updates) {
    const results = [];
    const errors = [];

    for (const update of updates) {
        try {
            const result = await updateDocumentStatus(
                studentId,
                update.documentType,
                update.status,
                update.metadata || {}
            );
            results.push(result.document);
        } catch (error) {
            errors.push({
                documentType: update.documentType,
                error: error.message
            });
        }
    }

    // Get final vault status
    const vaultStatus = await getVaultStatus(studentId);

    return {
        success: errors.length === 0,
        updatedDocuments: results,
        errors: errors.length > 0 ? errors : undefined,
        vaultStatus
    };
}

/**
 * Get vault status for a student
 * @param {string} studentId - Student UUID
 * @returns {Promise<Object>} Vault completion status
 */
async function getVaultStatus(studentId) {
    const result = await db.query(`
    SELECT 
      document_type,
      status,
      file_name,
      uploaded_at,
      verified_at,
      rejection_reason
    FROM student_documents
    WHERE student_id = $1
  `, [studentId]);

    const existingDocs = result.rows;
    const existingTypes = existingDocs.map(d => d.document_type);

    // Build complete status for all required documents
    const documents = DOCUMENT_TYPES.map(docType => {
        const existing = existingDocs.find(d => d.document_type === docType);

        let statusDetails = {
            documentType: docType,
            displayName: DOCUMENT_DISPLAY_NAMES[docType],
            status: 'pending',
            isReady: false,
            isVerified: false
        };

        if (existing) {
            statusDetails = {
                ...statusDetails,
                status: existing.status,
                fileName: existing.file_name,
                uploadedAt: existing.uploaded_at,
                verifiedAt: existing.verified_at,
                rejectionReason: existing.rejection_reason,
                isReady: ['uploaded', 'verified'].includes(existing.status),
                isVerified: existing.status === 'verified'
            };
        }

        return statusDetails;
    });

    // Calculate completion metrics
    const readyCount = documents.filter(d => d.isReady).length;
    const verifiedCount = documents.filter(d => d.isVerified).length;
    const pendingCount = documents.filter(d => d.status === 'pending').length;
    const rejectedCount = documents.filter(d => d.status === 'rejected').length;

    const completionPercentage = Math.round((readyCount / DOCUMENT_TYPES.length) * 100);

    return {
        studentId,
        totalRequired: DOCUMENT_TYPES.length,
        completion: {
            ready: readyCount,
            verified: verifiedCount,
            pending: pendingCount,
            rejected: rejectedCount,
            percentage: completionPercentage
        },
        isComplete: readyCount === DOCUMENT_TYPES.length,
        isFullyVerified: verifiedCount === DOCUMENT_TYPES.length,
        documents,
        missingDocuments: documents.filter(d => d.status === 'pending').map(d => d.documentType),
        rejectedDocuments: documents.filter(d => d.status === 'rejected').map(d => ({
            documentType: d.documentType,
            reason: d.rejectionReason
        })),
        readinessMessage: getReadinessMessage(readyCount, DOCUMENT_TYPES.length)
    };
}

/**
 * Get readiness message based on completion
 */
function getReadinessMessage(ready, total) {
    const percentage = Math.round((ready / total) * 100);

    if (percentage === 100) {
        return {
            status: 'complete',
            icon: '✅',
            message: 'All documents are ready! You can now apply to scholarships.',
            color: 'green'
        };
    } else if (percentage >= 75) {
        return {
            status: 'almost',
            icon: '🔶',
            message: 'Almost there! Just a few more documents to complete.',
            color: 'yellow'
        };
    } else if (percentage >= 50) {
        return {
            status: 'halfway',
            icon: '📋',
            message: 'You\'re halfway done. Keep going!',
            color: 'orange'
        };
    } else if (percentage > 0) {
        return {
            status: 'started',
            icon: '📝',
            message: 'You\'ve started! Continue uploading your documents.',
            color: 'blue'
        };
    } else {
        return {
            status: 'empty',
            icon: '📂',
            message: 'Start by uploading your documents to the vault.',
            color: 'gray'
        };
    }
}

/**
 * Check scholarship eligibility based on documents
 * @param {string} studentId - Student UUID
 * @param {Array} requiredDocuments - Required document types
 * @returns {Promise<Object>} Eligibility check result
 */
async function checkDocumentEligibility(studentId, requiredDocuments) {
    const vaultStatus = await getVaultStatus(studentId);

    const readyDocs = vaultStatus.documents
        .filter(d => d.isReady)
        .map(d => d.documentType);

    const missingForScholarship = requiredDocuments.filter(
        doc => !readyDocs.includes(doc)
    );

    return {
        isEligible: missingForScholarship.length === 0,
        requiredDocuments: requiredDocuments.map(doc => ({
            documentType: doc,
            displayName: DOCUMENT_DISPLAY_NAMES[doc],
            isReady: readyDocs.includes(doc)
        })),
        missingDocuments: missingForScholarship.map(doc => ({
            documentType: doc,
            displayName: DOCUMENT_DISPLAY_NAMES[doc]
        })),
        message: missingForScholarship.length === 0
            ? 'You have all required documents for this scholarship!'
            : `Missing ${missingForScholarship.length} document(s): ${missingForScholarship.map(d => DOCUMENT_DISPLAY_NAMES[d]).join(', ')}`
    };
}

module.exports = {
    updateDocumentStatus,
    batchUpdateDocumentStatus,
    getVaultStatus,
    checkDocumentEligibility,
    DOCUMENT_DISPLAY_NAMES
};
