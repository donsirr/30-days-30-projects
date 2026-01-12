# ScanMind 🧠

A stateless AI reasoning engine that processes questions against PDF documents using **Google Gemini 1.5 Flash**. Leverages the massive 1-million-token context window for the "Combined Mind" approach, enforcing a **strict retrieval-only policy** with zero external knowledge.

## Features

- **🔒 Strict Mode**: Zero-knowledge policy - answers ONLY from provided PDF context
- **📸 Multimodal Input**: Supports both text questions and image-based questions
- **📄 Source Citations**: Every answer includes file name and page number
- **🎯 Question Type Detection**: Specialized reasoning for Multiple Choice, True/False, Identification, and Long Answer
- **📊 Structured Responses**: Clean JSON output with reasoning steps and confidence scores
- **⚡ High Performance**: Optimized for low latency with transient logging

## Getting Started

### Prerequisites

1. Node.js 18+ 
2. A [Google AI Studio API key](https://aistudio.google.com/app/apikey)

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## Brain API Specification

### Endpoint

```
POST /api/brain
```

### Request Payload

```typescript
{
  "question": {
    "type": "text" | "image",
    "content": string,      // Plain text OR Base64-encoded image (no data URL prefix)
    "mimeType"?: string     // Required for images: "image/png", "image/jpeg", "image/webp"
  },
  "pdfContext": [           // The "Combined Mind" - all PDF sources
    {
      "fileName": "document.pdf",
      "content": "The extracted text from this page...",
      "pageNumber": 1
    }
  ],
  "sessionId"?: "session_123"  // Optional, for transient logging
}
```

### Response Structure

```typescript
{
  "status": "success" | "error" | "not_found",
  "answer": "The core response text",
  "citations": [                // Multiple sources can be cited
    {
      "fileName": "filename.pdf",
      "pageNumber": 12,
      "snippet": "Direct quote from source"
    }
  ],
  "reasoning": "Step-by-step logic used to derive the answer",
  "questionType": "multiple_choice" | "identification" | "true_false" | "long_answer" | "definition" | "comparison" | "unknown",
  "confidence": 0.95,           // 0-1 confidence score
  "missingTopics": ["topic1"],  // Only present if status is "not_found"
  "processingTimeMs": 1234
}
```

### Error Response

```typescript
{
  "status": "error",
  "error": "Error description",
  "code": "INVALID_INPUT" | "PROCESSING_FAILED" | "MODEL_ERROR" | "RATE_LIMITED",
  "details": "Additional error details"
}
```

---

## Usage Examples

### Using the Client Library

```typescript
import { askTextQuestion, askImageQuestion, formatBrainResponseForDisplay } from '@/lib/brain-client';
import { PdfContextSource } from '@/lib/brain-types';

// Prepare PDF context (the "Combined Mind")
const pdfContext: PdfContextSource[] = [
  {
    fileName: "biology-notes.pdf",
    content: "Photosynthesis is the process by which plants convert sunlight...",
    pageNumber: 5
  },
  {
    fileName: "biology-notes.pdf",
    content: "The Calvin cycle occurs in the stroma of chloroplasts...",
    pageNumber: 6
  }
];

// Ask a text question
const result = await askTextQuestion(
  "What is photosynthesis?",
  pdfContext
);

if (result.success) {
  console.log(formatBrainResponseForDisplay(result.data));
} else {
  console.error(result.error);
}

// Ask an image question (e.g., a photo of an exam question)
const imageFile = new File([...], "question.png", { type: "image/png" });
const imageResult = await askImageQuestion(imageFile, pdfContext);
```

### Direct API Call

```javascript
const response = await fetch('/api/brain', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question: {
      type: 'text',
      content: 'What are the main causes of the French Revolution?'
    },
    pdfContext: [
      {
        fileName: 'history-textbook.pdf',
        content: 'The French Revolution was caused by economic crisis, social inequality...',
        pageNumber: 42
      }
    ]
  })
});

const data = await response.json();
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ScanMind Brain API                           │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────────┐    ┌───────────────────┐   │
│  │   Request   │───▶│    Validation   │───▶│  Context Formatter│   │
│  │   Handler   │    │    & Parsing    │    │     & Prompts     │   │
│  └─────────────┘    └─────────────────┘    └───────────────────┘   │
│         │                                            │              │
│         ▼                                            ▼              │
│  ┌─────────────┐    ┌─────────────────┐    ┌───────────────────┐   │
│  │  Response   │◀───│  JSON Parsing   │◀───│  Gemini API Call  │   │
│  │   Mapper    │    │  & Validation   │    │  (Strict Mode)    │   │
│  └─────────────┘    └─────────────────┘    └───────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Components

| File | Purpose |
|------|---------|
| `app/api/brain/route.ts` | Main API endpoint handler |
| `lib/brain-types.ts` | TypeScript type definitions |
| `lib/brain-prompts.ts` | System prompts & context formatting |
| `lib/brain-client.ts` | Frontend client utilities |

---

## Reasoning Protocol

The Brain API implements a strict reasoning loop:

1. **Source Mapping**: Cross-references the question against all provided PDF sources
2. **Constraint Check**: Verifies the answer exists *explicitly* in sources
3. **Format Detection**: Identifies question type and applies specialized logic
4. **Citation Generation**: Extracts source file and page number for every answer

### Failure State

If the answer cannot be found in the provided sources:
- Status is set to `"not_found"`
- Answer explains information was not found
- `missingTopics` array lists what was missing from sources

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Add `GOOGLE_GEMINI_API_KEY` to environment variables
4. Deploy

### Self-Hosted

```bash
npm run build
npm start
```

---

## Tech Stack

- **Framework**: Next.js 16
- **AI**: Google Gemini 1.5 Flash (1M token context)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4

## License

MIT
