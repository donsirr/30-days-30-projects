/**
 * Brain API Types - ScanMind AI Reasoning Engine (Gemini)
 * Types for the stateless AI reasoning endpoint using Google Gemini 1.5 Flash
 */

// ==================== INPUT TYPES ====================

/**
 * Question input - can be text or base64 encoded image
 */
export interface QuestionInput {
    type: 'text' | 'image';
    content: string; // Plain text or Base64 encoded image data (without data URL prefix)
    mimeType?: string; // For images: 'image/png', 'image/jpeg', 'image/webp', etc.
}

/**
 * PDF Context - combined text from uploaded PDFs with source tracking
 */
export interface PdfContextSource {
    fileName: string;
    pageNumber: number;
    content: string;
}

/**
 * Brain API Request Payload
 */
export interface BrainRequest {
    question: QuestionInput;
    pdfContext: PdfContextSource[]; // Array of PDF sources for the "Combined Mind"
    sessionId?: string; // Optional session ID for transient logging
}

// ==================== OUTPUT TYPES ====================

/**
 * Detected question types for specialized reasoning
 */
export type QuestionCategory =
    | 'multiple_choice'
    | 'identification'
    | 'true_false'
    | 'long_answer'
    | 'definition'
    | 'comparison'
    | 'unknown';

/**
 * Response status enumeration
 */
export type ResponseStatus = 'success' | 'error' | 'not_found';

/**
 * Source citation for the answer
 */
export interface SourceCitation {
    fileName: string;
    pageNumber: number;
    snippet?: string; // Relevant text excerpt from source
}

/**
 * Brain API Response - structured for the Running Feed UI
 */
export interface BrainResponse {
    status: ResponseStatus;
    answer: string;
    citations: SourceCitation[];
    reasoning?: string; // Step-by-step logic (for learning mode)
    questionType: QuestionCategory;
    confidence?: number; // 0-1 confidence score
    missingTopics?: string[]; // Topics not found in sources (for not_found status)
    processingTimeMs?: number;
}

/**
 * Error response structure
 */
export interface BrainErrorResponse {
    status: 'error';
    error: string;
    code: 'INVALID_INPUT' | 'PROCESSING_FAILED' | 'MODEL_ERROR' | 'RATE_LIMITED' | 'API_KEY_MISSING';
    details?: string;
}

// ==================== GEMINI RESPONSE PARSING ====================

/**
 * Expected JSON structure from Gemini's response
 */
export interface GeminiParsedResponse {
    found: boolean;
    answer: string;
    citations: Array<{
        file: string;
        page: number;
        snippet?: string;
    }>;
    reasoning: string;
    question_type: string;
    confidence: number;
    missing_topics?: string[];
    multiple_choice_analysis?: {
        correct_option: string;
        correct_justification: string;
        incorrect_options?: Array<{
            option: string;
            reason: string;
        }>;
    };
}

// ==================== RUNNING FEED TYPES ====================

/**
 * Feed item for the UI running feed
 */
export interface FeedItem {
    id: string;
    type: 'text' | 'image';
    timestamp: number;
    content: string; // The original question text or image preview URL
    response?: BrainResponse;
    status: 'loading' | 'success' | 'error' | 'not_found';
}
