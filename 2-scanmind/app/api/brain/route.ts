/**
 * ScanMind Brain API - Stateless AI Reasoning Engine (Gemini 1.5 Flash)
 * 
 * Leverages Gemini's 1M token context window for the "Combined Mind" approach.
 * Processes questions (text or image) against concatenated PDF context.
 * 
 * POST /api/brain
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import {
    BrainRequest,
    BrainResponse,
    BrainErrorResponse,
    GeminiParsedResponse,
    QuestionCategory,
    SourceCitation,
} from '@/lib/brain-types';
import {
    STRICT_MODE_SYSTEM_INSTRUCTION,
    formatPdfContext,
    buildUserPrompt,
} from '@/lib/brain-prompts';

// Model configuration
const MODEL_ID = 'gemini-2.5-flash';

// Safety settings - allow educational content
const SAFETY_SETTINGS = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
];

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

    // For image type, validate mimeType
    if (question.type === 'image' && !question.mimeType) {
        return { valid: false, error: 'question.mimeType is required for image questions' };
    }

    // Validate pdfContext
    if (!Array.isArray(req.pdfContext) || req.pdfContext.length === 0) {
        return { valid: false, error: 'pdfContext must be a non-empty array' };
    }

    for (let i = 0; i < req.pdfContext.length; i++) {
        const ctx = req.pdfContext[i] as Record<string, unknown>;
        if (!ctx.fileName || typeof ctx.fileName !== 'string') {
            return { valid: false, error: `pdfContext[${i}].fileName is required` };
        }
        if (!ctx.content || typeof ctx.content !== 'string') {
            return { valid: false, error: `pdfContext[${i}].content is required` };
        }
        if (typeof ctx.pageNumber !== 'number') {
            return { valid: false, error: `pdfContext[${i}].pageNumber must be a number` };
        }
    }

    return { valid: true, data: req as unknown as BrainRequest };
}

/**
 * Parses Gemini's JSON response with error handling
 */
function parseGeminiResponse(text: string): GeminiParsedResponse | null {
    try {
        // Clean the response - remove any markdown code blocks if present
        let cleanText = text.trim();

        // Remove ```json ... ``` wrapper if present
        if (cleanText.startsWith('```')) {
            const endIndex = cleanText.lastIndexOf('```');
            if (endIndex > 3) {
                cleanText = cleanText.substring(cleanText.indexOf('\n') + 1, endIndex).trim();
            }
        }

        // Try to extract JSON from the response
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error('[Brain] No JSON found in response:', text);
            return null;
        }

        return JSON.parse(jsonMatch[0]) as GeminiParsedResponse;
    } catch (error) {
        console.error('[Brain] Failed to parse JSON response:', error);
        console.error('[Brain] Raw response:', text);
        return null;
    }
}

/**
 * Maps Gemini's response to our API response format
 */
function mapToResponse(
    parsed: GeminiParsedResponse,
    processingTimeMs: number
): BrainResponse {
    // Map citations
    const citations: SourceCitation[] = (parsed.citations || []).map(c => ({
        fileName: c.file,
        pageNumber: c.page,
        snippet: c.snippet,
    }));

    // Map question type
    const questionType = (parsed.question_type || 'unknown') as QuestionCategory;

    if (!parsed.found) {
        return {
            status: 'not_found',
            answer: parsed.answer || 'Information not found in provided sources.',
            citations: [],
            reasoning: parsed.reasoning,
            questionType,
            confidence: parsed.confidence || 0,
            missingTopics: parsed.missing_topics || [],
            processingTimeMs,
        };
    }

    // Build formatted answer for multiple choice
    let formattedAnswer = parsed.answer;
    if (questionType === 'multiple_choice' && parsed.multiple_choice_analysis) {
        const mc = parsed.multiple_choice_analysis;
        formattedAnswer += `\n\n**Correct Answer: ${mc.correct_option}**\n${mc.correct_justification}`;

        if (mc.incorrect_options && mc.incorrect_options.length > 0) {
            formattedAnswer += '\n\n**Why other options are incorrect:**';
            mc.incorrect_options.forEach(opt => {
                formattedAnswer += `\n• **${opt.option}:** ${opt.reason}`;
            });
        }
    }

    return {
        status: 'success',
        answer: formattedAnswer,
        citations,
        reasoning: parsed.reasoning,
        questionType,
        confidence: parsed.confidence,
        processingTimeMs,
    };
}

