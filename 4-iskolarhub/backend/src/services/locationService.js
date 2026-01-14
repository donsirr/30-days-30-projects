/**
 * Location Service
 * Handles reverse geocoding and LGU residency validation
 */

const { CITY_COORDINATES, LGU_PROVIDERS } = require('../models/constants');
const db = require('../database/db');

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude 1
 * @param {number} lng1 - Longitude 1
 * @param {number} lat2 - Latitude 2
 * @param {number} lng2 - Longitude 2
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function toRad(deg) {
    return deg * (Math.PI / 180);
}

/**
 * Reverse geocode coordinates to find nearest Philippine city
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @returns {Object} Location result
 */
function reverseGeocode(latitude, longitude) {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    // Find nearest city
    let nearestCity = null;
    let minDistance = Infinity;

    for (const city of CITY_COORDINATES) {
        const distance = calculateDistance(lat, lng, city.lat, city.lng);

        if (distance < minDistance) {
            minDistance = distance;
            nearestCity = city;
        }
    }

    // Check if within city radius
    if (!nearestCity || minDistance > nearestCity.radius * 2) {
        return {
            success: false,
            error: 'LOCATION_NOT_FOUND',
            message: 'Unable to determine city from the provided coordinates. Location may be outside covered areas.',
            coordinates: { latitude: lat, longitude: lng },
            nearestCity: nearestCity ? {
                name: nearestCity.name,
                distance: Math.round(minDistance * 10) / 10
            } : null
        };
    }

    const isWithinBounds = minDistance <= nearestCity.radius;

    return {
        success: true,
        city: {
            id: nearestCity.cityId,
            name: nearestCity.name,
            coordinates: {
                latitude: nearestCity.lat,
                longitude: nearestCity.lng
            }
        },
        distance: Math.round(minDistance * 100) / 100,
        confidence: isWithinBounds ? 'high' : 'medium',
        isWithinCityBounds: isWithinBounds,
        coordinates: { latitude: lat, longitude: lng }
    };
}

/**
 * Check if a city has an LGU scholarship program
 * @param {number} cityId - City ID
 * @returns {Object|null} LGU info if available
 */
function checkLguProvider(cityId) {
    return LGU_PROVIDERS[cityId] || null;
}

/**
 * Process location and check for LGU requirements
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @returns {Object} Location result with LGU info
 */
function processLocation(latitude, longitude) {
    // Reverse geocode the coordinates
    const locationResult = reverseGeocode(latitude, longitude);

    if (!locationResult.success) {
        return locationResult;
    }

    // Check if city has LGU scholarship
    const lguInfo = checkLguProvider(locationResult.city.id);

    const response = {
        success: true,
        location: locationResult,
        hasLguScholarship: !!lguInfo
    };

    if (lguInfo) {
        response.lguScholarship = {
            ...lguInfo,
            cityId: locationResult.city.id
        };

        // Flag for required action
        response.requiredAction = {
            type: 'VERIFY_RESIDENCY',
            title: 'Residency Verification Required',
            message: `${lguInfo.name} offers a scholarship program. Please verify your residency duration.`,
            fields: [
                {
                    name: 'residencyYears',
                    label: `How many years have you lived in ${lguInfo.name}?`,
                    type: 'number',
                    required: true,
                    min: 0,
                    max: 50,
                    hint: `Minimum ${lguInfo.minResidencyYears} years required for ${lguInfo.scholarshipName}`
                }
            ],
            scholarshipInfo: {
                name: lguInfo.scholarshipName,
                minResidency: lguInfo.minResidencyYears,
                requiresProofOfResidency: lguInfo.requiresProofOfResidency
            }
        };
    }

    return response;
}

/**
 * Validate residency for LGU scholarship
 * @param {number} cityId - City ID
 * @param {number} residencyYears - Years of residency
 * @returns {Object} Validation result
 */
