-- ============================================================
-- ISKOLAR-HUB SEED DATA
-- Real Philippine Scholarships for 2026 Academic Cycle
-- ============================================================

-- ============================================================
-- REGIONS (Sample - NCR and nearby)
-- ============================================================

INSERT INTO regions (psgc_code, name) VALUES
('130000000', 'National Capital Region (NCR)'),
('040000000', 'CALABARZON'),
('030000000', 'Central Luzon'),
('010000000', 'Ilocos Region'),
('020000000', 'Cagayan Valley');

-- ============================================================
-- PROVINCES (Sample)
-- ============================================================

INSERT INTO provinces (psgc_code, region_id, name) VALUES
('137400000', 1, 'Metro Manila'),
('041000000', 2, 'Batangas'),
('042100000', 2, 'Cavite'),
('043400000', 2, 'Laguna'),
('045800000', 2, 'Rizal'),
('031400000', 3, 'Bulacan'),
('034900000', 3, 'Pampanga');

-- ============================================================
-- CITIES/MUNICIPALITIES (Sample)
-- ============================================================

INSERT INTO cities_municipalities (psgc_code, province_id, name, is_city) VALUES
-- Metro Manila
('137401000', 1, 'Manila', true),
('137402000', 1, 'Makati', true),
('137403000', 1, 'Taguig', true),
('137404000', 1, 'Quezon City', true),
('137405000', 1, 'Pasig', true),
('137406000', 1, 'Mandaluyong', true),
('137407000', 1, 'Pasay', true),
('137408000', 1, 'Muntinlupa', true),
('137409000', 1, 'Parañaque', true),
('137410000', 1, 'Las Piñas', true),
('137411000', 1, 'Caloocan', true),
('137412000', 1, 'Malabon', true),
('137413000', 1, 'Navotas', true),
('137414000', 1, 'Valenzuela', true),
('137415000', 1, 'Marikina', true),
('137416000', 1, 'San Juan', true),
-- Cavite
('042101000', 3, 'Bacoor', true),
('042102000', 3, 'Imus', true),
('042103000', 3, 'Dasmariñas', true),
('042104000', 3, 'General Trias', true),
('042105000', 3, 'Cavite City', true);

-- ============================================================
-- SCHOLARSHIPS
-- ============================================================

-- 1. DOST-SEI S&T Undergraduate Scholarship
INSERT INTO scholarships (
  name, provider_name, provider_type, description, official_link, logo_url,
  application_start, application_deadline, academic_year, status,
  eligibility, location_constraints, benefits, required_documents, tags, slots_available, is_renewable
) VALUES (
  'DOST-SEI Science & Technology Undergraduate Scholarship',
  'Department of Science and Technology - Science Education Institute',
  'Government',
  'The DOST-SEI Undergraduate Scholarship is the flagship scholarship program for aspiring Filipino scientists and engineers. It provides full support for students pursuing priority S&T courses in accredited universities nationwide.',
  'https://www.sei.dost.gov.ph/index.php/programs-and-projects/scholarships/undergraduate-scholarships',
  '/logos/dost.png',
  '2025-10-01',
  '2026-02-28',
  '2026-2027',
  'open',
  '{
    "min_gwa": 85.0,
    "income_ceiling": 500000,
    "allowed_strands": ["STEM"],
    "priority_strands": ["STEM"],
    "priority_courses": ["Engineering", "Computer Science", "Information Technology", "Mathematics", "Physics", "Chemistry", "Biology", "Agriculture", "Food Technology", "Pharmacy", "Medical Technology"],
    "is_undergraduate_only": true
  }'::jsonb,
  '{
    "nationwide": true
  }'::jsonb,
  '{
    "tuition": true,
    "tuition_amount": null,
    "stipend": true,
    "stipend_amount_monthly": 7000,
    "book_allowance": true,
    "book_allowance_amount": 10000,
    "other_benefits": ["Thesis/Dissertation Allowance", "Graduation Clothing Allowance", "Group Insurance"]
  }'::jsonb,
  ARRAY['PSA', 'Form138', 'ITR', 'GoodMoral']::document_type[],
  ARRAY['STEM', 'Science', 'Technology', 'Engineering', 'Government', 'National'],
  5000,
  true
);

