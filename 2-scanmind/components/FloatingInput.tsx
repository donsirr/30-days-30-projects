import React, { useState, useRef, ChangeEvent } from 'react';
import { Send, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingInputProps {
    onFileDrop: (files: File[]) => void;
    onTextSubmit: (text: string) => void;
    isProcessing: boolean;
    isVisible: boolean;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({ onFileDrop, onTextSubmit, isProcessing, isVisible }) => {
    const [textInput, setTextInput] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileDrop(Array.from(e.target.files));
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleTextSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (textInput.trim()) {
            onTextSubmit(textInput);
            setTextInput('');
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="fixed bottom-6 left-0 right-0 px-4 z-50 flex justify-center pointer-events-none"
                >
                    <div className="w-full max-w-3xl bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-2xl rounded-2xl p-2 pointer-events-auto">
                        <form onSubmit={handleTextSubmit} className="flex items-center gap-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                className="hidden"
                                accept="image/*" // Focus on images for floating context usually
                            />

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                                title="Upload Image"
                            >
                                <ImageIcon size={20} />
                            </button>

                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    placeholder="Ask a question..."
                                    className="w-full pl-3 pr-12 py-2.5 bg-transparent focus:outline-none text-slate-700 placeholder:text-slate-400 font-medium"
                                    disabled={isProcessing}
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!textInput.trim() || isProcessing}
                                className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
