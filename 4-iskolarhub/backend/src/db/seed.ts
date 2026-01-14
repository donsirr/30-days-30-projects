/**
 * Database Seed Script
 * ============================================================
 * Populates the Scholarships table with real 2026 data
 * 
 * Usage: npm run db:seed
 * ============================================================
 */

import { Scholarship } from '@iskolarhub/shared';

// ============================================================
// 2026 SCHOLARSHIP DATA
// ============================================================

const scholarships: Omit<Scholarship, 'createdAt' | 'updatedAt'>[] = [
    // ============================================================
    // GOVERNMENT SCHOLARSHIPS
    // ============================================================
    {
        id: 'dost-sei-merit-2026',
        name: 'DOST-SEI Merit Scholarship Program',
        providerName: 'Department of Science and Technology',
        providerType: 'Government',
        description: 'The flagship scholarship program of DOST-SEI for academically talented students pursuing careers in science and technology. Covers tuition, living allowance, book allowance, and graduation clothing.',
        officialLink: 'https://sei.dost.gov.ph/index.php/programs-and-projects/scholarships',
        applicationStart: '2025-10-01',
        applicationDeadline: '2026-02-28',
        academicYear: '2026-2027',
        status: 'open',
        eligibility: {
            min_gwa: 85,
            priority_strands: ['STEM'],
            priority_courses: [
                'Computer Science',
                'Information Technology',
                'Civil Engineering',
                'Electrical Engineering',
                'Mechanical Engineering',
                'Chemical Engineering',
                'Electronics Engineering',
                'Computer Engineering',
                'Industrial Engineering',
                'Mathematics',
                'Physics',
                'Chemistry',
                'Biology',
                'Statistics',
                'Data Science'
            ],
            is_undergraduate_only: true
        },
        locationConstraints: {
            nationwide: true
        },
        benefits: {
            tuition: true,
            stipend: true,
            stipend_amount_monthly: 7000,
            book_allowance: true,
            book_allowance_amount: 10000,
            transportation: false,
            graduation_allowance: true,
            other_benefits: ['Thesis/Dissertation Allowance', 'Group Insurance']
        },
        requiredDocuments: ['PSA', 'Form138', 'GoodMoral'],
        additionalDocuments: ['DOST Exam Result', 'Medical Certificate'],
        slotsAvailable: 5000,
        isRenewable: true,
        renewalRequirements: 'Maintain weighted average of at least 2.75 or 83% with no grade below 3.0 or 75%',
        tags: ['STEM', 'merit-based', 'government', 'full-scholarship']
    },
    {
        id: 'dost-sei-ra7687-2026',
        name: 'DOST-SEI RA 7687 Scholarship (Underpriv)',
        providerName: 'Department of Science and Technology',
        providerType: 'Government',
        description: 'Need-based scholarship under RA 7687 (Science and Technology Scholarship Act) for financially disadvantaged but academically qualified students.',
        officialLink: 'https://sei.dost.gov.ph/index.php/programs-and-projects/scholarships',
        applicationStart: '2025-10-01',
        applicationDeadline: '2026-02-28',
        academicYear: '2026-2027',
        status: 'open',
        eligibility: {
            min_gwa: 83,
            income_ceiling: 500000,
            priority_strands: ['STEM'],
            priority_courses: [
                'Computer Science',
                'Engineering',
                'Mathematics',
                'Physics',
                'Chemistry',
                'Biology'
            ],
            is_undergraduate_only: true
        },
        locationConstraints: {
            nationwide: true
        },
        benefits: {
            tuition: true,
            stipend: true,
            stipend_amount_monthly: 7000,
            book_allowance: true,
            book_allowance_amount: 10000,
            graduation_allowance: true
        },
        requiredDocuments: ['PSA', 'Form138', 'ITR', 'GoodMoral'],
        additionalDocuments: ['DOST Exam Result', 'Certificate of Indigency'],
        isRenewable: true,
        renewalRequirements: 'Maintain weighted average of 2.75 or 83%',
        tags: ['STEM', 'need-based', 'government', 'full-scholarship']
    },
    {
        id: 'ched-merit-2026',
        name: 'CHED Merit Scholarship Program',
        providerName: 'Commission on Higher Education',
        providerType: 'Government',
        description: 'Merit scholarship for top-performing SHS graduates pursuing priority courses. Open to all strands with excellent academic standing.',
        officialLink: 'https://ched.gov.ph/unified-student-financial-assistance-system-for-tertiary-education/',
        applicationStart: '2026-01-15',
        applicationDeadline: '2026-04-30',
        academicYear: '2026-2027',
        status: 'open',
        eligibility: {
            min_gwa: 93,
            income_ceiling: 500000,
            allowed_strands: ['STEM', 'ABM', 'HUMSS', 'GAS', 'TVL', 'Sports', 'Arts'],
            is_undergraduate_only: true
        },
        locationConstraints: {
            nationwide: true
        },
        benefits: {
            tuition: true,
            stipend: true,
            stipend_amount_monthly: 5000,
            book_allowance: true,
            book_allowance_amount: 5000
        },
        requiredDocuments: ['PSA', 'Form138', 'ITR', 'GoodMoral'],
        isRenewable: true,
        renewalRequirements: 'Maintain GWA of 2.0 or 88%',
        tags: ['merit-based', 'government', 'all-strands']
    },
    {
        id: 'ched-tulong-dunong-2026',
        name: 'CHED Tulong Dunong Program',
        providerName: 'Commission on Higher Education',
        providerType: 'Government',
        description: 'Financial assistance for students enrolled in private higher education institutions. Covers partial or full tuition depending on need.',
        officialLink: 'https://ched.gov.ph/tulong-dunong/',
        applicationStart: '2026-02-01',
        applicationDeadline: '2026-05-31',
        academicYear: '2026-2027',
        status: 'upcoming',
        eligibility: {
            min_gwa: 80,
            income_ceiling: 400000,
            allowed_strands: ['STEM', 'ABM', 'HUMSS', 'GAS', 'TVL'],
            is_undergraduate_only: true
        },
        locationConstraints: {
            nationwide: true
        },
        benefits: {
            tuition: true,
            tuition_amount: 60000,
            stipend: false
        },
        requiredDocuments: ['PSA', 'Form138', 'ITR', 'GoodMoral'],
        isRenewable: true,
        renewalRequirements: 'Enrolled status and passing grades',
        tags: ['need-based', 'government', 'partial-tuition']
    },

    // ============================================================
    // PRIVATE SCHOLARSHIPS
    // ============================================================
    {
        id: 'sm-foundation-2026',
        name: 'SM Foundation College Scholarship Program',
        providerName: 'SM Foundation, Inc.',
        providerType: 'Private',
        description: 'Full scholarship for deserving public school students. Covers tuition, monthly allowance, uniform, and school supplies.',
        officialLink: 'https://www.sm-foundation.org/education/',
        applicationStart: '2026-01-02',
        applicationDeadline: '2026-03-15',
        academicYear: '2026-2027',
        status: 'open',
        eligibility: {
            min_gwa: 92,
            income_ceiling: 250000,
            shs_type_required: 'Public',
            priority_courses: [
                'Accountancy',
                'Information Technology',
                'Computer Science',
                'Hotel and Restaurant Management',
                'Tourism Management'
            ],
            is_undergraduate_only: true
        },
        locationConstraints: {
            nationwide: true
        },
        benefits: {
            tuition: true,
            stipend: true,
            stipend_amount_monthly: 5000,
            book_allowance: true,
            book_allowance_amount: 8000,
            other_benefits: ['Uniform Allowance', 'School Supplies', 'Leadership Training']
        },
        requiredDocuments: ['PSA', 'Form138', 'ITR', 'GoodMoral'],
        additionalDocuments: ['Barangay Certificate of Residency', 'Photo'],
        slotsAvailable: 200,
        isRenewable: true,
        renewalRequirements: 'Maintain GWA of 85% or 2.5, no failing grades',
        tags: ['public-school', 'need-based', 'private-foundation', 'full-scholarship']
    },
    {
        id: 'megaworld-foundation-2026',
        name: 'Megaworld Foundation Scholarship',
        providerName: 'Megaworld Foundation',
        providerType: 'Private',
        description: 'Full scholarship supporting students in business and hospitality courses. Includes possible employment after graduation.',
        officialLink: 'https://www.megaworldfoundation.com/scholarship',
        applicationStart: '2026-01-15',
        applicationDeadline: '2026-04-15',
        academicYear: '2026-2027',
        status: 'open',
        eligibility: {
            min_gwa: 85,
            income_ceiling: 300000,
            priority_strands: ['ABM'],
            priority_courses: [
                'Hotel and Restaurant Management',
                'Tourism',
                'Business Administration',
                'Real Estate Management'
            ],
            is_undergraduate_only: true
        },
        locationConstraints: {
            nationwide: true
        },
        benefits: {
            tuition: true,
            stipend: true,
            stipend_amount_monthly: 4000,
            book_allowance: true,
            other_benefits: ['On-the-job training at Megaworld properties']
        },
        requiredDocuments: ['PSA', 'Form138', 'ITR', 'GoodMoral'],
        slotsAvailable: 100,
        isRenewable: true,
        renewalRequirements: 'Maintain passing grades and good standing',
        tags: ['hospitality', 'business', 'private-foundation']
    },
    {
        id: 'ayala-foundation-2026',
        name: 'Ayala Foundation Scholarship Program',
        providerName: 'Ayala Foundation, Inc.',
        providerType: 'Private',
        description: 'Scholarship for exceptional students demonstrating leadership potential and community involvement.',
        officialLink: 'https://www.ayalafoundation.org/education-programs/',
        applicationStart: '2026-02-01',
        applicationDeadline: '2026-04-30',
        academicYear: '2026-2027',
        status: 'upcoming',
        eligibility: {
            min_gwa: 88,
            income_ceiling: 400000,
            allowed_strands: ['STEM', 'ABM', 'HUMSS', 'GAS'],
            priority_courses: [
                'Engineering',
                'Business Administration',
                'Economics',
                'Architecture'
            ],
            is_undergraduate_only: true
        },
        locationConstraints: {
            nationwide: true
        },
        benefits: {
            tuition: true,
            stipend: true,
            stipend_amount_monthly: 6000,
            book_allowance: true,
            other_benefits: ['Mentorship Program', 'Leadership Workshops']
        },
        requiredDocuments: ['PSA', 'Form138', 'ITR', 'GoodMoral'],
        additionalDocuments: ['Essay on Community Involvement', 'Recommendation Letter'],
        slotsAvailable: 50,
        isRenewable: true,
        renewalRequirements: 'Maintain GWA of 2.0 and participate in community programs',
        tags: ['leadership', 'community', 'private-foundation']
    },
    {
        id: 'gokongwei-engineering-2026',
        name: 'Gokongwei Brothers Foundation Engineering Scholarship',
        providerName: 'Gokongwei Brothers Foundation',
        providerType: 'Private',
        description: 'Full scholarship for students pursuing engineering degrees at partner universities.',
        officialLink: 'https://www.gbf.org.ph/scholarship/',
        applicationStart: '2026-01-10',
        applicationDeadline: '2026-03-31',
        academicYear: '2026-2027',
        status: 'open',
        eligibility: {
            min_gwa: 90,
            income_ceiling: 350000,
            priority_strands: ['STEM'],
            priority_courses: [
                'Civil Engineering',
                'Electrical Engineering',
                'Mechanical Engineering',
                'Chemical Engineering',
                'Industrial Engineering',
                'Computer Engineering'
            ],
            is_undergraduate_only: true
        },
        locationConstraints: {
            nationwide: true
        },
        benefits: {
            tuition: true,
            stipend: true,
            stipend_amount_monthly: 8000,
            book_allowance: true,
            book_allowance_amount: 15000,
            graduation_allowance: true
        },
        requiredDocuments: ['PSA', 'Form138', 'ITR', 'GoodMoral'],
        slotsAvailable: 80,
        isRenewable: true,
        renewalRequirements: 'Maintain GWA of 2.25 or 86%, no failing grades',
        tags: ['engineering', 'STEM', 'private-foundation', 'full-scholarship']
    },

    // ============================================================
    // LGU SCHOLARSHIPS
    // ============================================================
    {
        id: 'lgu-makati-2026',
        name: 'Makati City College Scholarship',
        providerName: 'City Government of Makati',
        providerType: 'LGU',
        description: 'Free college education for bona fide residents of Makati City at the University of Makati and Ospital ng Makati School of Nursing.',
        officialLink: 'https://www.makati.gov.ph/scholarships',
        applicationStart: '2026-01-05',
        applicationDeadline: '2026-02-28',
        academicYear: '2026-2027',
        status: 'open',
        eligibility: {
            min_gwa: 85,
            allowed_strands: ['STEM', 'ABM', 'HUMSS', 'GAS', 'TVL'],
            is_undergraduate_only: true
        },
        locationConstraints: {
            nationwide: false,
            city_ids: [2], // Makati City ID
            min_residency_years: 3
        },
        benefits: {
            tuition: true,
            stipend: true,
            stipend_amount_monthly: 3000,
            book_allowance: true,
            other_benefits: ['Free use of university facilities']
        },
        requiredDocuments: ['PSA', 'Form138', 'GoodMoral'],
        additionalDocuments: ['Barangay Certificate (3 years)', 'Voters ID or Certificate'],
        isRenewable: true,
        renewalRequirements: 'Maintain good academic standing',
        tags: ['LGU', 'makati', 'free-tuition', 'residency-required']
    },
    {
        id: 'lgu-taguig-2026',
        name: 'Taguig City University Scholarship',
        providerName: 'City Government of Taguig',
        providerType: 'LGU',
        description: 'Full scholarship for Taguig residents at Taguig City University covering tuition and allowances.',
        officialLink: 'https://taguig.gov.ph/tcu-scholarship/',
        applicationStart: '2026-01-08',
        applicationDeadline: '2026-03-15',
        academicYear: '2026-2027',
        status: 'open',
        eligibility: {
            min_gwa: 82,
            allowed_strands: ['STEM', 'ABM', 'HUMSS', 'GAS', 'TVL'],
            is_undergraduate_only: true
        },
        locationConstraints: {
            nationwide: false,
            city_ids: [3], // Taguig City ID
            min_residency_years: 5
        },
        benefits: {
            tuition: true,
            stipend: true,
            stipend_amount_monthly: 2500,
            book_allowance: true
        },
        requiredDocuments: ['PSA', 'Form138', 'GoodMoral'],
        additionalDocuments: ['Certificate of Residency (5 years)', 'Barangay Clearance'],
        isRenewable: true,
        renewalRequirements: 'Passing grades, no dropped subjects',
        tags: ['LGU', 'taguig', 'free-tuition', 'residency-required']
    },
    {
        id: 'lgu-quezon-city-2026',
        name: 'QC-CHED Expanded Scholarship Program',
        providerName: 'Quezon City Government',
        providerType: 'LGU',
        description: 'Scholarship grant for Quezon City residents attending state colleges and universities within Metro Manila.',
        officialLink: 'https://quezoncity.gov.ph/qc-scholarship/',
        applicationStart: '2026-01-15',
        applicationDeadline: '2026-04-15',
        academicYear: '2026-2027',
        status: 'open',
        eligibility: {
            min_gwa: 80,
            income_ceiling: 400000,
            allowed_strands: ['STEM', 'ABM', 'HUMSS', 'GAS', 'TVL', 'Sports', 'Arts'],
            is_undergraduate_only: true
        },
        locationConstraints: {
            nationwide: false,
            city_ids: [4], // Quezon City ID
            min_residency_years: 2
        },
        benefits: {
            tuition: true,
            tuition_amount: 30000,
            stipend: true,
            stipend_amount_monthly: 2000
        },
        requiredDocuments: ['PSA', 'Form138', 'ITR', 'GoodMoral'],
        additionalDocuments: ['Barangay Clearance', 'Certification of Enrollment'],
        isRenewable: true,
        renewalRequirements: 'Maintain enrolled status with passing grades',
        tags: ['LGU', 'quezon-city', 'partial-tuition', 'residency-required']
    },
    {
        id: 'lgu-pasig-2026',
        name: 'Pasig City Pamantasan Scholarship',
        providerName: 'City Government of Pasig',
        providerType: 'LGU',
        description: 'Full academic scholarship for Pasig residents at Pamantasan ng Lungsod ng Pasig.',
        officialLink: 'https://www.pasigcity.gov.ph/scholarship',
        applicationStart: '2026-01-10',
        applicationDeadline: '2026-03-31',
        academicYear: '2026-2027',
        status: 'open',
        eligibility: {
            min_gwa: 83,
            income_ceiling: 300000,
            allowed_strands: ['STEM', 'ABM', 'HUMSS', 'GAS', 'TVL'],
            is_undergraduate_only: true
        },
        locationConstraints: {
            nationwide: false,
            city_ids: [5], // Pasig City ID
            min_residency_years: 3
        },
        benefits: {
            tuition: true,
            stipend: true,
            stipend_amount_monthly: 2000,
            book_allowance: true,
            book_allowance_amount: 3000
        },
        requiredDocuments: ['PSA', 'Form138', 'ITR', 'GoodMoral'],
        additionalDocuments: ['Barangay Certificate of Residency'],
        isRenewable: true,
        renewalRequirements: 'No failing grades, maintain residency',
        tags: ['LGU', 'pasig', 'free-tuition', 'residency-required']
    },

    // ============================================================
    // NGO SCHOLARSHIPS
    // ============================================================
    {
        id: 'angat-buhay-2026',
        name: 'Angat Buhay Education Scholarship',
        providerName: 'Angat Buhay NGO',
        providerType: 'NGO',
        description: 'Scholarship for students from marginalized communities pursuing higher education in various fields.',
        officialLink: 'https://angatbuhay.ph/programs/education/',
        applicationStart: '2026-02-01',
        applicationDeadline: '2026-05-15',
        academicYear: '2026-2027',
        status: 'upcoming',
        eligibility: {
            min_gwa: 80,
            income_ceiling: 200000,
            allowed_strands: ['STEM', 'ABM', 'HUMSS', 'GAS', 'TVL', 'Sports', 'Arts'],
            is_undergraduate_only: true
        },
        locationConstraints: {
            nationwide: true
        },
        benefits: {
            tuition: true,
            stipend: true,
            stipend_amount_monthly: 3500,
            book_allowance: true
        },
        requiredDocuments: ['PSA', 'Form138', 'ITR', 'GoodMoral'],
        additionalDocuments: ['Essay on Educational Goals', 'Community Endorsement'],
        isRenewable: true,
        renewalRequirements: 'Maintain passing grades and community involvement',
        tags: ['marginalized', 'community', 'NGO', 'need-based']
    }
];

