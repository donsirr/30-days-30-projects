# ScanMind 🧠

A stateless AI reasoning engine that processes questions against PDF documents using Claude, enforcing a **strict retrieval-only policy** with zero external knowledge.

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
2. An [Anthropic API key](https://console.anthropic.com/)

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
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
    "content": string,      // Plain text OR Base64-encoded image
    "mimeType"?: string     // For images: "image/png", "image/jpeg", etc.
  },
  "context": [
    {
      "fileName": "document.pdf",
      "pageContent": "The extracted text from this page...",
      "pageNumber": 1
    }
  ],
  "sessionId": "session_123"  // For transient logging (no persistence)
}
```

### Response Structure

```typescript
{
  "status": "success" | "error" | "no_match",
  "answer": "The core response text",
  "sourceMetadata": {
    "file": "filename.pdf",
    "page": 12,
    "relevantSnippet": "Direct quote from source"
  },
  "reasoning": "Step-by-step logic used to derive the answer",
  "questionType": "multiple_choice" | "identification" | "true_false" | "long_answer" | "definition" | "comparison" | "unknown",
  "confidence": 0.95,           // 0-1 confidence score
  "missingTopics": ["topic1"],  // Only present if status is "no_match"
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
import { ContextSource } from '@/lib/brain-types';

// Prepare PDF context
const context: ContextSource[] = [
  {
    fileName: "biology-notes.pdf",
    pageContent: "Photosynthesis is the process by which plants convert sunlight...",
    pageNumber: 5
  }
];

// Ask a text question
const result = await askTextQuestion(
  "What is photosynthesis?",
  context
);

if (result.success) {
  console.log(formatBrainResponseForDisplay(result.data));
} else {
  console.error(result.error);
}

// Ask an image question (e.g., a photo of an exam question)
const imageFile = new File([...], "question.png", { type: "image/png" });
const imageResult = await askImageQuestion(imageFile, context);
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
    context: [
      {
        fileName: 'history-textbook.pdf',
        pageContent: 'The French Revolution was caused by...',
        pageNumber: 42
      }
    ],
    sessionId: 'user_session_123'
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
│  │  Response   │◀───│  JSON Parsing   │◀───│  Claude API Call  │   │
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
- Status is set to `"no_match"`
- Answer explains information was not found
- `missingTopics` array lists what was missing from sources

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Add `ANTHROPIC_API_KEY` to environment variables
4. Deploy

### Self-Hosted

```bash
npm run build
npm start
```

---

## Tech Stack

- **Framework**: Next.js 16
- **AI**: Claude (Anthropic SDK)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4

## License

MIT
