/**
 * Token counting utilities using GPT-4o encoding (o200k_base)
 */

import { encode } from 'gpt-tokenizer/model/gpt-4o';

/**
 * Count tokens using GPT-4o encoding (o200k_base)
 */
export function countTokens(text: string): number {
    if (!text) return 0;
    try {
        const tokens = encode(text);
        return tokens.length;
    } catch (error) {
        console.error('Token counting error:', error);
        // Fallback to rough estimate
        return Math.ceil(text.length / 4);
    }
}

/**
 * Format token count for display
 */
export function formatTokenCount(count: number): string {
    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toLocaleString();
}

/**
 * Get token limit warning level
 * Returns: 'safe' | 'warning' | 'danger'
 */
export function getTokenWarningLevel(count: number): 'safe' | 'warning' | 'danger' {
    if (count > 100000) return 'danger';
    if (count > 50000) return 'warning';
    return 'safe';
}

/**
 * Debounce helper for token counting
 * Fixed type signature to work with any function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, wait);
    };
}

/**
 * Default system prompt for AI context
 */
export const DEFAULT_SYSTEM_PROMPT = `You are a Senior Full-Stack Engineer acting as a collaborative pair programmer. I am sharing a codebase snapshot with you.

Your role:
1. Analyze the code structure, patterns, and architecture
2. Identify best practices and potential improvements
3. Answer questions about implementation details
4. Help debug issues when asked
5. Suggest refactoring opportunities

Wait for my specific instructions before taking action.`;

/**
 * Generate the AI Blueprint header
 */
export function generateAIHeader(customPrompt?: string): string {
    const prompt = customPrompt || DEFAULT_SYSTEM_PROMPT;
    return `--- AI SYSTEM PROMPT ---
${prompt}
--- PROJECT STRUCTURE ---
`;
}
