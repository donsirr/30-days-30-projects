/**
 * Brain API Client - Frontend utility for calling the ScanMind Brain API
 */

import {
    BrainRequest,
    BrainResponse,
    BrainErrorResponse,
    ContextSource,
    QuestionInput,
} from './brain-types';

/**
 * Generates a unique session ID for request tracking
 */
export function generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Converts a File object to base64 string (for image questions)
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
        mimeType: file.type,
    };
}

/**
 * Creates an image question input from a base64 string
 */
export function createImageQuestionFromBase64(
    base64: string,
    mimeType: string = 'image/jpeg'
): QuestionInput {
    return {
        type: 'image',
        content: base64,
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
 * Calls the Brain API with the given question and context
 * 
 * @param question - The question to ask (text or image)
 * @param context - Array of PDF context sources
 * @param sessionId - Optional session ID for tracking
 * @returns The brain response or error
 */
export async function askBrain(
    question: QuestionInput,
    context: ContextSource[],
    sessionId?: string
): Promise<BrainResult> {
    const request: BrainRequest = {
        question,
        context,
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

        if (!response.ok) {
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
    context: ContextSource[],
    sessionId?: string
): Promise<BrainResult> {
    return askBrain(createTextQuestion(text), context, sessionId);
}

/**
 * Convenience function for asking an image question
 */
export async function askImageQuestion(
    imageFile: File,
    context: ContextSource[],
    sessionId?: string
): Promise<BrainResult> {
    const questionInput = await createImageQuestion(imageFile);
    return askBrain(questionInput, context, sessionId);
}

/**
 * Formats a BrainResponse for display
 */
export function formatBrainResponseForDisplay(response: BrainResponse): string {
    let output = response.answer;

    if (response.sourceMetadata) {
        output += `\n\n📄 Source: ${response.sourceMetadata.file}, Page ${response.sourceMetadata.page}`;

        if (response.sourceMetadata.relevantSnippet) {
            output += `\n\n> "${response.sourceMetadata.relevantSnippet}"`;
        }
    }

    if (response.status === 'no_match' && response.missingTopics && response.missingTopics.length > 0) {
        output += `\n\n⚠️ Missing topics: ${response.missingTopics.join(', ')}`;
    }

    return output;
}
