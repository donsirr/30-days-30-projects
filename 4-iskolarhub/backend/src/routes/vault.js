/**
 * Vault Routes
 * Endpoint: /api/vault
 * Handles document status updates and vault tracking
 */

const express = require('express');
const router = express.Router();
const vaultService = require('../services/vaultService');
const { validateDocumentType, validateDocumentStatus } = require('../services/validationService');

/**
 * POST /api/vault/status
 * Update document status for a student
 * 
 * Request Body:
 * {
 *   "studentId": "uuid",
 *   "documentType": "PSA" | "Form138" | "ITR" | "GoodMoral",
 *   "status": "pending" | "uploaded" | "verified" | "rejected",
 *   "metadata": {
 *     "fileName": "document.pdf",      // for uploaded
 *     "fileUrl": "https://...",        // for uploaded
 *     "verifiedBy": "Admin Name",      // for verified
 *     "rejectionReason": "..."         // for rejected
 *   }
 * }
 */
router.post('/status', async (req, res) => {
    try {
        const { studentId, documentType, status, metadata } = req.body;

        // Validate required fields
        if (!studentId) {
            return res.status(400).json({
                success: false,
                error: 'MISSING_STUDENT_ID',
                message: 'Student ID is required'
            });
        }

        // Validate document type
        const docTypeValidation = validateDocumentType(documentType);
        if (!docTypeValidation.isValid) {
            return res.status(400).json({
                success: false,
                error: 'INVALID_DOCUMENT_TYPE',
                message: docTypeValidation.errors[0].message,
                validTypes: ['PSA', 'Form138', 'ITR', 'GoodMoral']
            });
        }

        // Validate status
        const statusValidation = validateDocumentStatus(status);
        if (!statusValidation.isValid) {
            return res.status(400).json({
                success: false,
                error: 'INVALID_STATUS',
                message: statusValidation.errors[0].message,
                validStatuses: ['pending', 'uploaded', 'verified', 'rejected']
            });
        }

        // Validate rejection reason if status is rejected
        if (status === 'rejected' && (!metadata || !metadata.rejectionReason)) {
            return res.status(400).json({
                success: false,
                error: 'MISSING_REJECTION_REASON',
                message: 'Rejection reason is required when setting status to rejected'
            });
        }

        const result = await vaultService.updateDocumentStatus(
            studentId,
            documentType,
            status,
            metadata || {}
        );

        res.json({
            success: true,
            message: `Document status updated to "${status}"`,
            ...result
        });

    } catch (error) {
        console.error('Vault status update error:', error);

        if (error.message === 'Student not found') {
            return res.status(404).json({
                success: false,
                error: 'STUDENT_NOT_FOUND',
                message: 'Student not found with the provided ID'
            });
        }

        res.status(500).json({
            success: false,
            error: 'UPDATE_FAILED',
            message: 'Failed to update document status'
        });
    }
});

/**
 * POST /api/vault/status/batch
 * Update multiple document statuses at once
 * 
 * Request Body:
 * {
 *   "studentId": "uuid",
 *   "updates": [
 *     { "documentType": "PSA", "status": "uploaded", "metadata": { "fileName": "psa.pdf" } },
 *     { "documentType": "Form138", "status": "verified" }
 *   ]
 * }
 */
router.post('/status/batch', async (req, res) => {
    try {
        const { studentId, updates } = req.body;

        if (!studentId) {
            return res.status(400).json({
                success: false,
                error: 'MISSING_STUDENT_ID',
                message: 'Student ID is required'
            });
        }

        if (!updates || !Array.isArray(updates) || updates.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'INVALID_UPDATES',
                message: 'Updates array is required and must not be empty'
            });
        }

        const result = await vaultService.batchUpdateDocumentStatus(studentId, updates);

        res.json({
            success: result.success,
            message: result.success
                ? `Successfully updated ${result.updatedDocuments.length} document(s)`
                : `Updated ${result.updatedDocuments.length} document(s) with ${result.errors.length} error(s)`,
            ...result
        });

    } catch (error) {
        console.error('Batch update error:', error);
        res.status(500).json({
            success: false,
            error: 'BATCH_UPDATE_FAILED',
            message: 'Failed to process batch update'
        });
    }
});

/**
 * GET /api/vault/:studentId
 * Get vault status for a student
 */
router.get('/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;

        const vaultStatus = await vaultService.getVaultStatus(studentId);

        res.json({
            success: true,
            ...vaultStatus
        });

    } catch (error) {
        console.error('Get vault status error:', error);
        res.status(500).json({
            success: false,
            error: 'FETCH_FAILED',
            message: 'Failed to fetch vault status'
        });
    }
});

/**
 * POST /api/vault/check-eligibility
 * Check document eligibility for a specific scholarship
 * 
 * Request Body:
 * {
 *   "studentId": "uuid",
 *   "requiredDocuments": ["PSA", "Form138", "ITR"]
 * }
 */
router.post('/check-eligibility', async (req, res) => {
    try {
        const { studentId, requiredDocuments } = req.body;

        if (!studentId) {
            return res.status(400).json({
                success: false,
                error: 'MISSING_STUDENT_ID',
                message: 'Student ID is required'
            });
        }

        if (!requiredDocuments || !Array.isArray(requiredDocuments)) {
            return res.status(400).json({
                success: false,
                error: 'INVALID_DOCUMENTS',
                message: 'Required documents array is required'
            });
        }

        const result = await vaultService.checkDocumentEligibility(studentId, requiredDocuments);

        res.json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error('Check eligibility error:', error);
        res.status(500).json({
            success: false,
            error: 'CHECK_FAILED',
            message: 'Failed to check document eligibility'
        });
    }
});

module.exports = router;
