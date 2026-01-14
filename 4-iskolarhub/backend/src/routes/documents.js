/**
 * Document Routes
 * Endpoint: /api/documents
 * Handles the "Big 4" document tracking: PSA, Form 138, ITR, Good Moral
 */

const express = require('express');
const router = express.Router();
const db = require('../database/db');

// The "Big 4" required documents for most scholarships
const BIG_4_DOCUMENTS = ['PSA', 'Form138', 'ITR', 'GoodMoral'];

/**
 * GET /api/documents/student/:studentId
 * Get all document statuses for a student
 */
router.get('/student/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;

        // Get existing documents
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

        // Build complete document status including missing ones
        const documentStatus = BIG_4_DOCUMENTS.map(docType => {
            const existing = existingDocs.find(d => d.document_type === docType);
            return {
                documentType: docType,
                displayName: getDocumentDisplayName(docType),
                description: getDocumentDescription(docType),
                status: existing?.status || 'pending',
                fileName: existing?.file_name || null,
                uploadedAt: existing?.uploaded_at || null,
                verifiedAt: existing?.verified_at || null,
                rejectionReason: existing?.rejection_reason || null,
                isRequired: true
            };
        });

        const completedCount = documentStatus.filter(d =>
            d.status === 'uploaded' || d.status === 'verified'
        ).length;

        res.json({
            success: true,
            studentId,
            completionStatus: {
                completed: completedCount,
                total: BIG_4_DOCUMENTS.length,
                percentage: Math.round((completedCount / BIG_4_DOCUMENTS.length) * 100),
                isComplete: completedCount === BIG_4_DOCUMENTS.length
            },
            documents: documentStatus
        });

    } catch (error) {
        console.error('Get documents error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch document status'
        });
    }
});

/**
 * POST /api/documents/upload
 * Record a document upload (metadata only - actual file upload handled separately)
 */
router.post('/upload', async (req, res) => {
    try {
        const {
            studentId,
            documentType,
            fileName,
            fileUrl,
            fileSizeBytes,
            mimeType
        } = req.body;

        // Validate document type
        if (!BIG_4_DOCUMENTS.includes(documentType)) {
            return res.status(400).json({
                success: false,
                error: `Invalid document type. Must be one of: ${BIG_4_DOCUMENTS.join(', ')}`
            });
        }

        // Validate required fields
        if (!studentId || !documentType) {
            return res.status(400).json({
                success: false,
                error: 'studentId and documentType are required'
            });
        }

        const result = await db.query(`
      INSERT INTO student_documents (
        student_id, document_type, status, file_name, file_url,
        file_size_bytes, mime_type, uploaded_at
      ) VALUES ($1, $2, 'uploaded', $3, $4, $5, $6, CURRENT_TIMESTAMP)
      ON CONFLICT (student_id, document_type) 
      DO UPDATE SET
        status = 'uploaded',
        file_name = $3,
        file_url = $4,
        file_size_bytes = $5,
        mime_type = $6,
        uploaded_at = CURRENT_TIMESTAMP,
        rejection_reason = NULL
      RETURNING *
    `, [studentId, documentType, fileName, fileUrl, fileSizeBytes, mimeType]);

        res.json({
            success: true,
            document: result.rows[0],
            message: `${getDocumentDisplayName(documentType)} uploaded successfully`
        });

    } catch (error) {
        console.error('Upload document error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to record document upload'
        });
    }
});

/**
 * PUT /api/documents/:documentId/verify
 * Verify a document (admin action)
 */
router.put('/:documentId/verify', async (req, res) => {
    try {
        const { documentId } = req.params;
        const { verifiedBy } = req.body;

        const result = await db.query(`
      UPDATE student_documents
      SET status = 'verified', verified_at = CURRENT_TIMESTAMP, verified_by = $1
      WHERE id = $2
      RETURNING *
    `, [verifiedBy || 'System', documentId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Document not found'
            });
        }

        res.json({
            success: true,
            document: result.rows[0]
        });

    } catch (error) {
        console.error('Verify document error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to verify document'
        });
    }
});

/**
 * PUT /api/documents/:documentId/reject
 * Reject a document (admin action)
 */
router.put('/:documentId/reject', async (req, res) => {
    try {
        const { documentId } = req.params;
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({
                success: false,
                error: 'Rejection reason is required'
            });
        }

        const result = await db.query(`
      UPDATE student_documents
      SET status = 'rejected', rejection_reason = $1
      WHERE id = $2
      RETURNING *
    `, [reason, documentId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Document not found'
            });
        }

        res.json({
            success: true,
            document: result.rows[0]
        });

    } catch (error) {
        console.error('Reject document error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to reject document'
        });
    }
});

/**
 * DELETE /api/documents/:documentId
 * Delete a document
 */
router.delete('/:documentId', async (req, res) => {
    try {
        const { documentId } = req.params;

        const result = await db.query(`
      DELETE FROM student_documents
      WHERE id = $1
      RETURNING *
    `, [documentId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Document not found'
            });
        }

        res.json({
            success: true,
            message: 'Document deleted successfully'
        });

    } catch (error) {
        console.error('Delete document error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete document'
        });
    }
});

/**
 * GET /api/documents/requirements
 * Get list of required documents with descriptions
 */
router.get('/requirements', (req, res) => {
    const requirements = BIG_4_DOCUMENTS.map(docType => ({
        documentType: docType,
        displayName: getDocumentDisplayName(docType),
        description: getDocumentDescription(docType),
        acceptedFormats: ['PDF', 'JPG', 'PNG'],
        maxFileSizeMB: 5,
        tips: getDocumentTips(docType)
    }));

    res.json({
        success: true,
        requirements
    });
});

// Helper functions
function getDocumentDisplayName(docType) {
    const names = {
        'PSA': 'PSA Birth Certificate',
        'Form138': 'Form 138 (Report Card)',
        'ITR': 'Income Tax Return (ITR)',
        'GoodMoral': 'Certificate of Good Moral Character'
    };
    return names[docType] || docType;
}

function getDocumentDescription(docType) {
    const descriptions = {
        'PSA': 'Official birth certificate issued by the Philippine Statistics Authority',
        'Form138': 'Official high school report card showing your GWA/grades',
        'ITR': 'Parent/Guardian\'s latest Income Tax Return or Certificate of No Income',
        'GoodMoral': 'Good Moral Certificate from your current/previous school'
    };
    return descriptions[docType] || '';
}

function getDocumentTips(docType) {
    const tips = {
        'PSA': [
            'Must be an authenticated copy from PSA',
            'Order online via PSA Serbilis if you don\'t have one',
            'Scan both front and back if applicable'
        ],
        'Form138': [
            'Ensure all grades are visible and readable',
            'Include all semesters/grading periods',
            'Must show school seal and signature'
        ],
        'ITR': [
            'If parents have no ITR, get a Certificate of No Income from Barangay',
            'BIR Form 2316 is also acceptable for employed parents',
            'Must be for the latest tax year'
        ],
        'GoodMoral': [
            'Must be issued within the last 6 months',
            'Should be on official school letterhead',
            'Must have school registrar signature'
        ]
    };
    return tips[docType] || [];
}

module.exports = router;