-- 2. CHED Tulong Dunong Program
INSERT INTO scholarships (
  name, provider_name, provider_type, description, official_link,
  application_start, application_deadline, academic_year, status,
  eligibility, location_constraints, benefits, required_documents, tags, is_renewable
) VALUES (
  'CHED Tulong Dunong Program',
  'Commission on Higher Education',
  'Government',
  'A government study grant program for financially disadvantaged but academically deserving students. Provides tuition and miscellaneous fee assistance for college students in private HEIs.',
  'https://ched.gov.ph/tulong-dunong/',
  '2025-11-01',
  '2026-03-15',
  '2026-2027',
  'open',
  '{
    "min_gwa": 80.0,
    "income_ceiling": 400000,
    "allowed_strands": null,
    "priority_courses": null,
    "is_undergraduate_only": true
  }'::jsonb,
  '{
    "nationwide": true
  }'::jsonb,
  '{
    "tuition": true,
    "tuition_amount": 30000,
    "stipend": false,
    "book_allowance": false
  }'::jsonb,
  ARRAY['PSA', 'Form138', 'ITR', 'GoodMoral']::document_type[],
  ARRAY['Government', 'National', 'All Courses', 'Financial Aid'],
  true
);

-- 3. SM Foundation College Scholarship
INSERT INTO scholarships (
  name, provider_name, provider_type, description, official_link,
  application_start, application_deadline, academic_year, status,
  eligibility, location_constraints, benefits, required_documents, tags, slots_available, is_renewable
) VALUES (
  'SM Foundation College Scholarship Program',
  'SM Foundation, Inc.',
  'Private',
  'SM Foundation''s flagship scholarship program for deserving students from public high schools. Provides full college scholarship including tuition, books, uniforms, and monthly allowance.',
  'https://www.sm-foundation.org/sm-college-scholarship-program/',
  '2025-12-01',
  '2026-03-31',
  '2026-2027',
  'open',
  '{
    "min_gwa": 88.0,
    "income_ceiling": 300000,
    "allowed_strands": null,
    "priority_courses": ["Accountancy", "Information Technology", "Computer Science", "Engineering", "Hotel and Restaurant Management"],
    "shs_type_required": "Public",
    "is_undergraduate_only": true
  }'::jsonb,
  '{
    "nationwide": true
  }'::jsonb,
  '{
    "tuition": true,
    "tuition_amount": null,
    "stipend": true,
    "stipend_amount_monthly": 5000,
    "book_allowance": true,
    "book_allowance_amount": 10000,
    "other_benefits": ["School Supplies", "Uniform Allowance", "Transportation Allowance", "Mentorship Program"]
  }'::jsonb,
  ARRAY['PSA', 'Form138', 'ITR', 'GoodMoral']::document_type[],
  ARRAY['Private', 'National', 'Public SHS', 'Full Scholarship'],
  1200,
  true
);

-- 4. Megaworld Foundation Scholarship
INSERT INTO scholarships (
  name, provider_name, provider_type, description, official_link,
  application_start, application_deadline, academic_year, status,
  eligibility, location_constraints, benefits, required_documents, tags, slots_available, is_renewable
) VALUES (
  'Megaworld Foundation Scholarship Program',
  'Megaworld Foundation',
  'Private',
  'Scholarship program for deserving students from public high schools to pursue college education in partner universities. Focus on business and technology courses.',
  'https://www.megaworldfoundation.com/scholarship',
  '2025-11-15',
  '2026-02-15',
  '2026-2027',
  'open',
  '{
    "min_gwa": 85.0,
    "income_ceiling": 350000,
    "allowed_strands": ["STEM", "ABM"],
    "priority_courses": ["Accountancy", "Business Administration", "Information Technology", "Computer Science", "Real Estate Management"],
    "shs_type_required": "Public",
    "is_undergraduate_only": true
  }'::jsonb,
  '{
    "nationwide": true
  }'::jsonb,
  '{
    "tuition": true,
    "stipend": true,
    "stipend_amount_monthly": 4000,
    "book_allowance": true,
    "other_benefits": ["Internship Opportunities", "Job Placement Assistance"]
  }'::jsonb,
  ARRAY['PSA', 'Form138', 'ITR', 'GoodMoral']::document_type[],
  ARRAY['Private', 'National', 'Public SHS', 'Business'],
  500,
  true
);

