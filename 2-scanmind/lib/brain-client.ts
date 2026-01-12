/**
 * Brain API Client - Frontend utility for calling the ScanMind Brain API
 * Works with Gemini 1.5 Flash backend
 */

import {
    BrainRequest,
    BrainResponse,
    BrainErrorResponse,
    PdfContextSource,
    QuestionInput,
    FeedItem,
} from './brain-types';

/**
 * Generates a unique session ID for request tracking
 */
export function generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generates a unique feed item ID
 */
export function generateFeedItemId(): string {
    return `feed_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Converts a File object to base64 string (for image questions)
 * Returns the base64 data WITHOUT the data URL prefix
 */
export async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            // Remove the data URL prefix (e.g., "data:image/png;base64,")
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Creates a text question input
 */
export function createTextQuestion(text: string): QuestionInput {
    return {
        type: 'text',
        content: text,
    };
}

/**
 * Creates an image question input from a File
 */
export async function createImageQuestion(file: File): Promise<QuestionInput> {
    const base64 = await fileToBase64(file);
    return {
        type: 'image',
        content: base64,
        mimeType: file.type || 'image/jpeg',
    };
}

/**
 * Creates an image question input from a base64 string
 * Note: base64 should NOT include the data URL prefix
 */
export function createImageQuestionFromBase64(
    base64: string,
    mimeType: string = 'image/jpeg'
): QuestionInput {
    // Remove data URL prefix if present
    const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
    return {
        type: 'image',
        content: cleanBase64,
        mimeType,
    };
}

/**
 * Result of a brain API call
 */
export type BrainResult =
    | { success: true; data: BrainResponse }
    | { success: false; error: BrainErrorResponse };

/**
 * Calls the Brain API with the given question and PDF context
 * 
 * @param question - The question to ask (text or image)
 * @param pdfContext - Array of PDF context sources (the "Combined Mind")
 * @param sessionId - Optional session ID for tracking
 * @returns The brain response or error
 */
export async function askBrain(
    question: QuestionInput,
    pdfContext: PdfContextSource[],
    sessionId?: string
): Promise<BrainResult> {
    const request: BrainRequest = {
        question,
        pdfContext,
        sessionId: sessionId || generateSessionId(),
    };

    try {
        const response = await fetch('/api/brain', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        const data = await response.json();

        if (!response.ok || data.status === 'error') {
            return {
                success: false,
                error: data as BrainErrorResponse,
            };
        }

        return {
            success: true,
            data: data as BrainResponse,
        };
    } catch (error) {
        return {
            success: false,
            error: {
                status: 'error',
                error: error instanceof Error ? error.message : 'Network error',
                code: 'PROCESSING_FAILED',
            },
        };
    }
}

/**
 * Convenience function for asking a text question
 */
export async function askTextQuestion(
    text: string,
    pdfContext: PdfContextSource[],
    sessionId?: string
): Promise<BrainResult> {
    return askBrain(createTextQuestion(text), pdfContext, sessionId);
}

/**
 * Convenience function for asking an image question
 */
export async function askImageQuestion(
    imageFile: File,
    pdfContext: PdfContextSource[],
    sessionId?: string
): Promise<BrainResult> {
    const questionInput = await createImageQuestion(imageFile);
    return askBrain(questionInput, pdfContext, sessionId);
}

/**
 * Creates a loading feed item for the UI
 */
export function createLoadingFeedItem(
    questionType: 'text' | 'image',
    content: string
): FeedItem {
    return {
        id: generateFeedItemId(),
        type: questionType,
        timestamp: Date.now(),
        content,
        status: 'loading',
    };
}

/**
 * Updates a feed item with the brain response
 */
export function updateFeedItemWithResponse(
    feedItem: FeedItem,
    result: BrainResult
): FeedItem {
    if (result.success) {
        return {
            ...feedItem,
            response: result.data,
            status: result.data.status === 'not_found' ? 'not_found' : 'success',
        };
    }

    return {
        ...feedItem,
        status: 'error',
    };
}

/**
 * Formats a BrainResponse for display in the UI
 */
export function formatBrainResponseForDisplay(response: BrainResponse): string {
    let output = response.answer;

    // Add citations
    if (response.citations && response.citations.length > 0) {
        output += '\n\n📄 **Sources:**';
        response.citations.forEach(citation => {
            output += `\n• ${citation.fileName}, Page ${citation.pageNumber}`;
            if (citation.snippet) {
                output += `\n  > "${citation.snippet}"`;
            }
        });
    }

    // Add missing topics for not_found responses
    if (response.status === 'not_found' && response.missingTopics && response.missingTopics.length > 0) {
        output += `\n\n⚠️ **Topics not found in sources:**\n${response.missingTopics.map(t => `• ${t}`).join('\n')}`;
    }

    return output;
}

/**
 * Gets the status icon for a response
 */
export function getStatusIcon(status: BrainResponse['status']): string {
    switch (status) {
        case 'success':
            return '✅';
        case 'not_found':
            return '🔍';
        case 'error':
            return '❌';
        default:
            return '⏳';
    }
}

/**
 * Gets a human-readable label for question type
 */
export function getQuestionTypeLabel(type: BrainResponse['questionType']): string {
    const labels: Record<BrainResponse['questionType'], string> = {
        multiple_choice: 'Multiple Choice',
        identification: 'Identification',
        true_false: 'True/False',
        long_answer: 'Long Answer',
        definition: 'Definition',
        comparison: 'Comparison',
        unknown: 'Question',
    };
    return labels[type] || 'Question';
}