// ============================================================
// SEED FUNCTION
// ============================================================

/**
 * Generates a UUID v4
 */
function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Seeds the database with scholarship data
 */
export async function seedScholarships(db: any): Promise<void> {
    console.log('Starting scholarship seed...');

    const now = new Date().toISOString();

    for (const scholarship of scholarships) {
        try {
            // If ID contains descriptive string, keep it; otherwise generate UUID
            const id = scholarship.id || generateUUID();

            const query = `
        INSERT INTO scholarships (
          id,
          name,
          provider_name,
          provider_type,
          description,
          official_link,
          logo_url,
          application_start,
          application_deadline,
          academic_year,
          status,
          eligibility,
          location_constraints,
          benefits,
          required_documents,
          additional_documents,
          slots_available,
          is_renewable,
          renewal_requirements,
          tags,
          created_at,
          updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
          $21, $22
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          provider_name = EXCLUDED.provider_name,
          provider_type = EXCLUDED.provider_type,
          description = EXCLUDED.description,
          official_link = EXCLUDED.official_link,
          application_deadline = EXCLUDED.application_deadline,
          status = EXCLUDED.status,
          eligibility = EXCLUDED.eligibility,
          location_constraints = EXCLUDED.location_constraints,
          benefits = EXCLUDED.benefits,
          updated_at = EXCLUDED.updated_at
      `;

            const values = [
                id,
                scholarship.name,
                scholarship.providerName,
                scholarship.providerType,
                scholarship.description || null,
                scholarship.officialLink || null,
                scholarship.logoUrl || null,
                scholarship.applicationStart || null,
                scholarship.applicationDeadline,
                scholarship.academicYear,
                scholarship.status,
                JSON.stringify(scholarship.eligibility),
                JSON.stringify(scholarship.locationConstraints),
                JSON.stringify(scholarship.benefits),
                scholarship.requiredDocuments,
                scholarship.additionalDocuments || null,
                scholarship.slotsAvailable || null,
                scholarship.isRenewable,
                scholarship.renewalRequirements || null,
                scholarship.tags || null,
                now,
                now
            ];

            await db.query(query, values);
            console.log(`  ✓ Seeded: ${scholarship.name}`);

        } catch (error) {
            console.error(`  ✗ Failed to seed: ${scholarship.name}`, error);
        }
    }

    console.log(`\nSeeding complete. ${scholarships.length} scholarships processed.`);
}

/**
 * Get all seed scholarships (for testing without DB)
 */
export function getSeedScholarships(): Scholarship[] {
    const now = new Date().toISOString();
    return scholarships.map(s => ({
        ...s,
        createdAt: now,
        updatedAt: now
    }));
}

// Export for direct execution
export { scholarships };
