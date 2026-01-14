-- ============================================================
-- ISKOLAR-HUB DATABASE SCHEMA
-- Scholarship Matching Engine for 2026 Philippine Academic Cycle
-- PostgreSQL 15+
-- ============================================================

-- Enable UUID extension for better ID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE provider_type AS ENUM ('Government', 'Private', 'LGU', 'International', 'NGO');
CREATE TYPE shs_type AS ENUM ('Public', 'Private');
CREATE TYPE strand_type AS ENUM ('STEM', 'ABM', 'HUMSS', 'GAS', 'TVL', 'Sports', 'Arts');
CREATE TYPE document_type AS ENUM ('PSA', 'Form138', 'ITR', 'GoodMoral');
CREATE TYPE document_status AS ENUM ('pending', 'uploaded', 'verified', 'rejected');
CREATE TYPE scholarship_status AS ENUM ('open', 'closed', 'upcoming');

-- ============================================================
-- TABLE: regions (Philippine Standard Geographic Code)
-- ============================================================

CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    psgc_code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: provinces
-- ============================================================

CREATE TABLE provinces (
    id SERIAL PRIMARY KEY,
    psgc_code VARCHAR(10) UNIQUE NOT NULL,
    region_id INTEGER REFERENCES regions(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: cities_municipalities
-- ============================================================

CREATE TABLE cities_municipalities (
    id SERIAL PRIMARY KEY,
    psgc_code VARCHAR(10) UNIQUE NOT NULL,
    province_id INTEGER REFERENCES provinces(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    is_city BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: scholarships (Core Entity)
-- ============================================================

CREATE TABLE scholarships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic Information
    name VARCHAR(255) NOT NULL,
    provider_name VARCHAR(255) NOT NULL,
    provider_type provider_type NOT NULL,
    description TEXT,
    official_link VARCHAR(500),
    logo_url VARCHAR(500),
    
    -- Application Period
    application_start DATE,
    application_deadline DATE NOT NULL,
    academic_year VARCHAR(20) DEFAULT '2026-2027',
    status scholarship_status DEFAULT 'open',
    
    -- Eligibility Criteria (JSONB for flexible filtering)
    eligibility JSONB NOT NULL DEFAULT '{}'::jsonb,
    /*
    eligibility structure:
    {
        "min_gwa": 85.0,
        "max_gwa": null,
        "income_ceiling": 400000,
        "allowed_strands": ["STEM", "ABM"],
        "priority_strands": ["STEM"],
        "priority_courses": ["Engineering", "Computer Science", "Medicine"],
        "shs_type_required": null | "Public" | "Private",
        "age_limit": 25,
        "is_undergraduate_only": true
    }
    */
    
    -- Location Constraints (JSONB for flexible location matching)
    location_constraints JSONB DEFAULT '{}'::jsonb,
    /*
    location_constraints structure:
    {
        "region_ids": [1, 2],
        "province_ids": [15, 16],
        "city_ids": [101, 102],
        "min_residency_years": 3,
        "nationwide": true
    }
    */
    
    -- Benefits Information
    benefits JSONB DEFAULT '{}'::jsonb,
    /*
    benefits structure:
    {
        "tuition": true,
        "tuition_amount": 100000,
        "stipend": true,
        "stipend_amount_monthly": 5000,
        "book_allowance": true,
        "book_allowance_amount": 10000,
        "transportation": false,
        "other_benefits": ["Laptop", "Mentorship Program"]
    }
    */
    
    -- Required Documents
    required_documents document_type[] DEFAULT '{}',
    additional_documents TEXT[],
    
    -- Metadata
    slots_available INTEGER,
    is_renewable BOOLEAN DEFAULT FALSE,
    renewal_requirements TEXT,
    tags TEXT[],
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: students (Student Profile)
-- ============================================================

CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    birth_date DATE,
    
    -- Academic Information
    gwa DECIMAL(5, 2) NOT NULL CHECK (gwa >= 0 AND gwa <= 100),
    strand strand_type,
    shs_type shs_type NOT NULL,
    shs_school_name VARCHAR(255),
    graduation_year INTEGER DEFAULT 2026,
    intended_course VARCHAR(255),
    intended_university VARCHAR(255),
    
    -- Financial Information
    annual_household_income DECIMAL(12, 2) NOT NULL,
    is_solo_parent_child BOOLEAN DEFAULT FALSE,
    is_pwd BOOLEAN DEFAULT FALSE,
    is_indigenous BOOLEAN DEFAULT FALSE,
    
    -- Location Information
    city_id INTEGER REFERENCES cities_municipalities(id),
    residency_years INTEGER DEFAULT 0,
    permanent_address TEXT,
    
    -- Profile Completion Status (for 1-Minute Scan)
    profile_completion_percentage INTEGER DEFAULT 0,
    last_scan_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: student_documents (Document Vault - Big 4)
-- ============================================================

CREATE TABLE student_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    document_type document_type NOT NULL,
    
    -- Document Status
    status document_status DEFAULT 'pending',
    
    -- File Information (metadata only, actual files in cloud storage)
    file_name VARCHAR(255),
    file_url VARCHAR(500),
    file_size_bytes INTEGER,
    mime_type VARCHAR(100),
    
    -- Verification
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by VARCHAR(255),
    rejection_reason TEXT,
    
    -- Timestamps
    uploaded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure one document per type per student
    UNIQUE(student_id, document_type)
);

-- ============================================================
-- TABLE: match_results (Cached Match Results)
-- ============================================================

CREATE TABLE match_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE,
    
    -- Match Scoring
    match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
    match_percentage DECIMAL(5, 2) NOT NULL,
    
    -- Scoring Breakdown (for transparency)
    scoring_breakdown JSONB DEFAULT '{}'::jsonb,
    /*
    scoring_breakdown structure:
    {
        "base_eligibility": true,
        "gwa_eligible": true,
        "income_eligible": true,
        "location_eligible": true,
        "priority_course_bonus": 20,
        "public_shs_bonus": 10,
        "strand_match_bonus": 5,
        "documents_ready_bonus": 15,
        "total_score": 50
    }
    */
    
    -- Status Flags
    is_hard_match BOOLEAN DEFAULT FALSE, -- Passed all hard filters
    missing_requirements TEXT[],
    
    -- Timestamps
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(student_id, scholarship_id)
);

-- ============================================================
-- TABLE: saved_scholarships (Student Favorites)
-- ============================================================

CREATE TABLE saved_scholarships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, scholarship_id)
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

-- Scholarship indexes
CREATE INDEX idx_scholarships_provider_type ON scholarships(provider_type);
CREATE INDEX idx_scholarships_status ON scholarships(status);
CREATE INDEX idx_scholarships_deadline ON scholarships(application_deadline);
CREATE INDEX idx_scholarships_eligibility ON scholarships USING GIN (eligibility);
CREATE INDEX idx_scholarships_location ON scholarships USING GIN (location_constraints);
CREATE INDEX idx_scholarships_tags ON scholarships USING GIN (tags);

-- Student indexes
CREATE INDEX idx_students_gwa ON students(gwa);
CREATE INDEX idx_students_income ON students(annual_household_income);
CREATE INDEX idx_students_city ON students(city_id);
CREATE INDEX idx_students_strand ON students(strand);
CREATE INDEX idx_students_shs_type ON students(shs_type);

-- Match results indexes
CREATE INDEX idx_match_results_student ON match_results(student_id);
CREATE INDEX idx_match_results_scholarship ON match_results(scholarship_id);
CREATE INDEX idx_match_results_score ON match_results(match_score DESC);

-- Document indexes
CREATE INDEX idx_student_documents_student ON student_documents(student_id);
CREATE INDEX idx_student_documents_status ON student_documents(status);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_scholarships_updated_at
    BEFORE UPDATE ON scholarships
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON students
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_documents_updated_at
    BEFORE UPDATE ON student_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- FUNCTION: Calculate days until deadline
-- ============================================================

CREATE OR REPLACE FUNCTION calculate_days_remaining(deadline DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN GREATEST(0, deadline - CURRENT_DATE);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================
-- FUNCTION: Check if scholarship is urgent (< 14 days)
-- ============================================================

CREATE OR REPLACE FUNCTION is_scholarship_urgent(deadline DATE)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN calculate_days_remaining(deadline) < 14 AND calculate_days_remaining(deadline) > 0;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================
-- VIEW: Active scholarships with deadline info
-- ============================================================

CREATE OR REPLACE VIEW v_active_scholarships AS
SELECT 
    s.*,
    calculate_days_remaining(s.application_deadline) as days_remaining,
    is_scholarship_urgent(s.application_deadline) as is_urgent,
    CASE 
        WHEN s.application_deadline < CURRENT_DATE THEN 'closed'
        WHEN s.application_start > CURRENT_DATE THEN 'upcoming'
        ELSE 'open'
    END as computed_status
FROM scholarships s
WHERE s.application_deadline >= CURRENT_DATE
ORDER BY s.application_deadline ASC;

-- ============================================================
-- VIEW: Student document completion status
-- ============================================================

CREATE OR REPLACE VIEW v_student_document_status AS
SELECT 
    s.id as student_id,
    s.email,
    COUNT(CASE WHEN sd.status = 'uploaded' OR sd.status = 'verified' THEN 1 END) as documents_ready,
    4 as total_required,
    ROUND(COUNT(CASE WHEN sd.status = 'uploaded' OR sd.status = 'verified' THEN 1 END) * 100.0 / 4, 2) as completion_percentage,
    ARRAY_AGG(DISTINCT sd.document_type) FILTER (WHERE sd.status IN ('uploaded', 'verified')) as uploaded_documents,
    ARRAY(
        SELECT dt.doc 
        FROM unnest(ARRAY['PSA', 'Form138', 'ITR', 'GoodMoral']::document_type[]) as dt(doc)
        WHERE dt.doc NOT IN (
            SELECT document_type FROM student_documents 
            WHERE student_id = s.id AND status IN ('uploaded', 'verified')
        )
    ) as missing_documents
FROM students s
LEFT JOIN student_documents sd ON s.id = sd.student_id
GROUP BY s.id, s.email;
