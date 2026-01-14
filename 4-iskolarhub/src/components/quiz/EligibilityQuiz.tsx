'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import { StepAcademics, StepEducation, StepPath, StepFinancials, StepLocation, slideVariants, QuizData } from './QuizSteps';

interface EligibilityQuizProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function EligibilityQuiz({ isOpen, onClose }: EligibilityQuizProps) {
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(0);
    const [isCalculating, setIsCalculating] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const [formData, setFormData] = useState<QuizData>({
        gwa: '',
        educationType: '',
        strand: '',
        income: '',
        location: ''
    });

    const updateData = (field: keyof QuizData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const nextStep = () => {
        if (step < 5) {
            setDirection(1);
            setStep(prev => prev + 1);
        } else {
            handleFinish();
        }
    };

    const prevStep = () => {
        setDirection(-1);
        setStep(prev => prev - 1);
    };

    const handleFinish = () => {
        setIsCalculating(true);
        // Simulate calculation
        setTimeout(() => {
            setIsCalculating(false);
            setShowResult(true);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90dvh]"
            >
                {/* Header (Hidden on Result) */}
                {!showResult && !isCalculating && (
                    <div className="px-8 pt-8 pb-4 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Step {step} of 5</span>
                            <div className="flex gap-1 mt-1.5">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-gray-100'}`} />
                                ))}
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                )}

                {/* Content Area */}
                <div className="p-8 overflow-y-auto">
                    <AnimatePresence mode="wait" custom={direction}>
                        {isCalculating ? (
                            <motion.div
                                key="calculating"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-12 text-center"
                            >
                                <Loader2 size={48} className="text-primary animate-spin mb-4" />
                                <h3 className="text-xl font-bold text-gray-800">Analyzing your profile...</h3>
                                <p className="text-gray-500 mt-2">Matching with 50+ scholarship databases</p>
                            </motion.div>
                        ) : showResult ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-6"
                            >
                                <div className="size-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle size={40} />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Great News!</h2>
                                <p className="text-gray-600 mb-8">We found <span className="text-primary font-bold text-xl">12</span> scholarships that match your profile.</p>

                                <div className="bg-blue-50 p-4 rounded-xl text-left mb-8 border border-blue-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">YOUR PROFILE SUMMARY</p>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div><span className="text-gray-500">GWA:</span> <span className="font-semibold text-gray-800">{formData.gwa}</span></div>
                                        <div><span className="text-gray-500">Strand:</span> <span className="font-semibold text-gray-800">{formData.strand}</span></div>
                                        <div><span className="text-gray-500">Region:</span> <span className="font-semibold text-gray-800">{formData.location}</span></div>
                                    </div>
                                </div>

                                <button onClick={onClose} className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-blue-900 transition-all">
                                    View Matches
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={step}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                {step === 1 && <StepAcademics data={formData} updateData={updateData} onNext={nextStep} onBack={prevStep} />}
                                {step === 2 && <StepEducation data={formData} updateData={updateData} onNext={nextStep} onBack={prevStep} />}
                                {step === 3 && <StepPath data={formData} updateData={updateData} onNext={nextStep} onBack={prevStep} />}
                                {step === 4 && <StepFinancials data={formData} updateData={updateData} onNext={nextStep} onBack={prevStep} />}
                                {step === 5 && <StepLocation data={formData} updateData={updateData} onNext={nextStep} onBack={prevStep} />}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
