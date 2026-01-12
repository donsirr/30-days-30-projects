'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/Header';
import { InputZone } from '@/components/InputZone';
import { FloatingInput } from '@/components/FloatingInput';
import { PdfSidebar } from '@/components/PdfSidebar';
import { Feed } from '@/components/Feed';
import { PdfDocument, FeedItem } from '@/lib/types';
import { extractPdfText } from '@/lib/pdf-parser';
import {
  askTextQuestion,
  createImageQuestionFromBase64,
  askBrain
} from '@/lib/brain-client';
import { PdfContextSource } from '@/lib/brain-types';

export default function EnginePage() {
  const [pdfs, setPdfs] = useState<PdfDocument[]>([]);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [showFloatingInput, setShowFloatingInput] = useState(false);
  const inputZoneRef = useRef<HTMLDivElement>(null);

  // Build PDF context for the Brain API from all loaded PDFs
  const buildPdfContext = useCallback((): PdfContextSource[] => {
    const context: PdfContextSource[] = [];

    pdfs.forEach(pdf => {
      if (pdf.pages && pdf.pages.length > 0) {
        pdf.pages.forEach(page => {
          if (page.content.trim()) {
            context.push({
              fileName: pdf.name,
              pageNumber: page.pageNumber,
              content: page.content,
            });
          }
        });
      }
    });

    return context;
  }, [pdfs]);

  // Process a query using the Brain API
  const processQuery = useCallback(async (query: string, type: 'text' | 'image') => {
    const id = crypto.randomUUID();
    const newItem: FeedItem = {
      id,
      type,
      timestamp: Date.now(),
      content: query,
      status: 'loading'
    };

    // Prepend to feed (Newest first)
    setFeed(prev => [newItem, ...prev]);
    setProcessing(true);

    try {
      // Build the PDF context
      const pdfContext = buildPdfContext();

      // Check if we have any context
      if (pdfContext.length === 0) {
        setFeed(currentFeed =>
          currentFeed.map(item =>
            item.id === id
              ? {
                ...item,
                status: 'error' as const,
                answer: {
                  text: 'Please upload at least one PDF document first. Drag and drop PDFs or use the file browser to add your study materials.'
                }
              }
              : item
          )
        );
        setProcessing(false);
        return;
      }

      // Call the Brain API
      let result;

      if (type === 'image') {
        // For image queries, we need to extract base64 from the blob URL
        const response = await fetch(query);
        const blob = await response.blob();
        const base64 = await blobToBase64(blob);
        const questionInput = createImageQuestionFromBase64(base64, blob.type);
        result = await askBrain(questionInput, pdfContext);
      } else {
        result = await askTextQuestion(query, pdfContext);
      }

      // Update the feed item with the result
      setFeed(currentFeed =>
        currentFeed.map(item => {
          if (item.id === id) {
            if (result.success) {
              const data = result.data;
              return {
                ...item,
                status: data.status === 'not_found' ? 'not_found' as const : 'success' as const,
                processingTimeMs: data.processingTimeMs,
                answer: {
                  text: data.answer,
                  citations: data.citations,
                  reasoning: data.reasoning,
                  questionType: data.questionType,
                  confidence: data.confidence,
                  missingTopics: data.missingTopics,
                  // Legacy fields for backward compatibility with Feed component
                  sourceFile: data.citations?.[0]?.fileName,
                  pageNumber: data.citations?.[0]?.pageNumber,
                  rawSnippet: data.citations?.[0]?.snippet,
                }
              };
            } else {
              return {
                ...item,
                status: 'error' as const,
                answer: {
                  text: result.error.error || 'An error occurred while processing your question.'
                }
              };
            }
          }
          return item;
        })
      );
    } catch (error) {
      console.error('Error processing query:', error);
      setFeed(currentFeed =>
        currentFeed.map(item =>
          item.id === id
            ? {
              ...item,
              status: 'error' as const,
              answer: {
                text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
              }
            }
            : item
        )
      );
    } finally {
      setProcessing(false);
    }
  }, [buildPdfContext]);

  // Helper to convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Handle file drops (PDFs and images)
  const handleFileDrop = useCallback(async (files: File[]) => {
    const newPdfs: PdfDocument[] = [];

    for (const file of files) {
      // Check if it's a PDF
      if (file.type === 'application/pdf') {
        const id = crypto.randomUUID();
        const newPdf: PdfDocument = {
          id,
          file,
          name: file.name,
          uploadedAt: Date.now(),
          isProcessing: true,
        };

        // Add to state immediately (with processing state)
        setPdfs(prev => [...prev, newPdf]);

        // Parse PDF in background
        try {
          const pages = await extractPdfText(file);
          setPdfs(prev =>
            prev.map(p =>
              p.id === id
                ? { ...p, pages, isProcessing: false }
                : p
            )
          );
        } catch (error) {
          console.error('Error parsing PDF:', error);
          setPdfs(prev =>
            prev.map(p =>
              p.id === id
                ? { ...p, isProcessing: false, error: 'Failed to parse PDF' }
                : p
            )
          );
        }
      } else if (file.type.startsWith('image/')) {
        // If it's an image dropped, treat as a Query
        const url = URL.createObjectURL(file);
        processQuery(url, 'image');
      }
    }
  }, [processQuery]);

  // Handle paste events
  const handlePaste = useCallback((e: ClipboardEvent) => {
    if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
      const files = Array.from(e.clipboardData.files);
      const imageFile = files.find(f => f.type.startsWith('image/'));
      if (imageFile) {
        e.preventDefault();
        const url = URL.createObjectURL(imageFile);
        processQuery(url, 'image');
      }
    }
  }, [processQuery]);

  // Clear session
  const handleClearSession = () => {
    if (confirm('Are you sure you want to clear the entire session?')) {
      setPdfs([]);
      setFeed([]);
    }
  };

  // Remove a specific PDF
  const handleRemovePdf = (id: string) => {
    setPdfs(prev => prev.filter(p => p.id !== id));
  };

  // Global paste listener
  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  // Floating input visibility based on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isAbove = entry.boundingClientRect.top < 0;
        setShowFloatingInput(!entry.isIntersecting && isAbove);
      },
      { threshold: 0 }
    );

    if (inputZoneRef.current) {
      observer.observe(inputZoneRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header
        pdfs={pdfs}
        onClearSession={handleClearSession}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto flex gap-6 px-4 relative">
        {/* Left Content (Feed + Input) */}
        <div className="flex-1 flex flex-col relative max-w-4xl min-w-0">
          {/* Main Input Section */}
          <div ref={inputZoneRef} className="pt-6 pb-2 transition-all">
            <InputZone
              onFileDrop={handleFileDrop}
              onTextSubmit={(text) => processQuery(text, 'text')}
              isProcessing={processing}
              hasPdfs={pdfs.some(p => p.pages && p.pages.length > 0)}
            />
          </div>

          {/* Scrollable Feed */}
          <div className="flex-1 relative">
            <Feed items={feed} />
          </div>
        </div>

        {/* Right Sidebar (PDF List) - Desktop Only */}
        <aside className="hidden lg:block w-72 shrink-0 pt-6">
          <PdfSidebar pdfs={pdfs} onRemovePdf={handleRemovePdf} />
        </aside>
      </main>

      <FloatingInput
        onFileDrop={handleFileDrop}
        onTextSubmit={(text) => processQuery(text, 'text')}
        isProcessing={processing}
        isVisible={showFloatingInput}
      />
    </div>
  );
}