-- 5. Makati City Scholarship (LGU)
INSERT INTO scholarships (
  name, provider_name, provider_type, description, official_link,
  application_start, application_deadline, academic_year, status,
  eligibility, location_constraints, benefits, required_documents, tags, slots_available, is_renewable
) VALUES (
  'Makati City College Scholarship',
  'City Government of Makati',
  'LGU',
  'Free college education for Makati residents at the University of Makati and partner institutions. One of the most comprehensive LGU scholarship programs in the country.',
  'https://www.makati.gov.ph/education',
  '2025-09-01',
  '2026-01-31',
  '2026-2027',
  'open',
  '{
    "min_gwa": 82.0,
    "income_ceiling": null,
    "allowed_strands": null,
    "priority_courses": null,
    "is_undergraduate_only": true
  }'::jsonb,
  '{
    "nationwide": false,
    "city_ids": [2],
    "min_residency_years": 3
  }'::jsonb,
  '{
    "tuition": true,
    "tuition_amount": null,
    "stipend": true,
    "stipend_amount_monthly": 3000,
    "book_allowance": true,
    "transportation": true,
    "other_benefits": ["Free Meals at School Cafeteria", "Medical Insurance"]
  }'::jsonb,
  ARRAY['PSA', 'Form138', 'GoodMoral']::document_type[],
  ARRAY['LGU', 'Makati', 'Free Education', 'Local'],
  3000,
  true
);

-- 6. Taguig City Scholarship (LGU)
INSERT INTO scholarships (
  name, provider_name, provider_type, description, official_link,
  application_start, application_deadline, academic_year, status,
  eligibility, location_constraints, benefits, required_documents, tags, slots_available, is_renewable
) VALUES (
  'Taguig City University Scholarship',
  'City Government of Taguig',
  'LGU',
  'Scholarship program for Taguig City residents providing free education at Taguig City University and partner schools. Priority given to residents of at least 5 years.',
  'https://www.taguig.gov.ph/tcu-scholarship',
  '2025-10-15',
  '2026-02-28',
  '2026-2027',
  'open',
  '{
    "min_gwa": 80.0,
    "income_ceiling": 500000,
    "allowed_strands": null,
    "priority_courses": ["Engineering", "Nursing", "Education", "Business Administration"],
    "is_undergraduate_only": true
  }'::jsonb,
  '{
    "nationwide": false,
    "city_ids": [3],
    "min_residency_years": 5
  }'::jsonb,
  '{
    "tuition": true,
    "stipend": true,
    "stipend_amount_monthly": 2500,
    "book_allowance": true,
    "transportation": true
  }'::jsonb,
  ARRAY['PSA', 'Form138', 'ITR', 'GoodMoral']::document_type[],
  ARRAY['LGU', 'Taguig', 'Free Education', 'Local'],
  2000,
  true
);

-- 7. Pasig City Scholarship
INSERT INTO scholarships (
  name, provider_name, provider_type, description, official_link,
  application_start, application_deadline, academic_year, status,
  eligibility, location_constraints, benefits, required_documents, tags, is_renewable
) VALUES (
  'Pamantasan ng Lungsod ng Pasig Scholarship',
  'City Government of Pasig',
  'LGU',
  'Full scholarship for Pasig City residents at the Pamantasan ng Lungsod ng Pasig. Covers tuition and miscellaneous fees with monthly allowance.',
  'https://www.pasigcity.gov.ph/plp-scholarship',
  '2025-11-01',
  '2026-02-15',
  '2026-2027',
  'open',
  '{
    "min_gwa": 83.0,
    "income_ceiling": 400000,
    "allowed_strands": null,
    "is_undergraduate_only": true
  }'::jsonb,
  '{
    "nationwide": false,
    "city_ids": [5],
    "min_residency_years": 3
  }'::jsonb,
  '{
    "tuition": true,
    "stipend": true,
    "stipend_amount_monthly": 2000,
    "book_allowance": true
  }'::jsonb,
  ARRAY['PSA', 'Form138', 'ITR', 'GoodMoral']::document_type[],
  ARRAY['LGU', 'Pasig', 'Free Education', 'Local'],
  true
);

