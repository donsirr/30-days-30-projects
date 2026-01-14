/**
 * Location Routes
 * Endpoint: /api/location
 * Handles reverse geocoding and residency validation
 */

const express = require('express');
const router = express.Router();
const locationService = require('../services/locationService');
const { validateCoordinates, validateResidencyYears } = require('../services/validationService');

/**
 * POST /api/location/detect
 * Reverse geocode coordinates to detect city and LGU scholarships
 * 
 * Request Body:
 * {
 *   "latitude": 14.5547,
 *   "longitude": 121.0244
 * }
 */
router.post('/detect', async (req, res) => {
    try {
        const { latitude, longitude } = req.body;

        // Validate coordinates
        const coordValidation = validateCoordinates(latitude, longitude);
        if (!coordValidation.isValid) {
            return res.status(400).json({
                success: false,
                error: 'INVALID_COORDINATES',
                message: 'Invalid coordinates provided',
                details: coordValidation.errors
            });
        }

        const result = locationService.processLocation(latitude, longitude);

        if (!result.success) {
            return res.status(404).json({
                success: false,
                error: result.error,
                message: result.message,
                coordinates: result.coordinates,
                nearestCity: result.nearestCity
            });
        }

        res.json(result);

    } catch (error) {
        console.error('Location detect error:', error);
        res.status(500).json({
            success: false,
            error: 'DETECTION_FAILED',
            message: 'Failed to detect location'
        });
    }
});

/**
 * POST /api/location/validate-residency
 * Validate residency for LGU scholarship eligibility
 * 
 * Request Body:
 * {
 *   "cityId": 2,
 *   "residencyYears": 5
 * }
 */
router.post('/validate-residency', async (req, res) => {
    try {
        const { cityId, residencyYears } = req.body;

        // Validate inputs
        if (!cityId) {
            return res.status(400).json({
                success: false,
                error: 'MISSING_CITY_ID',
                message: 'City ID is required'
            });
        }

        const residencyValidation = validateResidencyYears(residencyYears);
        if (!residencyValidation.isValid) {
            return res.status(400).json({
                success: false,
                error: 'INVALID_RESIDENCY',
                message: residencyValidation.errors[0].message
            });
        }

        const result = locationService.validateLguResidency(cityId, residencyYears);

        res.json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error('Residency validation error:', error);
        res.status(500).json({
            success: false,
            error: 'VALIDATION_FAILED',
            message: 'Failed to validate residency'
        });
    }
});

/**
 * GET /api/location/cities/search
 * Search cities by name
 * 
 * Query Parameters:
 * - q: search query
 */
router.get('/cities/search', async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.length < 2) {
            return res.status(400).json({
                success: false,
                error: 'INVALID_QUERY',
                message: 'Search query must be at least 2 characters'
            });
        }

        const cities = await locationService.searchCities(q);

        res.json({
            success: true,
            query: q,
            total: cities.length,
            cities
        });

    } catch (error) {
        console.error('City search error:', error);
        res.status(500).json({
            success: false,
            error: 'SEARCH_FAILED',
            message: 'Failed to search cities'
        });
    }
});

/**
 * GET /api/location/cities/:cityId
 * Get city details by ID
 */
router.get('/cities/:cityId', async (req, res) => {
    try {
        const { cityId } = req.params;

        const city = await locationService.getCityDetails(parseInt(cityId));

        if (!city) {
            return res.status(404).json({
                success: false,
                error: 'CITY_NOT_FOUND',
                message: 'City not found'
            });
        }

        res.json({
            success: true,
            ...city
        });

    } catch (error) {
        console.error('Get city error:', error);
        res.status(500).json({
            success: false,
            error: 'FETCH_FAILED',
            message: 'Failed to fetch city details'
        });
    }
});

/**
 * GET /api/location/lgu-scholarships
 * Get all cities with LGU scholarship programs
 */
router.get('/lgu-scholarships', (req, res) => {
    try {
        const lguCities = locationService.getLguCities();

        res.json({
            success: true,
            total: lguCities.length,
            description: 'Cities with Local Government Unit (LGU) scholarship programs',
            cities: lguCities
        });

    } catch (error) {
        console.error('Get LGU scholarships error:', error);
        res.status(500).json({
            success: false,
            error: 'FETCH_FAILED',
            message: 'Failed to fetch LGU scholarships'
        });
    }
});

/**
 * POST /api/location/process-with-residency
 * Full location processing with residency validation
 * Combines detect + validate-residency in one call
 * 
 * Request Body:
 * {
 *   "latitude": 14.5547,
 *   "longitude": 121.0244,
 *   "residencyYears": 5
 * }
 */
router.post('/process-with-residency', async (req, res) => {
    try {
        const { latitude, longitude, residencyYears } = req.body;

        // Validate coordinates
        const coordValidation = validateCoordinates(latitude, longitude);
        if (!coordValidation.isValid) {
            return res.status(400).json({
                success: false,
                error: 'INVALID_COORDINATES',
                message: 'Invalid coordinates provided',
                details: coordValidation.errors
            });
        }

        // Detect location
        const locationResult = locationService.processLocation(latitude, longitude);

        if (!locationResult.success) {
            return res.status(404).json({
                success: false,
                error: 'LOCATION_NOT_FOUND',
                message: locationResult.message
            });
        }

        const response = { ...locationResult };

        // If LGU scholarship available and residency provided, validate it
        if (locationResult.hasLguScholarship && residencyYears !== undefined) {
            const residencyResult = locationService.validateLguResidency(
                locationResult.location.city.id,
                residencyYears
            );

            response.residencyValidation = residencyResult;

            // Update the required action based on validation
            if (residencyResult.isEligible) {
                response.requiredAction = null;
                response.lguEligibilityStatus = {
                    status: 'ELIGIBLE',
                    message: residencyResult.message,
                    nextSteps: residencyResult.nextSteps
                };
            } else {
                response.lguEligibilityStatus = {
                    status: 'NOT_ELIGIBLE',
                    message: residencyResult.message,
                    yearsNeeded: residencyResult.yearsNeeded,
                    nextSteps: residencyResult.nextSteps
                };
            }
        }

        res.json(response);

    } catch (error) {
        console.error('Process with residency error:', error);
        res.status(500).json({
            success: false,
            error: 'PROCESSING_FAILED',
            message: 'Failed to process location with residency'
        });
    }
});

module.exports = router;
