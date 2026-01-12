export interface PdfDocument {
  id: string;
  file: File;
  name: string;
  uploadedAt: number;
}

export type QuestionType = 'text' | 'image';

export interface FeedItem {
  id: string;
  type: QuestionType;
  timestamp: number;
  content: string; // Text query or Image URL
  answer?: {
    text: string;
    sourceFile?: string;
    pageNumber?: number;
    pdfId?: string;
    rawSnippet?: string; // For Learning Mode
  };
  status: 'loading' | 'success' | 'error' | 'not_found';
}
