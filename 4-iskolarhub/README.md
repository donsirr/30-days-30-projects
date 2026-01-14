# Iskolar-Hub

**A Scholarship Matching Platform for Filipino Students**

---

## What is Iskolar-Hub?

Iskolar-Hub is a free online platform that helps Senior High School students in the Philippines find and apply for scholarships. Instead of manually searching through dozens of scholarship websites, students can answer a few simple questions and instantly receive a personalized list of scholarships they qualify for.

The platform is designed for the 2026 Philippine academic cycle and includes scholarships from government agencies (DOST, CHED), private foundations (SM, Ayala, Megaworld), and local government units (Makati, Taguig, Quezon City).

---

## Why Do We Need This?

Every year, thousands of Filipino students miss out on scholarship opportunities simply because they did not know they existed or thought they were not qualified. The current process of finding scholarships is broken:

- **Scattered Information** — Scholarship announcements are spread across different government websites, Facebook pages, and school bulletin boards. There is no single place to find them all.

- **Confusing Requirements** — Each scholarship has different eligibility criteria: minimum grades, income ceilings, location restrictions, required documents. Students spend hours figuring out if they even qualify.

- **Missed Deadlines** — Without a centralized tracker, students often discover scholarships after the application period has closed.

- **Document Preparation** — Many students start the application process only to realize they are missing critical documents like their PSA birth certificate or parents' Income Tax Return.

Iskolar-Hub solves these problems by bringing all scholarship information into one platform and matching students with opportunities based on their actual profile.

---

## How It Works

### The 1-Minute Scan

Students answer four simple questions:

1. **What is your General Weighted Average (GWA)?**
2. **What is your family's annual household income?**
3. **Did you attend a public or private Senior High School?**
4. **What strand did you take?** (STEM, ABM, HUMSS, GAS, TVL)

Based on these answers, the system instantly shows a list of scholarships the student may qualify for, sorted by match percentage.

### Full Profile Matching

Students who create an account can fill out a complete profile including their intended course, location, and special circumstances (PWD, solo parent child, indigenous). This unlocks more accurate matching and access to location-based scholarships like LGU programs.

### Document Vault

The platform tracks the four documents commonly required by Philippine scholarships:

- PSA Birth Certificate
- Form 138 (High School Report Card)
- Income Tax Return (ITR)
- Certificate of Good Moral Character

Students can mark which documents they already have, and the system will warn them if a scholarship requires something they have not prepared yet.

### Deadline Tracker

All scholarship deadlines are displayed in a calendar view. Students can save scholarships to their personal list and receive reminders as deadlines approach.

---

## Scholarships in the Database

Iskolar-Hub currently includes scholarships from:

**Government Programs**
- DOST-SEI Science and Technology Undergraduate Scholarship
- CHED Tulong Dunong Program
- TESDA Training for Work Scholarship

**Private Foundations**
- SM Foundation College Scholarship
- Megaworld Foundation Scholarship
- Ayala Foundation Scholarship
- Gokongwei Brothers Foundation Engineering Scholarship

**Local Government Units**
- Makati City College Scholarship (3-year residency required)
- Taguig City University Scholarship (5-year residency required)
- Quezon City CHED Expanded Scholarship Program
- Pasig City Pamantasan Scholarship

The database is updated regularly as new scholarship cycles open.

---

## Technical Documentation

The following sections are intended for developers integrating with the Iskolar-Hub API.

### API Base URL

```
http://localhost:3001/api
```

### Authentication

Authentication is not yet implemented. All endpoints are currently public.

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/match` | Full scholarship matching for registered students |
| POST | `/match/quick` | 1-Minute Scan matching for anonymous users |
| GET | `/scholarships` | List all scholarships with filters |
| GET | `/scholarships/:id` | Get scholarship details by ID |
| GET | `/deadlines` | Get all upcoming deadlines |
| GET | `/deadlines/urgent` | Get scholarships closing within 14 days |
| POST | `/vault/status` | Update document status |
| GET | `/vault/:studentId` | Get student's document vault status |
| POST | `/location/detect` | Reverse geocode coordinates to Philippine city |
| POST | `/validate/quick-scan` | Validate 1-Minute Scan inputs |

### Quick Match Request

```http
POST /api/match/quick
Content-Type: application/json

{
  "gwa": 89.5,
  "annualIncome": 280000,
  "shsType": "Public",
  "strand": "STEM"
}
```

### Quick Match Response

```json
{
  "success": true,
  "totalMatches": 8,
  "processingTimeMs": 23,
  "matches": [
    {
      "scholarshipId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "scholarshipName": "DOST-SEI Science & Technology Undergraduate Scholarship",
      "category": "Government",
      "matchScore": 75,
      "reasons": [
        "Your GWA of 89.5 exceeds the minimum requirement of 85.0",
        "Your STEM strand is a priority for this scholarship",
        "Your household income qualifies for this program"
      ],
      "deadline": "2026-02-28",
      "daysRemaining": 45,
      "isUrgent": false,
      "isStrongMatch": true
    }
  ]
}
```

### Validation Rules

| Field | Type | Validation |
|-------|------|------------|
| gwa | number | Required. Must be between 70.0 and 100.0 |
| annualIncome | integer | Required. Must be a positive number |
| shsType | string | Required. Must be "Public" or "Private" |
| strand | string | Optional. Must be one of: STEM, ABM, HUMSS, GAS, TVL, Sports, Arts |

### Error Response Format

```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "GWA must be between 70.0 and 100.0",
  "details": [
    { "field": "gwa", "message": "Value 105 exceeds maximum of 100.0" }
  ]
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (validation error) |
| 404 | Resource not found |
| 500 | Internal server error |

---

## About This Project

Iskolar-Hub was created as part of a 30-day development challenge to address the scholarship accessibility gap in the Philippines. The goal is to make higher education more attainable for Filipino students by removing the friction in the scholarship discovery and application process.

For questions or feedback, please open an issue in this repository.

---

*Iskolar-Hub — Connecting Filipino students with the scholarships they deserve.*