-- 8. CHED Full Merit Scholarship
INSERT INTO scholarships (
  name, provider_name, provider_type, description, official_link,
  application_start, application_deadline, academic_year, status,
  eligibility, location_constraints, benefits, required_documents, tags, slots_available, is_renewable
) VALUES (
  'CHED Merit Scholarship Program (Full)',
  'Commission on Higher Education',
  'Government',
  'For valedictorians and salutatorians of graduating SHS classes. Provides full tuition and other benefits at any CHED-recognized HEI.',
  'https://ched.gov.ph/merit-scholarship/',
  '2025-10-01',
  '2026-03-30',
  '2026-2027',
  'open',
  '{
    "min_gwa": 98.0,
    "income_ceiling": null,
    "allowed_strands": null,
    "priority_courses": null,
    "is_valedictorian_salutatorian": true,
    "is_undergraduate_only": true
  }'::jsonb,
  '{
    "nationwide": true
  }'::jsonb,
  '{
    "tuition": true,
    "stipend": true,
    "stipend_amount_monthly": 5000,
    "book_allowance": true,
    "book_allowance_amount": 5000,
    "graduation_allowance": true
  }'::jsonb,
  ARRAY['PSA', 'Form138', 'GoodMoral']::document_type[],
  ARRAY['Government', 'National', 'Merit-Based', 'Valedictorian'],
  2000,
  true
);

-- 9. Ayala Foundation Scholarship
INSERT INTO scholarships (
  name, provider_name, provider_type, description, official_link,
  application_start, application_deadline, academic_year, status,
  eligibility, location_constraints, benefits, required_documents, tags, slots_available, is_renewable
) VALUES (
  'Ayala Foundation Scholarship Program',
  'Ayala Foundation, Inc.',
  'Private',
  'Comprehensive scholarship for outstanding students from underprivileged families pursuing degrees in business, engineering, and IT at select partner universities.',
  'https://www.ayalafoundation.org/education',
  '2025-12-01',
  '2026-01-25',
  '2026-2027',
  'open',
  '{
    "min_gwa": 87.0,
    "income_ceiling": 350000,
    "allowed_strands": ["STEM", "ABM"],
    "priority_courses": ["Business Administration", "Economics", "Engineering", "Information Technology", "Accountancy"],
    "is_undergraduate_only": true
  }'::jsonb,
  '{
    "nationwide": true
  }'::jsonb,
  '{
    "tuition": true,
    "stipend": true,
    "stipend_amount_monthly": 6000,
    "book_allowance": true,
    "other_benefits": ["Laptop", "Leadership Training", "Mentorship", "Internship at Ayala Companies"]
  }'::jsonb,
  ARRAY['PSA', 'Form138', 'ITR', 'GoodMoral']::document_type[],
  ARRAY['Private', 'National', 'Business', 'Engineering', 'Comprehensive'],
  100,
  true
);

-- 10. Gokongwei Brothers Foundation Scholarship
INSERT INTO scholarships (
  name, provider_name, provider_type, description, official_link,
  application_start, application_deadline, academic_year, status,
  eligibility, location_constraints, benefits, required_documents, tags, slots_available, is_renewable
) VALUES (
  'GBF Engineering & Science Scholarship',
  'Gokongwei Brothers Foundation',
  'Private',
  'Full scholarship for students pursuing engineering and science degrees. Scholars receive comprehensive support and opportunities at JG Summit companies.',
  'https://www.gbf.org.ph/scholarship',
  '2025-11-01',
  '2026-02-01',
  '2026-2027',
  'open',
  '{
    "min_gwa": 88.0,
    "income_ceiling": 400000,
    "allowed_strands": ["STEM"],
    "priority_strands": ["STEM"],
    "priority_courses": ["Chemical Engineering", "Mechanical Engineering", "Electrical Engineering", "Civil Engineering", "Industrial Engineering", "Computer Engineering", "Chemistry", "Physics"],
    "is_undergraduate_only": true
  }'::jsonb,
  '{
    "nationwide": true
  }'::jsonb,
  '{
    "tuition": true,
    "stipend": true,
    "stipend_amount_monthly": 8000,
    "book_allowance": true,
    "book_allowance_amount": 15000,
    "other_benefits": ["Laptop", "Summer Internship", "Leadership Seminars", "Career Placement"]
  }'::jsonb,
  ARRAY['PSA', 'Form138', 'ITR', 'GoodMoral']::document_type[],
  ARRAY['Private', 'National', 'Engineering', 'STEM', 'Full Support'],
  200,
  true
);