function validateLguResidency(cityId, residencyYears) {
    const lguInfo = checkLguProvider(cityId);

    if (!lguInfo) {
        return {
            isEligible: false,
            reason: 'NO_LGU_SCHOLARSHIP',
            message: 'This city does not have an LGU scholarship program in our database.'
        };
    }

    const years = parseInt(residencyYears);
    const meetsRequirement = years >= lguInfo.minResidencyYears;

    return {
        isEligible: meetsRequirement,
        lguInfo: {
            city: lguInfo.name,
            scholarshipName: lguInfo.scholarshipName,
            minResidencyRequired: lguInfo.minResidencyYears,
            actualResidency: years
        },
        message: meetsRequirement
            ? `You meet the ${lguInfo.minResidencyYears}-year residency requirement for ${lguInfo.scholarshipName}!`
            : `You need at least ${lguInfo.minResidencyYears} years of residency. You currently have ${years} year(s).`,
        yearsNeeded: meetsRequirement ? 0 : lguInfo.minResidencyYears - years,
        nextSteps: meetsRequirement
            ? [
                'Prepare proof of residency (Barangay Certificate)',
                'Ensure your address is consistent across documents',
                `Apply for ${lguInfo.scholarshipName}`
            ]
            : [
                `Continue residing in ${lguInfo.name} for ${lguInfo.minResidencyYears - years} more year(s)`,
                'Consider other national scholarship programs in the meantime'
            ]
    };
}

/**
 * Get city information by ID with province and region
 * @param {number} cityId - City ID
 * @returns {Promise<Object>} City details
 */
async function getCityDetails(cityId) {
    try {
        const result = await db.query(`
      SELECT 
        cm.id,
        cm.name as city_name,
        cm.is_city,
        p.id as province_id,
        p.name as province_name,
        r.id as region_id,
        r.name as region_name
      FROM cities_municipalities cm
      LEFT JOIN provinces p ON cm.province_id = p.id
      LEFT JOIN regions r ON p.region_id = r.id
      WHERE cm.id = $1
    `, [cityId]);

        if (result.rows.length === 0) {
            return null;
        }

        const row = result.rows[0];
        return {
            city: {
                id: row.id,
                name: row.city_name,
                isCity: row.is_city
            },
            province: {
                id: row.province_id,
                name: row.province_name
            },
            region: {
                id: row.region_id,
                name: row.region_name
            },
            hasLguScholarship: !!LGU_PROVIDERS[row.id],
            lguInfo: LGU_PROVIDERS[row.id] || null
        };
    } catch (error) {
        console.error('Error fetching city details:', error);
        return null;
    }
}

/**
 * Search cities by name
 * @param {string} query - Search query
 * @returns {Promise<Array>} Matching cities
 */
async function searchCities(query) {
    try {
        const result = await db.query(`
      SELECT 
        cm.id,
        cm.name as city_name,
        cm.is_city,
        p.name as province_name,
        r.name as region_name
      FROM cities_municipalities cm
      LEFT JOIN provinces p ON cm.province_id = p.id
      LEFT JOIN regions r ON p.region_id = r.id
      WHERE cm.name ILIKE $1
      ORDER BY cm.name
      LIMIT 20
    `, [`%${query}%`]);

        return result.rows.map(row => ({
            id: row.id,
            name: row.city_name,
            isCity: row.is_city,
            province: row.province_name,
            region: row.region_name,
            displayName: `${row.city_name}, ${row.province_name}`,
            hasLguScholarship: !!LGU_PROVIDERS[row.id]
        }));
    } catch (error) {
        console.error('Error searching cities:', error);
        return [];
    }
}

/**
 * Get all cities with LGU scholarships
 * @returns {Array} Cities with scholarships
 */
function getLguCities() {
    return Object.entries(LGU_PROVIDERS).map(([cityId, info]) => ({
        cityId: parseInt(cityId),
        ...info
    }));
}

module.exports = {
    reverseGeocode,
    processLocation,
    checkLguProvider,
    validateLguResidency,
    getCityDetails,
    searchCities,
    getLguCities,
    calculateDistance
};
