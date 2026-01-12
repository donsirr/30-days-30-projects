/**
 * Brain API Types - ScanMind AI Reasoning Engine
 * These types define the contract for the stateless AI reasoning endpoint
 */

// ==================== INPUT TYPES ====================

/**
 * Context source from a PDF document
 */
export interface ContextSource {
    fileName: string;
    pageContent: string;
    pageNumber: number;
}

/**
 * Question input - can be text or base64 encoded image
 */
export interface QuestionInput {
    type: 'text' | 'image';
    content: string; // Plain text or Base64 encoded image
    mimeType?: string; // For images: 'image/png', 'image/jpeg', etc.
}

/**
 * Brain API Request Payload
 */
export interface BrainRequest {
    question: QuestionInput;
    context: ContextSource[];
    sessionId: string;
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
export type ResponseStatus = 'success' | 'error' | 'no_match';

/**
 * Source metadata for citation
 */
export interface SourceMetadata {
    file: string;
    page: number;
    relevantSnippet?: string;
}

/**
 * Brain API Response Structure
 */
export interface BrainResponse {
    status: ResponseStatus;
    answer: string;
    sourceMetadata: SourceMetadata | null;
    reasoning: string;
    questionType: QuestionCategory;
    confidence?: number; // 0-1 confidence score
    missingTopics?: string[]; // Topics from question not found in sources
    processingTimeMs?: number;
}

/**
 * Error response structure
 */
export interface BrainErrorResponse {
    status: 'error';
    error: string;
    code: 'INVALID_INPUT' | 'PROCESSING_FAILED' | 'MODEL_ERROR' | 'RATE_LIMITED';
    details?: string;
}

// ==================== INTERNAL TYPES ====================

/**
 * Parsed response from Claude's structured output
 */
export interface ClaudeStructuredResponse {
    answer_found: boolean;
    answer: string;
    source_file: string | null;
    source_page: number | null;
    relevant_snippet: string | null;
    reasoning_steps: string[];
    question_type: QuestionCategory;
    confidence: number;
    missing_topics: string[];
    multiple_choice_analysis?: {
        correct_option: string;
        correct_justification: string;
        incorrect_options: Array<{
            option: string;
            contradiction_reason: string;
        }>;
    };
}
