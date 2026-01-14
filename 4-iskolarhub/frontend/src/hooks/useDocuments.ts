import { useState, useEffect } from 'react';

export type DocStatus = 'empty' | 'uploading' | 'uploaded';

export interface Document {
    id: string;
    label: string;
    description: string;
    status: DocStatus;
    progress: number; // 0-100
    fileName?: string;
    verified?: boolean;
}

const INITIAL_DOCS: Document[] = [
    { id: 'psa', label: 'PSA Birth Certificate', description: 'Original copy from PSA Serbilis', status: 'empty', progress: 0 },
    { id: 'form138', label: 'Form 138 (Report Card)', description: 'Certified True Copy', status: 'empty', progress: 0 },
    { id: 'itr', label: 'BIR ITR / Exemption', description: 'Proof of Parent/Guardian Income', status: 'empty', progress: 0 },
    { id: 'good_moral', label: 'Certificate of Good Moral', description: 'Issued by your SHS Principal', status: 'empty', progress: 0 },
];

export function useDocuments() {
    const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCS);
    const [isLoaded, setIsLoaded] = useState(false);

    // 1. Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('iskolar_documents');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Merge saved status with initial structure to ensure data integrity
                const merged = INITIAL_DOCS.map(initDoc => {
                    const found = parsed.find((p: Document) => p.id === initDoc.id);
                    return found ? { ...initDoc, ...found } : initDoc;
                });
                setTimeout(() => setDocuments(merged), 0);
            } catch (e) {
                console.error("Failed to parse documents from storage", e);
            }
        }
        setTimeout(() => setIsLoaded(true), 0);
    }, []);

    // 2. Save to localStorage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('iskolar_documents', JSON.stringify(documents));
        }
    }, [documents, isLoaded]);

    const uploadDocument = (id: string, file: File) => {
        // Set to uploading
        setDocuments(prev => prev.map(d =>
            d.id === id ? { ...d, status: 'uploading', progress: 0 } : d
        ));

        // Simulate progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 15) + 5; // Random increment
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                // Finalize upload
                completeUpload(id, file.name);
            } else {
                setDocuments(prev => prev.map(d =>
                    d.id === id ? { ...d, progress } : d
                ));
            }
        }, 200);
    };

    const completeUpload = (id: string, fileName: string) => {
        setDocuments(prev => prev.map(d =>
            d.id === id ? { ...d, status: 'uploaded', progress: 100, fileName, verified: true } : d
        ));
    };

    const deleteDocument = (id: string) => {
        setDocuments(prev => prev.map(d =>
            d.id === id ? { ...d, status: 'empty', progress: 0, fileName: undefined, verified: undefined } : d
        ));
    };

    // Derived State
    const readyCount = documents.filter(d => d.status === 'uploaded').length;
    const readinessScore = Math.round((readyCount / documents.length) * 100);

    return {
        documents,
        uploadDocument,
        deleteDocument,
        readyCount,
        readinessScore,
        isLoaded
    };
}
