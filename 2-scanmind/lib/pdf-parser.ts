/**
 * PDF Parser - Extracts text content from PDF files
 * Uses pdf.js for client-side PDF parsing
 * NOTE: This module must only be imported and used on the client side
 */

import type { PdfPage } from './types';

// Dynamically import pdfjs to avoid SSR issues
let pdfjsLib: typeof import('pdfjs-dist') | null = null;

async function getPdfJs() {
    if (pdfjsLib) return pdfjsLib;

    if (typeof window === 'undefined') {
        throw new Error('PDF parsing can only be done on the client side');
    }

    // Dynamic import to avoid SSR issues
    pdfjsLib = await import('pdfjs-dist');

    // Configure worker - using legacy build for better compatibility
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

    return pdfjsLib;
}

/**
 * Extract text content from a PDF file
 * @param file - The PDF file to parse
 * @returns Array of pages with their text content
 */
export async function extractPdfText(file: File): Promise<PdfPage[]> {
    const pages: PdfPage[] = [];

    try {
        const pdfjs = await getPdfJs();

        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Load PDF document
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

        // Extract text from each page
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();

            // Combine text items into a single string
            const pageText = textContent.items
                .map((item) => {
                    if ('str' in item) {
                        return item.str;
                    }
                    return '';
                })
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();

            pages.push({
                pageNumber: pageNum,
                content: pageText,
            });
        }

        return pages;
    } catch (error) {
        console.error('Error parsing PDF:', error);
        throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Get total character count of all pages
 */
export function getTotalTextLength(pages: PdfPage[]): number {
    return pages.reduce((total, page) => total + page.content.length, 0);
}

/**
 * Format pages for display (preview)
 */
export function getPreviewText(pages: PdfPage[], maxLength: number = 500): string {
    const allText = pages.map(p => p.content).join(' ');
    if (allText.length <= maxLength) return allText;
    return allText.substring(0, maxLength) + '...';
}
