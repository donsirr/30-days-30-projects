import React, { useState, useRef, ChangeEvent } from 'react';
import { UploadCloud, Image as ImageIcon, Send, Camera, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface InputZoneProps {
    onFileDrop: (files: File[]) => void;
    onTextSubmit: (text: string) => void;
    isProcessing: boolean;
    hasPdfs?: boolean;
}

export const InputZone: React.FC<InputZoneProps> = ({ onFileDrop, onTextSubmit, isProcessing, hasPdfs = false }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [textInput, setTextInput] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileDrop(Array.from(e.dataTransfer.files));
        }
    };

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileDrop(Array.from(e.target.files));
        }
        // Reset value so same file can be selected again if needed
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (cameraInputRef.current) cameraInputRef.current.value = '';
    };

    const handleTextSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (textInput.trim()) {
            onTextSubmit(textInput);
            setTextInput('');
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            {/* Hidden Inputs */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                multiple
                accept=".pdf,image/png,image/jpeg,image/webp"
            />
            <input
                type="file"
                ref={cameraInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*"
                capture="environment"
            />

            <div className="flex flex-col gap-4">
                {/* Drop Zone */}
                <motion.div
                    layout
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    animate={{
                        scale: isDragOver ? 1.02 : 1,
                        borderColor: isDragOver ? '#4f46e5' : '#cbd5e1',
                        backgroundColor: isDragOver ? '#eef2ff' : '#ffffff',
                    }}
                    className="relative group cursor-pointer border-2 border-dashed border-slate-300 rounded-2xl h-32 flex flex-col items-center justify-center transition-colors shadow-sm hover:border-indigo-400 hover:bg-slate-50"
                >
                    <div className="flex flex-col items-center gap-4 text-slate-500 group-hover:text-indigo-600 transition-colors z-10">
                        <div className="flex items-center gap-2">
                            <UploadCloud size={32} />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="font-medium text-sm text-slate-700">
                                <span className="hidden sm:inline">Drop PDFs or Paste Images (Ctrl+V)</span>
                                <span className="sm:hidden">Tap to upload PDF/Image</span>
                            </p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}
                                className="px-4 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 shadow-sm transition-colors"
                            >
                                Browse Files
                            </button>
                        </div>
                    </div>

                    {/* Mobile Camera Button Trigger */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            cameraInputRef.current?.click();
                        }}
                        className="absolute right-4 bottom-4 sm:hidden p-2 bg-indigo-600 text-white rounded-full shadow-lg z-20"
                    >
                        <Camera size={20} />
                    </button>
                </motion.div>

                {/* Text Input Row */}
                <form onSubmit={handleTextSubmit} className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder={hasPdfs ? "Ask a question about your documents..." : "Upload PDFs first, then ask questions..."}
                            className={`w-full pl-4 pr-24 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm text-slate-700 placeholder:text-slate-400 ${!hasPdfs ? 'border-amber-200 bg-amber-50/50' : 'border-slate-200'}`}
                            disabled={isProcessing}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-300 pointer-events-none hidden sm:block font-medium">
                            {hasPdfs ? 'Press Enter' : 'Add PDFs ↑'}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!textInput.trim() || isProcessing}
                        className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};
