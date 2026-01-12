/**
 * ScanMind Brain API - Stateless AI Reasoning Engine
 * 
 * This is the core intelligence endpoint for ScanMind.
 * It processes questions against PDF context using Claude 4.5 Opus
 * with strict retrieval-only constraints (no general knowledge).
 * 
 * POST /api/brain
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import {
    BrainRequest,
    BrainResponse,
    BrainErrorResponse,
    ClaudeStructuredResponse,
    QuestionCategory,
} from '@/lib/brain-types';
import {
    STRICT_MODE_SYSTEM_PROMPT,
    formatContextForPrompt,
    buildUserPrompt,
    IMAGE_ANALYSIS_PROMPT,
} from '@/lib/brain-prompts';

// Initialize Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Model configuration
const MODEL_ID = 'claude-sonnet-4-20250514'; // Using Claude Sonnet as a performant option
const MAX_TOKENS = 4096;
const TEMPERATURE = 0.1; // Low temperature for factual retrieval

/**
 * Validates the incoming request payload
 */
function validateRequest(body: unknown): { valid: true; data: BrainRequest } | { valid: false; error: string } {
    if (!body || typeof body !== 'object') {
        return { valid: false, error: 'Request body must be a JSON object' };
    }

    const req = body as Record<string, unknown>;

    // Validate question
    if (!req.question || typeof req.question !== 'object') {
        return { valid: false, error: 'Missing or invalid "question" field' };
    }

    const question = req.question as Record<string, unknown>;
    if (!['text', 'image'].includes(question.type as string)) {
        return { valid: false, error: 'question.type must be "text" or "image"' };
    }

    if (typeof question.content !== 'string' || !question.content) {
        return { valid: false, error: 'question.content must be a non-empty string' };
    }

    // Validate context
    if (!Array.isArray(req.context) || req.context.length === 0) {
        return { valid: false, error: 'context must be a non-empty array' };
    }

    for (let i = 0; i < req.context.length; i++) {
        const ctx = req.context[i] as Record<string, unknown>;
        if (!ctx.fileName || typeof ctx.fileName !== 'string') {
            return { valid: false, error: `context[${i}].fileName is required` };
        }
        if (!ctx.pageContent || typeof ctx.pageContent !== 'string') {
            return { valid: false, error: `context[${i}].pageContent is required` };
        }
        if (typeof ctx.pageNumber !== 'number') {
            return { valid: false, error: `context[${i}].pageNumber must be a number` };
        }
    }

    // Validate sessionId
    if (!req.sessionId || typeof req.sessionId !== 'string') {
        return { valid: false, error: 'sessionId is required' };
    }

    return { valid: true, data: req as unknown as BrainRequest };
}

/**
 * Parses Claude's JSON response with error handling
 */
function parseClaudeResponse(text: string): ClaudeStructuredResponse | null {
    try {
        // Try to extract JSON from the response (in case there's extra text)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error('[Brain] No JSON found in response:', text);
            return null;
        }
        return JSON.parse(jsonMatch[0]) as ClaudeStructuredResponse;
    } catch (error) {
        console.error('[Brain] Failed to parse JSON response:', error);
        console.error('[Brain] Raw response:', text);
        return null;
    }
}

/**
 * Builds the message content for Claude, handling both text and image inputs
 */
function buildMessageContent(
    request: BrainRequest,
    formattedContext: string
): Anthropic.MessageParam['content'] {
    const isImage = request.question.type === 'image';

    if (isImage) {
        // For image questions, we need to include the image and text prompt
        const userPrompt = buildUserPrompt('', formattedContext, true);

        // Determine media type from mimeType or default to jpeg
        const mediaType = (request.question.mimeType || 'image/jpeg') as
            'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

        return [
            {
                type: 'image',
                source: {
                    type: 'base64',
                    media_type: mediaType,
                    data: request.question.content,
                },
            },
            {
                type: 'text',
                text: `${IMAGE_ANALYSIS_PROMPT}\n\n${userPrompt}`,
            },
        ];
    }

    // For text questions, just return the text prompt
    return buildUserPrompt(request.question.content, formattedContext, false);
}

/**
 * Maps Claude's response to our API response format
 */
function mapToResponse(
    parsed: ClaudeStructuredResponse,
    processingTimeMs: number
): BrainResponse {
    if (!parsed.answer_found) {
        return {
            status: 'no_match',
            answer: parsed.answer || 'Information not found in provided sources',
            sourceMetadata: null,
            reasoning: parsed.reasoning_steps?.join('\n') || 'No matching information found in sources.',
            questionType: parsed.question_type || 'unknown',
            confidence: parsed.confidence || 0,
            missingTopics: parsed.missing_topics || [],
            processingTimeMs,
        };
    }

    return {
        status: 'success',
        answer: buildFormattedAnswer(parsed),
        sourceMetadata: parsed.source_file ? {
            file: parsed.source_file,
            page: parsed.source_page || 0,
            relevantSnippet: parsed.relevant_snippet || undefined,
        } : null,
        reasoning: parsed.reasoning_steps?.join('\n') || '',
        questionType: parsed.question_type,
        confidence: parsed.confidence,
        processingTimeMs,
    };
}