-- 11. UnionBank Start Scholarship
INSERT INTO scholarships (
  name, provider_name, provider_type, description, official_link,
  application_start, application_deadline, academic_year, status,
  eligibility, location_constraints, benefits, required_documents, tags, slots_available, is_renewable
) VALUES (
  'UnionBank START Scholarship',
  'UnionBank of the Philippines',
  'Private',
  'Scholarship for students pursuing IT, Business, and Finance-related courses. Includes internship and career opportunities at UnionBank.',
  'https://www.unionbankph.com/start-scholarship',
  '2025-10-15',
  '2026-01-20',
  '2026-2027',
  'open',
  '{
    "min_gwa": 85.0,
    "income_ceiling": 500000,
    "allowed_strands": ["STEM", "ABM"],
    "priority_courses": ["Computer Science", "Information Technology", "Business Administration", "Finance", "Accountancy", "Data Science"],
    "is_undergraduate_only": true
  }'::jsonb,
  '{
    "nationwide": true
  }'::jsonb,
  '{
    "tuition": true,
    "stipend": true,
    "stipend_amount_monthly": 5000,
    "book_allowance": true,
    "other_benefits": ["Paid Internship", "Technology Training", "Career Mentorship"]
  }'::jsonb,
  ARRAY['PSA', 'Form138', 'ITR', 'GoodMoral']::document_type[],
  ARRAY['Private', 'National', 'FinTech', 'IT', 'Business'],
  150,
  true
);

-- 12. Philippine Business for Education (PBED) Scholarship
INSERT INTO scholarships (
  name, provider_name, provider_type, description, official_link,
  application_start, application_deadline, academic_year, status,
  eligibility, location_constraints, benefits, required_documents, tags, is_renewable
) VALUES (
  'PBED Bridging Scholarship',
  'Philippine Business for Education',
  'NGO',
  'Scholarship connecting students from underprivileged backgrounds with corporate sponsors. Provides comprehensive support for college education.',
  'https://www.pbed.ph/scholarship',
  '2025-11-15',
  '2026-03-01',
  '2026-2027',
  'open',
  '{
    "min_gwa": 83.0,
    "income_ceiling": 300000,
    "allowed_strands": null,
    "priority_courses": null,
    "is_undergraduate_only": true
  }'::jsonb,
  '{
    "nationwide": true
  }'::jsonb,
  '{
    "tuition": true,
    "stipend": true,
    "stipend_amount_monthly": 4000,
    "book_allowance": true,
    "other_benefits": ["Life Skills Training", "Corporate Mentorship"]
  }'::jsonb,
  ARRAY['PSA', 'Form138', 'ITR', 'GoodMoral']::document_type[],
  ARRAY['NGO', 'National', 'All Courses', 'Underprivileged'],
  true
);

-- 13. Quezon City Scholarship
INSERT INTO scholarships (
  name, provider_name, provider_type, description, official_link,
  application_start, application_deadline, academic_year, status,
  eligibility, location_constraints, benefits, required_documents, tags, is_renewable
) VALUES (
  'QC-CHED Expanded Scholarship Program',
  'City Government of Quezon City',
  'LGU',
  'Quezon City''s comprehensive scholarship for residents pursuing higher education. Full tuition at partner HEIs with monthly allowance.',
  'https://quezoncity.gov.ph/scholarship',
  '2025-09-15',
  '2026-02-28',
  '2026-2027',
  'open',
  '{
    "min_gwa": 85.0,
    "income_ceiling": 400000,
    "allowed_strands": null,
    "is_undergraduate_only": true
  }'::jsonb,
  '{
    "nationwide": false,
    "city_ids": [4],
    "min_residency_years": 3
  }'::jsonb,
  '{
    "tuition": true,
    "stipend": true,
    "stipend_amount_monthly": 2500,
    "book_allowance": true,
    "transportation": true
  }'::jsonb,
  ARRAY['PSA', 'Form138', 'ITR', 'GoodMoral']::document_type[],
  ARRAY['LGU', 'Quezon City', 'Free Education', 'Local'],
  true
);