/**
 * Main POST handler for the Brain API
 */
export async function POST(request: NextRequest): Promise<NextResponse<BrainResponse | BrainErrorResponse>> {
    const startTime = Date.now();

    // Check for API key
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('[Brain] Missing GOOGLE_GEMINI_API_KEY environment variable');
        return NextResponse.json(
            {
                status: 'error' as const,
                error: 'API key not configured',
                code: 'API_KEY_MISSING' as const,
                details: 'Please set GOOGLE_GEMINI_API_KEY in environment variables',
            },
            { status: 500 }
        );
    }

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
        const sessionId = brainRequest.sessionId || 'anonymous';
        console.log(`[Brain] Session ${sessionId}: Processing ${brainRequest.question.type} question with ${brainRequest.pdfContext.length} context sources`);

        // Initialize Gemini client with system instruction
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: MODEL_ID,
            systemInstruction: STRICT_MODE_SYSTEM_INSTRUCTION,
            safetySettings: SAFETY_SETTINGS,
            generationConfig: {
                temperature: 0.1, // Low temperature for factual retrieval
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 4096,
            },
        });

        // Format the PDF context for the Combined Mind
        const formattedContext = formatPdfContext(brainRequest.pdfContext);

        // Build the content parts based on question type
        const isImage = brainRequest.question.type === 'image';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let contentParts: any[];

        if (isImage) {
            // For image questions, use inlineData format
            const userPrompt = buildUserPrompt('', formattedContext, true);
            contentParts = [
                {
                    inlineData: {
                        mimeType: brainRequest.question.mimeType || 'image/jpeg',
                        data: brainRequest.question.content, // Base64 data without prefix
                    },
                },
                { text: userPrompt },
            ];
        } else {
            // For text questions
            const userPrompt = buildUserPrompt(brainRequest.question.content, formattedContext, false);
            contentParts = [{ text: userPrompt }];
        }

        // Generate response from Gemini
        const result = await model.generateContent(contentParts);
        const response = result.response;
        const responseText = response.text();

        // Check for blocked content
        if (!responseText) {
            const blockReason = response.promptFeedback?.blockReason;
            console.error('[Brain] Empty response from Gemini, block reason:', blockReason);
            return NextResponse.json(
                {
                    status: 'error' as const,
                    error: 'Content blocked by safety filters',
                    code: 'MODEL_ERROR' as const,
                    details: blockReason || 'Unknown reason',
                },
                { status: 400 }
            );
        }

        // Parse the structured response
        const parsed = parseGeminiResponse(responseText);
        if (!parsed) {
            return NextResponse.json(
                {
                    status: 'error' as const,
                    error: 'Failed to parse AI response',
                    code: 'PROCESSING_FAILED' as const,
                    details: responseText.substring(0, 500),
                },
                { status: 500 }
            );
        }

        // Build and return the response
        const processingTimeMs = Date.now() - startTime;
        const brainResponse = mapToResponse(parsed, processingTimeMs);

        console.log(`[Brain] Session ${sessionId}: Completed in ${processingTimeMs}ms with status ${brainResponse.status}`);

        return NextResponse.json(brainResponse);

    } catch (error) {
        const processingTimeMs = Date.now() - startTime;
        console.error(`[Brain] Error after ${processingTimeMs}ms:`, error);

        // Handle specific error types
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        // Check for rate limiting
        if (errorMessage.includes('429') || errorMessage.toLowerCase().includes('rate limit')) {
            return NextResponse.json(
                {
                    status: 'error' as const,
                    error: 'Rate limit exceeded. Please try again later.',
                    code: 'RATE_LIMITED' as const,
                },
                { status: 429 }
            );
        }

        // Check for API errors
        if (errorMessage.includes('API') || errorMessage.includes('key')) {
            return NextResponse.json(
                {
                    status: 'error' as const,
                    error: 'AI service error',
                    code: 'MODEL_ERROR' as const,
                    details: errorMessage,
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
                details: errorMessage,
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
        {
            name: 'ScanMind Brain API',
            version: '1.0.0',
            model: MODEL_ID,
            endpoints: {
                POST: 'Submit a question with PDF context for AI-powered answering'
            }
        },
        { status: 200 }
    );
}