/**
 * Builds a formatted answer including MC analysis if applicable
 */
function buildFormattedAnswer(parsed: ClaudeStructuredResponse): string {
    let answer = parsed.answer;

    // Add multiple choice analysis if present
    if (parsed.question_type === 'multiple_choice' && parsed.multiple_choice_analysis) {
        const mc = parsed.multiple_choice_analysis;
        answer += `\n\n**Correct Answer: ${mc.correct_option}**\n${mc.correct_justification}`;

        if (mc.incorrect_options && mc.incorrect_options.length > 0) {
            answer += '\n\n**Why other options are incorrect:**';
            mc.incorrect_options.forEach(opt => {
                answer += `\n- **${opt.option}:** ${opt.contradiction_reason}`;
            });
        }
    }

    return answer;
}

/**
 * Main POST handler for the Brain API
 */
export async function POST(request: NextRequest): Promise<NextResponse<BrainResponse | BrainErrorResponse>> {
    const startTime = Date.now();

    // Log incoming request (transient, no persistence)
    console.log(`[Brain] Request received at ${new Date().toISOString()}`);

    try {
        // Parse and validate request body
        const body = await request.json();
        const validation = validateRequest(body);

        if (!validation.valid) {
            return NextResponse.json(
                {
                    status: 'error' as const,
                    error: validation.error,
                    code: 'INVALID_INPUT' as const,
                },
                { status: 400 }
            );
        }

        const brainRequest = validation.data;
        console.log(`[Brain] Session ${brainRequest.sessionId}: Processing ${brainRequest.question.type} question with ${brainRequest.context.length} context sources`);

        // Format context for the prompt
        const formattedContext = formatContextForPrompt(brainRequest.context);

        // Build the message content
        const messageContent = buildMessageContent(brainRequest, formattedContext);

        // Call Claude API with extended thinking for deep reasoning
        const response = await anthropic.messages.create({
            model: MODEL_ID,
            max_tokens: MAX_TOKENS,
            temperature: TEMPERATURE,
            system: STRICT_MODE_SYSTEM_PROMPT,
            messages: [
                {
                    role: 'user',
                    content: messageContent,
                },
            ],
        });

        // Extract text response
        const textBlock = response.content.find(block => block.type === 'text');
        if (!textBlock || textBlock.type !== 'text') {
            console.error('[Brain] No text response from Claude');
            return NextResponse.json(
                {
                    status: 'error' as const,
                    error: 'No response generated',
                    code: 'MODEL_ERROR' as const,
                },
                { status: 500 }
            );
        }

        // Parse the structured response
        const parsed = parseClaudeResponse(textBlock.text);
        if (!parsed) {
            return NextResponse.json(
                {
                    status: 'error' as const,
                    error: 'Failed to parse AI response',
                    code: 'PROCESSING_FAILED' as const,
                    details: textBlock.text.substring(0, 500),
                },
                { status: 500 }
            );
        }

        // Build and return the response
        const processingTimeMs = Date.now() - startTime;
        const brainResponse = mapToResponse(parsed, processingTimeMs);

        console.log(`[Brain] Session ${brainRequest.sessionId}: Completed in ${processingTimeMs}ms with status ${brainResponse.status}`);

        return NextResponse.json(brainResponse);

    } catch (error) {
        const processingTimeMs = Date.now() - startTime;
        console.error(`[Brain] Error after ${processingTimeMs}ms:`, error);

        // Handle specific Anthropic errors
        if (error instanceof Anthropic.RateLimitError) {
            return NextResponse.json(
                {
                    status: 'error' as const,
                    error: 'Rate limit exceeded. Please try again later.',
                    code: 'RATE_LIMITED' as const,
                },
                { status: 429 }
            );
        }

        if (error instanceof Anthropic.APIError) {
            return NextResponse.json(
                {
                    status: 'error' as const,
                    error: 'AI service error',
                    code: 'MODEL_ERROR' as const,
                    details: error.message,
                },
                { status: 502 }
            );
        }

        // Generic error handler
        return NextResponse.json(
            {
                status: 'error' as const,
                error: 'Internal server error',
                code: 'PROCESSING_FAILED' as const,
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

/**
 * Handle unsupported methods
 */
export async function GET(): Promise<NextResponse> {
    return NextResponse.json(
        { error: 'Method not allowed. Use POST.' },
        { status: 405 }
    );
}
