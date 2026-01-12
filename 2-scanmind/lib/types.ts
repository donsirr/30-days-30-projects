export interface PdfPage {
  pageNumber: number;
  content: string;
}

export interface PdfDocument {
  id: string;
  file: File;
  name: string;
  uploadedAt: number;
  pages?: PdfPage[]; // Parsed text content per page
  isProcessing?: boolean;
  error?: string;
}

export type QuestionType = 'text' | 'image';

export interface SourceCitation {
  fileName: string;
  pageNumber: number;
  snippet?: string;
}

export interface FeedItem {
  id: string;
  type: QuestionType;
  timestamp: number;
  content: string; // Text query or Image URL
  answer?: {
    text: string;
    citations?: SourceCitation[];
    reasoning?: string;
    questionType?: string;
    confidence?: number;
    missingTopics?: string[];
    // Legacy fields for backward compatibility
    sourceFile?: string;
    pageNumber?: number;
    pdfId?: string;
    rawSnippet?: string;
  };
  status: 'loading' | 'success' | 'error' | 'not_found';
  processingTimeMs?: number;
}
