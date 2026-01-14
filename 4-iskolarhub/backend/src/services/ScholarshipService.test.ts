/**
 * ScholarshipService Tests
 * ============================================================
 * Unit tests for the matching algorithm using mock data
 * ============================================================
 */

import { ScholarshipService, SCORING_CONFIG, MAX_SCORE, MatchInput } from './ScholarshipService';
import { Scholarship, QuickScanProfile } from '@iskolarhub/shared';

// ============================================================
// MOCK DATA
// ============================================================

const mockScholarships: Scholarship[] = [
    {
        id: 'dost-sei-001',
        name: 'DOST-SEI Science & Technology Undergraduate Scholarship',
        providerName: 'Department of Science and Technology',
        providerType: 'Government',
        description: 'Flagship scholarship for aspiring scientists and engineers',
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        academicYear: '2026-2027',
        status: 'open',
        eligibility: {
            min_gwa: 85.0,
            income_ceiling: 500000,
            priority_strands: ['STEM'],
            priority_courses: ['Computer Science', 'Engineering', 'Mathematics', 'Physics'],
        },
        locationConstraints: {
            nationwide: true,
        },
        benefits: {
            tuition: true,
            stipend: true,
            stipend_amount_monthly: 7000,
        },
        requiredDocuments: ['PSA', 'Form138', 'ITR', 'GoodMoral'],
        isRenewable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'makati-city-001',
        name: 'Makati City College Scholarship',
        providerName: 'City Government of Makati',
        providerType: 'LGU',
        description: 'Free college education for Makati residents',
        applicationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now (urgent)
        academicYear: '2026-2027',
        status: 'open',
        eligibility: {
            min_gwa: 82.0,
        },
        locationConstraints: {
            city_ids: [2], // Makati
            min_residency_years: 3,
        },
        benefits: {
            tuition: true,
            stipend: true,
        },
        requiredDocuments: ['PSA', 'Form138', 'GoodMoral'],
        isRenewable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'sm-foundation-001',
        name: 'SM Foundation College Scholarship',
        providerName: 'SM Foundation, Inc.',
        providerType: 'Private',
        description: 'Scholarship for public school students',
        applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 60 days from now
        academicYear: '2026-2027',
        status: 'open',
        eligibility: {
            min_gwa: 88.0,
            income_ceiling: 300000,
            shs_type_required: 'Public',
            priority_courses: ['Accountancy', 'Information Technology', 'Hotel and Restaurant Management'],
        },
        locationConstraints: {
            nationwide: true,
        },
        benefits: {
            tuition: true,
            stipend: true,
            stipend_amount_monthly: 5000,
        },
        requiredDocuments: ['PSA', 'Form138', 'ITR', 'GoodMoral'],
        isRenewable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

// ============================================================
// TESTS
// ============================================================

describe('ScholarshipService', () => {

    describe('Hard Filters', () => {

        describe('filterByGwa', () => {
            it('should pass when student GWA meets requirement', () => {
                const result = ScholarshipService.filterByGwa(90, 85);
                expect(result.passed).toBe(true);
                expect(result.isNearMatch).toBeFalsy();
            });

            it('should pass with near-match flag when within grace buffer', () => {
                const result = ScholarshipService.filterByGwa(84.6, 85);
                expect(result.passed).toBe(true);
                expect(result.isNearMatch).toBe(true);
            });

            it('should fail when GWA is below grace buffer', () => {
                const result = ScholarshipService.filterByGwa(84, 85);
                expect(result.passed).toBe(false);
            });

            it('should pass when no GWA requirement', () => {
                const result = ScholarshipService.filterByGwa(75, undefined);
                expect(result.passed).toBe(true);
            });
        });

        describe('filterByIncome', () => {
            it('should pass when income is below ceiling', () => {
                const result = ScholarshipService.filterByIncome(200000, 500000);
                expect(result.passed).toBe(true);
            });

            it('should pass when income equals ceiling', () => {
                const result = ScholarshipService.filterByIncome(500000, 500000);
                expect(result.passed).toBe(true);
            });

            it('should fail when income exceeds ceiling', () => {
                const result = ScholarshipService.filterByIncome(600000, 500000);
                expect(result.passed).toBe(false);
            });
        });

        describe('filterByLocation', () => {
            it('should pass for nationwide scholarships', () => {
                const result = ScholarshipService.filterByLocation(5, { nationwide: true });
                expect(result.passed).toBe(true);
            });

            it('should pass when student is in allowed city', () => {
                const result = ScholarshipService.filterByLocation(2, { city_ids: [2, 3, 4] });
                expect(result.passed).toBe(true);
            });

            it('should fail when student is outside allowed cities', () => {
                const result = ScholarshipService.filterByLocation(10, { city_ids: [2, 3, 4] });
                expect(result.passed).toBe(false);
            });
        });

        describe('filterByResidency', () => {
            it('should pass when residency meets requirement', () => {
                const result = ScholarshipService.filterByResidency(5, 3);
                expect(result.passed).toBe(true);
            });

            it('should fail when residency is insufficient', () => {
                const result = ScholarshipService.filterByResidency(2, 5);
                expect(result.passed).toBe(false);
            });
        });
    });

    describe('Scoring', () => {

        it('should give academic bonus for GWA 5% above minimum', () => {
            const input: MatchInput = {
                gwa: 91, // 7% above 85
                annualIncome: 200000,
                shsType: 'Public',
            };

            const result = ScholarshipService.calculateScore(
                input,
                mockScholarships[0],
                30
            );

            expect(result.breakdown.gwaHigherBonus).toBe(SCORING_CONFIG.ACADEMIC_MATCH_BONUS);
            expect(result.reasons.some(r => r.includes('exceeds the minimum'))).toBe(true);
        });

        it('should give course priority bonus for matching course', () => {
            const input: MatchInput = {
                gwa: 90,
                annualIncome: 200000,
                shsType: 'Public',
                targetCourse: 'Computer Science',
            };

            const result = ScholarshipService.calculateScore(
                input,
                mockScholarships[0],
                30
            );

            expect(result.breakdown.priorityCourseBonus).toBe(SCORING_CONFIG.COURSE_PRIORITY_BONUS);
        });

        it('should give public school bonus for private/NGO scholarships', () => {
            const input: MatchInput = {
                gwa: 90,
                annualIncome: 200000,
                shsType: 'Public',
            };

            const result = ScholarshipService.calculateScore(
                input,
                mockScholarships[2], // SM Foundation (Private)
                60
            );

            expect(result.breakdown.publicShsBonus).toBe(SCORING_CONFIG.PUBLIC_SCHOOL_BONUS);
        });

        it('should add urgency warning for deadlines within 7 days', () => {
            const input: MatchInput = {
                gwa: 85,
                annualIncome: 200000,
                shsType: 'Public',
            };

            const result = ScholarshipService.calculateScore(
                input,
                mockScholarships[1], // Makati (urgent deadline)
                5
            );

            expect(result.warnings.some(w => w.includes('Deadline'))).toBe(true);
        });
    });

    describe('Matching', () => {

        it('should return matches sorted by score descending', () => {
            const profile: QuickScanProfile = {
                gwa: 90,
                annualIncome: 200000,
                shsType: 'Public',
                strand: 'STEM',
                intendedCourse: 'Computer Science',
            };

            const results = ScholarshipService.quickMatch(profile, mockScholarships);

            // Should be sorted by matchScore descending
            for (let i = 1; i < results.length; i++) {
                expect(results[i - 1].matchScore).toBeGreaterThanOrEqual(results[i].matchScore);
            }
        });

        it('should exclude scholarships where student fails hard filter', () => {
            const profile: QuickScanProfile = {
                gwa: 75, // Below DOST and SM requirements
                annualIncome: 600000, // Above SM income ceiling
                shsType: 'Private',
            };

            const results = ScholarshipService.quickMatch(profile, mockScholarships);

            // Should not include DOST (GWA too low) or SM (GWA too low, income too high)
            expect(results.find(r => r.scholarshipId === 'dost-sei-001')).toBeUndefined();
            expect(results.find(r => r.scholarshipId === 'sm-foundation-001')).toBeUndefined();
        });

        it('should include location-restricted scholarships only for matching locations', () => {
            const makatiStudent: QuickScanProfile = {
                gwa: 85,
                annualIncome: 200000,
                shsType: 'Public',
                cityId: 2, // Makati
                residencyYears: 5,
            };

            const taguigStudent: QuickScanProfile = {
                gwa: 85,
                annualIncome: 200000,
                shsType: 'Public',
                cityId: 3, // Taguig
                residencyYears: 5,
            };

            const makatiResults = ScholarshipService.quickMatch(makatiStudent, mockScholarships);
            const taguigResults = ScholarshipService.quickMatch(taguigStudent, mockScholarships);

            // Makati student should see Makati scholarship
            expect(makatiResults.find(r => r.scholarshipId === 'makati-city-001')).toBeDefined();

            // Taguig student should NOT see Makati scholarship
            expect(taguigResults.find(r => r.scholarshipId === 'makati-city-001')).toBeUndefined();
        });

        it('should flag urgent scholarships correctly', () => {
            const profile: QuickScanProfile = {
                gwa: 85,
                annualIncome: 200000,
                shsType: 'Public',
                cityId: 2,
                residencyYears: 5,
            };

            const results = ScholarshipService.quickMatch(profile, mockScholarships);
            const makatiMatch = results.find(r => r.scholarshipId === 'makati-city-001');

            expect(makatiMatch?.isUrgent).toBe(true);
        });
    });

    describe('Utility Functions', () => {

        it('should correctly calculate match summary', () => {
            const profile: QuickScanProfile = {
                gwa: 90,
                annualIncome: 200000,
                shsType: 'Public',
                strand: 'STEM',
                intendedCourse: 'Computer Science',
            };

            const results = ScholarshipService.quickMatch(profile, mockScholarships);
            const summary = ScholarshipService.getMatchSummary(results);

            expect(summary.total).toBe(results.length);
            expect(summary.strongMatches + summary.moderateMatches + summary.weakMatches).toBe(results.length);
        });

        it('should filter by minimum score correctly', () => {
            const profile: QuickScanProfile = {
                gwa: 90,
                annualIncome: 200000,
                shsType: 'Public',
                strand: 'STEM',
            };

            const results = ScholarshipService.quickMatch(profile, mockScholarships);
            const filtered = ScholarshipService.filterByMinScore(results, 60);

            filtered.forEach(r => {
                expect(r.matchScore).toBeGreaterThanOrEqual(60);
            });
        });
    });
});

// ============================================================
// MANUAL TEST RUNNER (for non-Jest environments)
// ============================================================

export function runManualTests(): void {
    console.log('Running ScholarshipService Manual Tests...\n');

    const profile: QuickScanProfile = {
        gwa: 90,
        annualIncome: 200000,
        shsType: 'Public',
        strand: 'STEM',
        intendedCourse: 'Computer Science',
        cityId: 2,
        residencyYears: 5,
    };

    console.log('Test Profile:');
    console.log(JSON.stringify(profile, null, 2));
    console.log('\n---\n');

    const results = ScholarshipService.quickMatch(profile, mockScholarships);

    console.log(`Found ${results.length} matching scholarships:\n`);

    results.forEach((match, index) => {
        console.log(`${index + 1}. ${match.scholarshipName}`);
        console.log(`   Category: ${match.category}`);
        console.log(`   Match Score: ${match.matchScore}%`);
        console.log(`   Strong Match: ${match.isStrongMatch ? 'Yes' : 'No'}`);
        console.log(`   Urgent: ${match.isUrgent ? 'Yes' : 'No'}`);
        console.log(`   Days Remaining: ${match.daysRemaining}`);
        console.log(`   Reasons:`);
        match.reasons.forEach(r => console.log(`     - ${r}`));
        if (match.warnings?.length) {
            console.log(`   Warnings:`);
            match.warnings.forEach(w => console.log(`     ⚠ ${w}`));
        }
        console.log('');
    });

    const summary = ScholarshipService.getMatchSummary(results);
    console.log('Summary:');
    console.log(JSON.stringify(summary, null, 2));
}

// Uncomment to run manual tests
// runManualTests();
