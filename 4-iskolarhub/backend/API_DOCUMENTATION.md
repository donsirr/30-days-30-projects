# Iskolar-Hub Backend API Documentation

## Overview

Iskolar-Hub is a scholarship matching engine designed for the 2026 Philippine academic cycle. The backend provides RESTful APIs for matching students with scholarships based on their profile, tracking document submissions, and managing deadline notifications.

---

## Base URL

```
http://localhost:3001/api
```

---

## Authentication

> Note: Authentication is not yet implemented. All endpoints are currently public.

---

## Endpoints

### Health Check

#### `GET /health`

Returns the server health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-14T09:06:04.000Z",
  "version": "1.0.0"
}
```

---

## Match Endpoints

### Match Scholarships (Full Profile)

#### `POST /match`

Performs a full scholarship match for a registered student.

**Request Body:**
```json
{
  "studentId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (Sample Match Result):**
```json
{
  "success": true,
  "studentId": "550e8400-e29b-41d4-a716-446655440000",
  "studentName": "Maria Dela Cruz",
  "totalMatches": 8,
  "processingTimeMs": 45,
  "timestamp": "2026-01-14T09:06:04.000Z",
  "matches": [
    {
      "scholarship": {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "name": "DOST-SEI Science & Technology Undergraduate Scholarship",
        "providerName": "Department of Science and Technology - Science Education Institute",
        "providerType": "Government",
        "description": "The DOST-SEI Undergraduate Scholarship is the flagship scholarship program for aspiring Filipino scientists and engineers...",
        "officialLink": "https://www.sei.dost.gov.ph/index.php/programs-and-projects/scholarships/undergraduate-scholarships",
        "logoUrl": "/logos/dost.png",
        "applicationDeadline": "2026-02-28",
        "academicYear": "2026-2027",
        "benefits": {
          "tuition": true,
          "tuition_amount": null,
          "stipend": true,
          "stipend_amount_monthly": 7000,
          "book_allowance": true,
          "book_allowance_amount": 10000,
          "other_benefits": ["Thesis/Dissertation Allowance", "Graduation Clothing Allowance", "Group Insurance"]
        },
        "eligibility": {
          "minGwa": 85.0,
          "incomeCeiling": 500000,
          "allowedStrands": ["STEM"],
          "priorityCourses": ["Engineering", "Computer Science", "Information Technology", "Mathematics", "Physics", "Chemistry"]
        },
        "requiredDocuments": ["PSA", "Form138", "ITR", "GoodMoral"],
        "slotsAvailable": 5000,
        "isRenewable": true,
        "tags": ["STEM", "Science", "Technology", "Engineering", "Government", "National"]
      },
      "matchScore": 65,
      "matchPercentage": 72,
      "scoringBreakdown": {
        "priorityCourseBonus": 20,
        "publicShsBonus": 0,
        "strandMatchBonus": 5,
        "priorityStrandBonus": 10,
        "documentsCompleteBonus": 15,
        "incomeLowerBonus": 5,
        "gwaHigherBonus": 10,
        "residencyBonus": 0,
        "pwdBonus": 0,
        "soloParentBonus": 0,
        "indigenousBonus": 0,
        "totalScore": 65,
        "allHardFiltersPassed": true
      },
      "daysRemaining": 45,
      "isUrgent": false,
      "missingDocuments": [],
      "isHardMatch": true
    },
    {
      "scholarship": {
        "id": "b2c3d4e5-f6a7-8901-bcde-f23456789012",
        "name": "Makati City College Scholarship",
        "providerName": "City Government of Makati",
        "providerType": "LGU",
        "description": "Free college education for Makati residents at the University of Makati and partner institutions...",
        "officialLink": "https://www.makati.gov.ph/education",
        "applicationDeadline": "2026-01-31",
        "benefits": {
          "tuition": true,
          "stipend": true,
          "stipend_amount_monthly": 3000,
          "book_allowance": true,
          "transportation": true,
          "other_benefits": ["Free Meals at School Cafeteria", "Medical Insurance"]
        },
        "eligibility": {
          "minGwa": 82.0,
          "incomeCeiling": null,
          "allowedStrands": null,
          "priorityCourses": null
        },
        "requiredDocuments": ["PSA", "Form138", "GoodMoral"]
      },
      "matchScore": 55,
      "matchPercentage": 61,
      "scoringBreakdown": {
        "priorityCourseBonus": 0,
        "publicShsBonus": 0,
        "strandMatchBonus": 5,
        "priorityStrandBonus": 0,
        "documentsCompleteBonus": 15,
        "incomeLowerBonus": 0,
        "gwaHigherBonus": 10,
        "residencyBonus": 5,
        "pwdBonus": 0,
        "soloParentBonus": 0,
        "indigenousBonus": 0,
        "totalScore": 55,
        "allHardFiltersPassed": true
      },
      "daysRemaining": 17,
      "isUrgent": false,
      "missingDocuments": [],
      "isHardMatch": true
    },
    {
      "scholarship": {
        "id": "c3d4e5f6-a7b8-9012-cdef-345678901234",
        "name": "SM Foundation College Scholarship Program",
        "providerName": "SM Foundation, Inc.",
        "providerType": "Private",
        "description": "SM Foundation's flagship scholarship program for deserving students from public high schools...",
        "officialLink": "https://www.sm-foundation.org/sm-college-scholarship-program/",
        "applicationDeadline": "2026-03-31",
        "benefits": {
          "tuition": true,
          "stipend": true,
          "stipend_amount_monthly": 5000,
          "book_allowance": true,
          "other_benefits": ["School Supplies", "Uniform Allowance", "Transportation Allowance", "Mentorship Program"]
        },
        "eligibility": {
          "minGwa": 88.0,
          "incomeCeiling": 300000,
          "allowedStrands": null,
          "priorityCourses": ["Accountancy", "Information Technology", "Computer Science", "Engineering", "Hotel and Restaurant Management"]
        }
      },
      "matchScore": 50,
      "matchPercentage": 55,
      "scoringBreakdown": {
        "priorityCourseBonus": 20,
        "publicShsBonus": 10,
        "strandMatchBonus": 5,
        "priorityStrandBonus": 0,
        "documentsCompleteBonus": 15,
        "incomeLowerBonus": 0,
        "gwaHigherBonus": 0,
        "residencyBonus": 0,
        "pwdBonus": 0,
        "soloParentBonus": 0,
        "indigenousBonus": 0,
        "totalScore": 50,
        "allHardFiltersPassed": true
      },
      "daysRemaining": 76,
      "isUrgent": false,
      "missingDocuments": [],
      "isHardMatch": true
    }
  ],
  "summary": {
    "highMatches": 2,
    "mediumMatches": 4,
    "lowMatches": 2,
    "urgentDeadlines": 1,
    "byProviderType": {
      "Government": 3,
      "Private": 4,
      "LGU": 1
    }
  }
}
```

### Quick Match (1-Minute Scan)

#### `POST /match/quick`

Performs a quick scholarship match for anonymous/unregistered users with minimal profile data.

**Request Body:**
```json
{
  "gwa": 89.5,
  "annualIncome": 280000,
  "shsType": "Public",
  "cityId": 2,
  "residencyYears": 10,
  "strand": "STEM",
  "intendedCourse": "Computer Science"
}
```

**Response:**
```json
{
  "success": true,
  "totalMatches": 12,
  "processingTimeMs": 23,
  "timestamp": "2026-01-14T09:06:04.000Z",
  "matches": [
    {
      "scholarship": {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "name": "DOST-SEI Science & Technology Undergraduate Scholarship",
        "providerName": "DOST-SEI",
        "providerType": "Government",
        "applicationDeadline": "2026-02-28"
      },
      "matchPercentage": 75,
      "matchScore": 45,
      "daysRemaining": 45,
      "isUrgent": false
    },
    {
      "scholarship": {
        "id": "c3d4e5f6-a7b8-9012-cdef-345678901234",
        "name": "SM Foundation College Scholarship Program",
        "providerName": "SM Foundation, Inc.",
        "providerType": "Private",
        "applicationDeadline": "2026-03-31"
      },
      "matchPercentage": 70,
      "matchScore": 40,
      "daysRemaining": 76,
      "isUrgent": false
    }
  ]
}
```

### Get Scoring Weights

#### `GET /match/scoring-weights`

Returns the scoring weights used in the matching algorithm.

**Response:**
```json
{
  "success": true,
  "weights": {
    "PRIORITY_COURSE": 20,
    "PUBLIC_SHS": 10,
    "STRAND_MATCH": 5,
    "PRIORITY_STRAND": 10,
    "DOCUMENTS_COMPLETE": 15,
    "INCOME_LOWER": 5,
    "GWA_HIGHER": 10,
    "RESIDENCY_BONUS": 5,
    "PWD_BONUS": 5,
    "SOLO_PARENT": 5,
    "INDIGENOUS": 5
  },
  "maxPossibleScore": 90,
  "description": {
    "PRIORITY_COURSE": "Student's intended course matches scholarship priority",
    "PUBLIC_SHS": "Student is from public SHS (favored by some private providers)",
    "STRAND_MATCH": "Student's strand is allowed by the scholarship",
    "PRIORITY_STRAND": "Student's strand is a priority for the scholarship",
    "DOCUMENTS_COMPLETE": "All required documents are ready",
    "INCOME_LOWER": "Income is significantly below the ceiling (more needy)",
    "GWA_HIGHER": "GWA exceeds minimum requirement by 5+ points",
    "RESIDENCY_BONUS": "Exceeds minimum residency requirement",
    "PWD_BONUS": "Person with disability status",
    "SOLO_PARENT": "Child of solo parent",
    "INDIGENOUS": "Indigenous peoples member"
  }
}
```

---

## Deadline Endpoints

### Get All Deadlines

#### `GET /deadlines`

Returns all scholarship deadlines with optional filters.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| limit | number | 50 | Maximum results to return |
| offset | number | 0 | Offset for pagination |
| urgentOnly | boolean | false | Only return urgent deadlines (<14 days) |
| providerType | string | null | Filter by provider type |
| sortBy | string | "deadline" | Sort by "deadline" or "name" |

**Response:**
```json
{
  "success": true,
  "timestamp": "2026-01-14T09:06:04.000Z",
  "serverDate": "2026-01-14",
  "pagination": {
    "total": 15,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  },
  "summary": {
    "total": 15,
    "critical": 1,
    "urgent": 3,
    "closingThisWeek": 2,
    "closingThisMonth": 5
  },
  "deadlines": [
    {
      "id": "d4e5f6a7-b8c9-0123-def4-567890123456",
      "name": "Ayala Foundation Scholarship Program",
      "providerName": "Ayala Foundation, Inc.",
      "providerType": "Private",
      "officialLink": "https://www.ayalafoundation.org/education",
      "applicationDeadline": "2026-01-25",
      "daysRemaining": 11,
      "isUrgent": true,
      "urgencyLevel": "urgent",
      "minGwa": 87.0,
      "incomeCeiling": 350000,
      "tags": ["Private", "National", "Business", "Engineering"]
    },
    {
      "id": "b2c3d4e5-f6a7-8901-bcde-f23456789012",
      "name": "Makati City College Scholarship",
      "providerName": "City Government of Makati",
      "providerType": "LGU",
      "applicationDeadline": "2026-01-31",
      "daysRemaining": 17,
      "isUrgent": false,
      "urgencyLevel": "soon"
    }
  ]
}
```

### Get Urgent Deadlines

#### `GET /deadlines/urgent`

Returns only scholarships with deadlines within 14 days.

### Get Deadline Calendar

#### `GET /deadlines/calendar`

Returns deadlines grouped by date for calendar display.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| startDate | string | today | Start date (YYYY-MM-DD) |
| endDate | string | +3 months | End date (YYYY-MM-DD) |

**Response:**
```json
{
  "success": true,
  "startDate": "2026-01-14",
  "endDate": "2026-04-14",
  "entries": [
    {
      "date": "2026-01-25",
      "count": 2,
      "scholarships": [
        {"id": "...", "name": "Ayala Foundation Scholarship", "providerName": "Ayala Foundation", "providerType": "Private"},
        {"id": "...", "name": "UnionBank START Scholarship", "providerName": "UnionBank", "providerType": "Private"}
      ]
    },
    {
      "date": "2026-01-31",
      "count": 1,
      "scholarships": [
        {"id": "...", "name": "Makati City College Scholarship", "providerName": "City Government of Makati", "providerType": "LGU"}
      ]
    }
  ]
}
```

### Get Student Deadlines

#### `GET /deadlines/student/:studentId`

Returns deadlines for a student's saved scholarships.

---

## Scholarship Endpoints

### Get All Scholarships

#### `GET /scholarships`

Returns all scholarships with optional filters.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| limit | number | 50 | Maximum results |
| offset | number | 0 | Pagination offset |
| providerType | string | null | Filter by provider type |
| status | string | "open" | Filter by status |
| search | string | null | Search in name/provider |

### Get Scholarship by ID

#### `GET /scholarships/:id`

Returns detailed information for a specific scholarship.

### Get Scholarships by Provider Type

#### `GET /scholarships/provider/:providerType`

Returns all scholarships for a specific provider type.

**Valid Provider Types:**
- Government
- Private
- LGU
- International
- NGO

---

## Student Endpoints

### Create Student Profile

#### `POST /students`

Creates a new student profile.

**Request Body:**
```json
{
  "firstName": "Maria",
  "middleName": "Santos",
  "lastName": "Dela Cruz",
  "email": "maria.delacruz@email.com",
  "phone": "09171234567",
  "birthDate": "2008-05-15",
  "gwa": 89.5,
  "strand": "STEM",
  "shsType": "Public",
  "shsSchoolName": "Manila Science High School",
  "graduationYear": 2026,
  "intendedCourse": "Computer Science",
  "intendedUniversity": "University of the Philippines",
  "annualHouseholdIncome": 280000,
  "isSoloParentChild": false,
  "isPwd": false,
  "isIndigenous": false,
  "cityId": 2,
  "residencyYears": 10,
  "permanentAddress": "123 Makati Avenue, Brgy. San Lorenzo, Makati City"
}
```

### Get Student Profile

#### `GET /students/:id`

Returns student profile with document status.

### Update Student Profile

#### `PUT /students/:id`

Updates student profile fields.

### Save Scholarship

#### `POST /students/:id/save-scholarship`

Saves a scholarship to the student's list.

### Get Saved Scholarships

#### `GET /students/:id/saved-scholarships`

Returns student's saved scholarships with deadline info.

---

## Document Endpoints

### Get Student Documents

#### `GET /documents/student/:studentId`

Returns document completion status for a student.

**Response:**
```json
{
  "success": true,
  "studentId": "550e8400-e29b-41d4-a716-446655440000",
  "completionStatus": {
    "completed": 4,
    "total": 4,
    "percentage": 100,
    "isComplete": true
  },
  "documents": [
    {
      "documentType": "PSA",
      "displayName": "PSA Birth Certificate",
      "description": "Official birth certificate issued by the Philippine Statistics Authority",
      "status": "uploaded",
      "fileName": "psa_maria_delacruz.pdf",
      "uploadedAt": "2026-01-10T08:30:00.000Z",
      "verifiedAt": null,
      "rejectionReason": null,
      "isRequired": true
    },
    {
      "documentType": "Form138",
      "displayName": "Form 138 (Report Card)",
      "description": "Official high school report card showing your GWA/grades",
      "status": "verified",
      "fileName": "form138_maria_delacruz.pdf",
      "uploadedAt": "2026-01-10T08:35:00.000Z",
      "verifiedAt": "2026-01-11T10:00:00.000Z",
      "isRequired": true
    },
    {
      "documentType": "ITR",
      "displayName": "Income Tax Return (ITR)",
      "description": "Parent/Guardian's latest Income Tax Return or Certificate of No Income",
      "status": "pending",
      "fileName": null,
      "uploadedAt": null,
      "isRequired": true
    },
    {
      "documentType": "GoodMoral",
      "displayName": "Certificate of Good Moral Character",
      "description": "Good Moral Certificate from your current/previous school",
      "status": "pending",
      "fileName": null,
      "isRequired": true
    }
  ]
}
```

### Upload Document

#### `POST /documents/upload`

Records a document upload (metadata only).

### Get Document Requirements

#### `GET /documents/requirements`

Returns list of required documents with descriptions and tips.

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message here",
  "message": "Detailed message (development only)"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

---

## Database Schema Summary

### Core Tables

1. **scholarships** - Scholarship information with JSONB eligibility and benefits
2. **students** - Student profiles with academic and financial data
3. **student_documents** - Document upload tracking (Big 4)
4. **match_results** - Cached matching results
5. **saved_scholarships** - Student favorites

### Supporting Tables

- **regions** - Philippine regions (PSGC)
- **provinces** - Provinces linked to regions
- **cities_municipalities** - Cities/municipalities linked to provinces

---

## Matching Algorithm

### Phase 1: Hard Filters (Database Level)
- GWA ≥ minimum requirement
- Income ≤ ceiling
- Location matches (nationwide or specific region/province/city)
- Residency meets minimum years
- Strand is in allowed list

### Phase 2: Scoring (Application Level)
| Factor | Points | Condition |
|--------|--------|-----------|
| Priority Course | +20 | Intended course matches scholarship priority |
| Public SHS | +10 | Student from public SHS + private/NGO provider |
| Strand Match | +5 | Strand in allowed list |
| Priority Strand | +10 | Strand is prioritized |
| Documents Complete | +15 | All required documents uploaded |
| Income Lower | +5 | Income ≤ 50% of ceiling |
| GWA Higher | +10 | GWA ≥ minimum + 5 points |
| Residency Bonus | +5 | Residency ≥ minimum + 2 years |
| PWD | +5 | Person with disability |
| Solo Parent Child | +5 | Child of solo parent |
| Indigenous | +5 | Indigenous peoples member |

**Maximum Score: 90 points**

### Phase 3: Output
- Calculate `matchPercentage = (score / maxScore) * 100`
- Sort by `matchScore` descending
- Group by urgency level

---

## Setup Instructions

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp env.template .env
   # Edit .env with your PostgreSQL credentials
   ```

3. **Setup database:**
   ```bash
   # Create database
   psql -U postgres -c "CREATE DATABASE iskolarhub;"
   
   # Run schema
   psql -U postgres -d iskolarhub -f src/database/schema.sql
   
   # Seed data
   psql -U postgres -d iskolarhub -f src/database/seed.sql
   ```

4. **Start server:**
   ```bash
   npm run dev
   ```

5. **Test health endpoint:**
   ```bash
   curl http://localhost:3001/api/health
   ```

---

## Performance Considerations

1. **Database Indexes:**
   - GIN indexes on JSONB columns for fast eligibility filtering
   - B-tree indexes on commonly filtered columns (GWA, income, deadline)

2. **Query Optimization:**
   - Hard filters applied at database level (not in application)
   - Limit results to prevent memory issues
   - Use pagination for large result sets

3. **Caching Strategy (Future):**
   - Cache frequently accessed scholarships
   - Cache match results with TTL
   - Invalidate on scholarship updates

---

## Vault Endpoints (Document Status)

### Update Document Status

#### `POST /vault/status`

Updates the status of a specific document for a student.

**Request Body:**
```json
{
  "studentId": "550e8400-e29b-41d4-a716-446655440000",
  "documentType": "PSA",
  "status": "uploaded",
  "metadata": {
    "fileName": "psa_birth_certificate.pdf",
    "fileUrl": "https://storage.example.com/docs/psa.pdf"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Document status updated to \"uploaded\"",
  "document": {
    "id": "doc-uuid",
    "documentType": "PSA",
    "displayName": "PSA Birth Certificate",
    "status": "uploaded",
    "fileName": "psa_birth_certificate.pdf",
    "uploadedAt": "2026-01-14T09:18:00.000Z"
  },
  "vaultStatus": {
    "studentId": "550e8400-e29b-41d4-a716-446655440000",
    "totalRequired": 4,
    "completion": {
      "ready": 2,
      "verified": 1,
      "pending": 2,
      "rejected": 0,
      "percentage": 50
    },
    "isComplete": false,
    "documents": [...],
    "readinessMessage": {
      "status": "halfway",
      "icon": "📋",
      "message": "You're halfway done. Keep going!",
      "color": "orange"
    }
  }
}
```

### Batch Update Documents

#### `POST /vault/status/batch`

Updates multiple document statuses at once.

**Request Body:**
```json
{
  "studentId": "550e8400-e29b-41d4-a716-446655440000",
  "updates": [
    { "documentType": "PSA", "status": "uploaded", "metadata": { "fileName": "psa.pdf" } },
    { "documentType": "Form138", "status": "verified" }
  ]
}
```

### Get Vault Status

#### `GET /vault/:studentId`

Returns the complete vault status for a student.

### Check Document Eligibility

#### `POST /vault/check-eligibility`

Checks if a student has the required documents for a scholarship.

**Request Body:**
```json
{
  "studentId": "550e8400-e29b-41d4-a716-446655440000",
  "requiredDocuments": ["PSA", "Form138", "ITR"]
}
```

**Response:**
```json
{
  "success": true,
  "isEligible": false,
  "requiredDocuments": [
    { "documentType": "PSA", "displayName": "PSA Birth Certificate", "isReady": true },
    { "documentType": "Form138", "displayName": "Form 138 (Report Card)", "isReady": true },
    { "documentType": "ITR", "displayName": "Income Tax Return (ITR)", "isReady": false }
  ],
  "missingDocuments": [
    { "documentType": "ITR", "displayName": "Income Tax Return (ITR)" }
  ],
  "message": "Missing 1 document(s): Income Tax Return (ITR)"
}
```

---

## Location Endpoints (Geocoding & Residency)

### Detect Location from Coordinates

#### `POST /location/detect`

Reverse geocodes coordinates to detect the nearest Philippine city and check for LGU scholarships.

**Request Body:**
```json
{
  "latitude": 14.5547,
  "longitude": 121.0244
}
```

**Response (with LGU scholarship detected):**
```json
{
  "success": true,
  "location": {
    "success": true,
    "city": {
      "id": 2,
      "name": "Makati",
      "coordinates": { "latitude": 14.5547, "longitude": 121.0244 }
    },
    "distance": 0.42,
    "confidence": "high",
    "isWithinCityBounds": true
  },
  "hasLguScholarship": true,
  "lguScholarship": {
    "name": "Makati City",
    "scholarshipName": "Makati City College Scholarship",
    "minResidencyYears": 3,
    "requiresProofOfResidency": true,
    "cityId": 2
  },
  "requiredAction": {
    "type": "VERIFY_RESIDENCY",
    "title": "Residency Verification Required",
    "message": "Makati City offers a scholarship program. Please verify your residency duration.",
    "fields": [
      {
        "name": "residencyYears",
        "label": "How many years have you lived in Makati City?",
        "type": "number",
        "required": true,
        "min": 0,
        "max": 50,
        "hint": "Minimum 3 years required for Makati City College Scholarship"
      }
    ],
    "scholarshipInfo": {
      "name": "Makati City College Scholarship",
      "minResidency": 3,
      "requiresProofOfResidency": true
    }
  }
}
```

### Validate Residency for LGU

#### `POST /location/validate-residency`

Validates if a student meets the residency requirement for an LGU scholarship.

**Request Body:**
```json
{
  "cityId": 2,
  "residencyYears": 5
}
```

**Response (eligible):**
```json
{
  "success": true,
  "isEligible": true,
  "lguInfo": {
    "city": "Makati City",
    "scholarshipName": "Makati City College Scholarship",
    "minResidencyRequired": 3,
    "actualResidency": 5
  },
  "message": "You meet the 3-year residency requirement for Makati City College Scholarship!",
  "yearsNeeded": 0,
  "nextSteps": [
    "Prepare proof of residency (Barangay Certificate)",
    "Ensure your address is consistent across documents",
    "Apply for Makati City College Scholarship"
  ]
}
```

**Response (not eligible):**
```json
{
  "success": true,
  "isEligible": false,
  "lguInfo": {
    "city": "Makati City",
    "scholarshipName": "Makati City College Scholarship",
    "minResidencyRequired": 3,
    "actualResidency": 1
  },
  "message": "You need at least 3 years of residency. You currently have 1 year(s).",
  "yearsNeeded": 2,
  "nextSteps": [
    "Continue residing in Makati City for 2 more year(s)",
    "Consider other national scholarship programs in the meantime"
  ]
}
```

### Search Cities

#### `GET /location/cities/search?q=makati`

Searches for cities by name.

**Response:**
```json
{
  "success": true,
  "query": "makati",
  "total": 1,
  "cities": [
    {
      "id": 2,
      "name": "Makati",
      "isCity": true,
      "province": "Metro Manila",
      "region": "National Capital Region (NCR)",
      "displayName": "Makati, Metro Manila",
      "hasLguScholarship": true
    }
  ]
}
```

### Get City Details

#### `GET /location/cities/:cityId`

Returns detailed information about a city.

### Get LGU Scholarship Cities

#### `GET /location/lgu-scholarships`

Returns all cities with LGU scholarship programs.

**Response:**
```json
{
  "success": true,
  "total": 9,
  "description": "Cities with Local Government Unit (LGU) scholarship programs",
  "cities": [
    { "cityId": 2, "name": "Makati City", "scholarshipName": "Makati City College Scholarship", "minResidencyYears": 3 },
    { "cityId": 3, "name": "Taguig City", "scholarshipName": "Taguig City University Scholarship", "minResidencyYears": 5 },
    { "cityId": 4, "name": "Quezon City", "scholarshipName": "QC-CHED Expanded Scholarship Program", "minResidencyYears": 3 }
  ]
}
```

### Process Location with Residency

#### `POST /location/process-with-residency`

Combined endpoint that detects location AND validates residency in one call.

**Request Body:**
```json
{
  "latitude": 14.5547,
  "longitude": 121.0244,
  "residencyYears": 5
}
```

---

## Validation Endpoints

### Validate Quick Scan Profile

#### `POST /validate/quick-scan`

Validates all 1-Minute Scan inputs at once.

**Request Body:**
```json
{
  "gwa": 89.5,
  "annualIncome": 280000,
  "shsType": "Public",
  "strand": "STEM",
  "intendedCourse": "Computer Science",
  "residencyYears": 5
}
```

**Response (valid):**
```json
{
  "success": true,
  "validation": {
    "isValid": true,
    "errors": [],
    "warnings": [],
    "errorCount": 0,
    "warningCount": 0
  },
  "isReadyForMatching": true
}
```

**Response (with errors):**
```json
{
  "success": true,
  "validation": {
    "isValid": false,
    "errors": [
      { "field": "gwa", "message": "GWA must be at least 70.0" },
      { "field": "shsType", "message": "SHS type must be one of: Public, Private" }
    ],
    "warnings": [],
    "errorCount": 2,
    "warningCount": 0
  },
  "isReadyForMatching": false
}
```

### Validate Course

#### `POST /validate/course`

Validates an intended course against the standardized degree program list.

**Request Body:**
```json
{
  "intendedCourse": "CompSci"
}
```

**Response (with suggestions):**
```json
{
  "success": true,
  "field": "intendedCourse",
  "value": "CompSci",
  "validation": {
    "isValid": true,
    "errors": [],
    "warnings": [
      { "field": "intendedCourse", "message": "Did you mean \"Computer Science\"? Using standardized names helps with matching." }
    ]
  },
  "suggestedCourse": "Computer Science"
}
```

### Get Valid Courses

#### `GET /validate/courses?q=eng`

Returns list of valid degree programs for autocomplete.

**Response:**
```json
{
  "success": true,
  "total": 12,
  "query": "eng",
  "courses": [
    "Civil Engineering",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Electronics Engineering",
    "Chemical Engineering",
    "Computer Engineering",
    "Industrial Engineering",
    "Software Engineering"
  ]
}
```

### Get Valid Strands

#### `GET /validate/strands`

Returns valid SHS strands with descriptions.

**Response:**
```json
{
  "success": true,
  "strands": [
    { "code": "STEM", "name": "Science, Technology, Engineering, and Mathematics", "description": "For students pursuing science and tech-related degrees" },
    { "code": "ABM", "name": "Accountancy, Business, and Management", "description": "For students pursuing business-related degrees" },
    { "code": "HUMSS", "name": "Humanities and Social Sciences", "description": "For students pursuing social science and humanities degrees" },
    { "code": "GAS", "name": "General Academic Strand", "description": "For students who are still undecided" },
    { "code": "TVL", "name": "Technical-Vocational-Livelihood", "description": "For students pursuing technical and vocational courses" },
    { "code": "Sports", "name": "Sports Track", "description": "For students pursuing sports-related careers" },
    { "code": "Arts", "name": "Arts and Design Track", "description": "For students pursuing arts and design careers" }
  ]
}
```

### Get SHS Types

#### `GET /validate/shs-types`

Returns valid SHS types.

---

## Validation Rules Summary

| Field | Validation | Range/Options |
|-------|------------|---------------|
| GWA | Required, numeric | 70.0 - 100.0 |
| Annual Income | Required, positive integer | 0 - 50,000,000 |
| SHS Type | Required, enum | Public, Private |
| Strand | Optional, enum | STEM, ABM, HUMSS, GAS, TVL, Sports, Arts |
| Intended Course | Optional, standardized list | ~100 degree programs |
| Residency Years | Optional, positive integer | 0 - 50 |
| Coordinates | Philippine bounds check | Lat: 4.5-21.5, Lng: 116.0-127.0 |

