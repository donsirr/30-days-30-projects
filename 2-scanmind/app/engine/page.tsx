'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { v4 as uuidv4 } from 'uuid'; // Removed in favor of native crypto 
// Wait, I created the app, I didn't install uuid. I should verify if I can install it or use Math.random.
// To be safe and dependency-free for this single file, I'll use crypto.randomUUID() or Math.random().

import { Header } from '@/components/Header';
import { InputZone } from '@/components/InputZone';
import { FloatingInput } from '@/components/FloatingInput';
import { PdfSidebar } from '@/components/PdfSidebar';
import { Feed } from '@/components/Feed';
import { PdfDocument, FeedItem } from '@/lib/types';

// Mock Answer Generator
const MOCK_ANSWERS = [
  {
    text: "The concept of 'statelessness' in this architecture refers to the absence of persistent data storage on the server. Every session begins with a clean slate, ensuring privacy and reducing infrastructure complexity.",
    sourceFile: "Architecture_Specs_v1.pdf",
    pageNumber: 4,
    rawSnippet: "SECTION 4.2 STATELESSNESS:\nThe system shall not retain user data between sessions. All session data resides in volatile memory..."
  },
  {
    text: "According to the study material, the 'Velocity' principle prioritizes keyboard shortcuts and drag-and-drop interactions to minimize user friction during high-intensity study sessions.",
    sourceFile: "UX_Guidelines_2024.pdf",
    pageNumber: 12,
    rawSnippet: "PRINCIPLE 2: VELOCITY\nUsers should achieve goals with minimal clicks. Support Global Paste (Ctrl+V) and strict drag-and-drop zones."
  },
  {
    text: "The interaction model uses a 'smart answer' card that collapses technical details by default, offering a 'Learning Mode' for users who need to verify the source material deep-dive.",
    sourceFile: "Frontend_Components.pdf",
    pageNumber: 8,
    rawSnippet: "COMPONENT 3.1: SMART CARD\nDefault view: High-level summary.\nExpanded view (Toggle): Raw text extract + confidence score."
  }
];

export default function Home() {
  const [pdfs, setPdfs] = useState<PdfDocument[]>([]);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [showFloatingInput, setShowFloatingInput] = useState(false);
  const inputZoneRef = useRef<HTMLDivElement>(null);

  // -- Handlers --

  const handleDemoLoad = () => {
    // Load fake PDFs
    const demoPdfs: PdfDocument[] = [
      { id: 'demo1', name: 'Architecture_Specs_v1.pdf', uploadedAt: Date.now(), file: new File([], 'demo1') },
      { id: 'demo2', name: 'UX_Guidelines_2024.pdf', uploadedAt: Date.now(), file: new File([], 'demo2') },
    ];
    setPdfs(demoPdfs);

    // Load fake Feed Items
    const demoFeed: FeedItem[] = [
      {
        id: 'demo_q1',
        type: 'text',
        timestamp: Date.now(),
        content: "What is the core principle of statelessness?",
        status: 'success',
        answer: {
          text: "The system uses volatile memory effectively to ensure no session data persists after refresh, enhancing security and privacy.",
          sourceFile: "Architecture_Specs_v1.pdf",
          pageNumber: 4,
          rawSnippet: "SECTION 4.2 STATELESSNESS: The system shall not retain user data between sessions."
        }
      },
      {
        id: 'demo_q2',
        type: 'text',
        timestamp: Date.now() - 5000,
        content: "Explain the velocity constraints.",
        status: 'success',
        answer: {
          text: "Velocity is prioritized by minimizing clicks and enabling global paste shortcuts.",
          sourceFile: "UX_Guidelines_2024.pdf",
          pageNumber: 12
        }
      }
    ];
    setFeed(demoFeed);
  };

  const handleClearSession = () => {
    if (confirm('Are you sure you want to clear the entire session?')) {
      setPdfs([]);
      setFeed([]);
    }
  };

  const handleRemovePdf = (id: string) => {
    setPdfs(prev => prev.filter(p => p.id !== id));
  };

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

    // Simulate Network Latency
    setTimeout(() => {
      setFeed(currentFeed => {
        return currentFeed.map(item => {
          if (item.id === id) {
            // Logic: If no PDFs, fail.
            if (pdfs.length === 0) {
              return { ...item, status: 'error' }; // or 'not_found'
            }

            // Randomly succeed or fail for demo
            const shouldSucceed = Math.random() > 0.2;
            if (shouldSucceed) {
              const mock = MOCK_ANSWERS[Math.floor(Math.random() * MOCK_ANSWERS.length)];
              // Inject one of the active PDF names as source if possible
              const randomPdf = pdfs[Math.floor(Math.random() * pdfs.length)];

              return {
                ...item,
                status: 'success',
                answer: {
                  ...mock,
                  sourceFile: randomPdf.name, // Override mock name with real active PDF name
                  pdfId: randomPdf.id
                }
              };
            } else {
              return { ...item, status: 'not_found' };
            }
          }
          return item;
        });
      });
      setProcessing(false);
    }, 2000);
  }, [pdfs]);

  const handleFileDrop = (files: File[]) => {
    const newPdfs: PdfDocument[] = [];

    files.forEach(file => {
      // Check if it's a PDF
      if (file.type === 'application/pdf') {
        const id = crypto.randomUUID();
        newPdfs.push({
          id,
          file,
          name: file.name,
          uploadedAt: Date.now()
        });
      } else if (file.type.startsWith('image/')) {
        // If it's an image dropped, treat as a Query
        const url = URL.createObjectURL(file);
        processQuery(url, 'image');
      }
    });

    if (newPdfs.length > 0) {
      setPdfs(prev => [...prev, ...newPdfs]);
    }
  };

  const handlePaste = useCallback((e: ClipboardEvent) => {
    // 1. Handle Files (Images)
    if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
      const files = Array.from(e.clipboardData.files);
      // Filter for images
      const imageFile = files.find(f => f.type.startsWith('image/'));
      if (imageFile) {
        e.preventDefault();
        const url = URL.createObjectURL(imageFile);
        processQuery(url, 'image');
      }
      return;
    }

    // 2. Handle Text (only if not focused on an input)
    // Note: We normally let default paste happen in input, 
    // but if we are on body, maybe capture it?
    // User Guide: "Global Listener ... for images". Text input handles its own paste.
    // So we assume specific logic only for images here, unless directed otherwise.
  }, [processQuery]);

  // Global Event Listener
  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

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
        onDemoLoad={handleDemoLoad}
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