-- 14. TESDA Training for Work Scholarship
INSERT INTO scholarships (
  name, provider_name, provider_type, description, official_link,
  application_start, application_deadline, academic_year, status,
  eligibility, location_constraints, benefits, required_documents, tags, is_renewable
) VALUES (
  'TESDA Training for Work Scholarship Program (TWSP)',
  'Technical Education and Skills Development Authority',
  'Government',
  'Free technical-vocational training for out-of-school youth and unemployed adults. Provides TESDA certification and job placement assistance.',
  'https://www.tesda.gov.ph/About/TESDA/43',
  '2025-08-01',
  '2026-04-30',
  '2026-2027',
  'open',
  '{
    "min_gwa": 75.0,
    "income_ceiling": null,
    "allowed_strands": ["TVL"],
    "priority_strands": ["TVL"],
    "priority_courses": ["Welding", "Automotive", "Electronics", "Computer Hardware Servicing", "Caregiving", "Housekeeping"],
    "age_limit": 30
  }'::jsonb,
  '{
    "nationwide": true
  }'::jsonb,
  '{
    "tuition": true,
    "stipend": true,
    "stipend_amount_monthly": 3000,
    "other_benefits": ["Free Training Materials", "NC Certification", "Job Placement"]
  }'::jsonb,
  ARRAY['PSA', 'Form138']::document_type[],
  ARRAY['Government', 'National', 'TESDA', 'Vocational', 'Skills Training'],
  false
);

-- 15. San Miguel Foundation Scholarship
INSERT INTO scholarships (
  name, provider_name, provider_type, description, official_link,
  application_start, application_deadline, academic_year, status,
  eligibility, location_constraints, benefits, required_documents, tags, slots_available, is_renewable
) VALUES (
  'San Miguel Foundation College Scholarship',
  'San Miguel Foundation',
  'Private',
  'Scholarship for children of San Miguel Corporation employees and select community scholars. Covers engineering and business courses.',
  'https://www.sanmiguelfoundation.org.ph/education',
  '2025-11-01',
  '2026-02-28',
  '2026-2027',
  'open',
  '{
    "min_gwa": 86.0,
    "income_ceiling": 400000,
    "allowed_strands": ["STEM", "ABM"],
    "priority_courses": ["Engineering", "Business Administration", "Accountancy", "Food Technology"],
    "is_undergraduate_only": true
  }'::jsonb,
  '{
    "nationwide": true
  }'::jsonb,
  '{
    "tuition": true,
    "stipend": true,
    "stipend_amount_monthly": 5500,
    "book_allowance": true,
    "other_benefits": ["Summer Internship", "Career Mentoring"]
  }'::jsonb,
  ARRAY['PSA', 'Form138', 'ITR', 'GoodMoral']::document_type[],
  ARRAY['Private', 'National', 'Engineering', 'Business'],
  250,
  true
);

-- ============================================================
-- SAMPLE STUDENT (for testing)
-- ============================================================

INSERT INTO students (
  first_name, middle_name, last_name, email, phone, birth_date,
  gwa, strand, shs_type, shs_school_name, graduation_year,
  intended_course, intended_university, annual_household_income,
  is_solo_parent_child, is_pwd, is_indigenous, city_id, residency_years,
  permanent_address, profile_completion_percentage
) VALUES (
  'Maria', 'Santos', 'Dela Cruz', 'maria.delacruz@email.com', '09171234567', '2008-05-15',
  89.5, 'STEM', 'Public', 'Manila Science High School', 2026,
  'Computer Science', 'University of the Philippines', 280000,
  false, false, false, 2, 10,
  '123 Makati Avenue, Brgy. San Lorenzo, Makati City', 100
);

-- Add sample documents for the student
INSERT INTO student_documents (student_id, document_type, status, file_name, uploaded_at)
SELECT 
  id, 'PSA', 'uploaded', 'psa_maria_delacruz.pdf', CURRENT_TIMESTAMP
FROM students WHERE email = 'maria.delacruz@email.com';

INSERT INTO student_documents (student_id, document_type, status, file_name, uploaded_at)
SELECT 
  id, 'Form138', 'uploaded', 'form138_maria_delacruz.pdf', CURRENT_TIMESTAMP
FROM students WHERE email = 'maria.delacruz@email.com';

INSERT INTO student_documents (student_id, document_type, status, file_name, uploaded_at)
SELECT 
  id, 'ITR', 'uploaded', 'itr_maria_delacruz.pdf', CURRENT_TIMESTAMP
FROM students WHERE email = 'maria.delacruz@email.com';

INSERT INTO student_documents (student_id, document_type, status, file_name, uploaded_at)
SELECT 
  id, 'GoodMoral', 'verified', 'goodmoral_maria_delacruz.pdf', CURRENT_TIMESTAMP
FROM students WHERE email = 'maria.delacruz@email.com';
