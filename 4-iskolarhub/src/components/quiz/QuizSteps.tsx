import React from 'react';
import { BookOpen, School, GraduationCap, Banknote, MapPin } from 'lucide-react';
import clsx from 'clsx';

export interface QuizData {
    gwa: string;
    educationType: string;
    strand: string;
    income: string;
    location: string;
}

// Shared Props Interface
export interface StepProps {
    data: QuizData;
    updateData: (field: keyof QuizData, value: string) => void;
    onNext: () => void;
    onBack: () => void;
}

// Animation Variants
export const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 50 : -50,
        opacity: 0
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 50 : -50,
        opacity: 0
    })
};

// --- Step 1: Academics ---
export function StepAcademics({ data, updateData, onNext }: StepProps) {
    const isValidGwa = !data.gwa || (parseFloat(data.gwa) >= 1.0 && parseFloat(data.gwa) <= 100);

    return (
        <div className="flex flex-col gap-6 pb-12">
            <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center size-16 rounded-full bg-blue-50 text-primary mb-4">
                    <BookOpen size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Academic Standing</h3>
                <p className="text-gray-500">Let&apos;s start with your grades. What is your General Weighted Average (GWA)?</p>
            </div>

            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-900">GWA / Average Grade</label>
                <input
                    type="number"
                    value={data.gwa || ''}
                    onChange={(e) => updateData('gwa', e.target.value)}
                    placeholder="e.g. 92 or 1.5"
                    className={clsx(
                        "w-full text-center text-3xl font-bold p-4 bg-transparent border-b-2 outline-none transition-all placeholder:text-slate-400 text-slate-900",
                        !isValidGwa ? "border-red-500 text-red-600 focus:border-red-600" : "border-gray-200 focus:border-primary"
                    )}
                    autoFocus
                />
                {!isValidGwa && (
                    <p className="text-xs text-center text-red-600 font-medium mt-1">Please enter a valid GWA (70-100 or 1.0-5.0)</p>
                )}
                <p className="text-xs text-center text-slate-500">If you use a 1.0-5.0 scale, we&apos;ll convert it automatically.</p>
            </div>

            <button
                onClick={onNext}
                disabled={!data.gwa}
                className="w-full mt-6 bg-primary text-white py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-900 transition-colors shadow-lg shadow-primary/20"
            >
                Continue
            </button>
        </div>
    );
}

// --- Step 2: Education Type ---
export function StepEducation({ data, updateData, onNext, onBack }: StepProps) {
    const options = [
        { id: 'public', label: 'Public School', desc: 'Tuition-free government schools' },
        { id: 'private-voucher', label: 'Private (Voucher)', desc: 'Private school with ESC/Voucher' },
        { id: 'private-full', label: 'Private (Full Pay)', desc: 'Paying full tuition fees' },
    ];

    return (
        <div className="flex flex-col gap-6 pb-12">
            <div className="text-center mb-2">
                <div className="inline-flex items-center justify-center size-16 rounded-full bg-green-50 text-secondary mb-4">
                    <School size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">School Type</h3>
                <p className="text-gray-500">Where did you graduate Senior High School?</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => { updateData('educationType', opt.id); onNext(); }}
                        className={clsx(
                            "p-4 rounded-xl border-2 text-left transition-all hover:shadow-md flex flex-col gap-1",
                            data.educationType === opt.id
                                ? "border-secondary bg-green-50/50"
                                : "border-gray-100 bg-white hover:border-green-100"
                        )}
                    >
                        <span className="font-bold text-gray-900">{opt.label}</span>
                        <span className="text-xs text-gray-500">{opt.desc}</span>
                    </button>
                ))}
            </div>

            <button onClick={onBack} className="text-gray-400 font-medium text-sm hover:text-gray-600">Back</button>
        </div>
    );
}

// --- Step 3: Path ---
export function StepPath({ data, updateData, onNext, onBack }: StepProps) {
    const strands = ["STEM", "ABM", "HUMSS", "GAS", "TVL (ICT)", "TVL (Home Ec)", "Arts & Design", "Sports"];

    return (
        <div className="flex flex-col gap-6 pb-12">
            <div className="text-center mb-2">
                <div className="inline-flex items-center justify-center size-16 rounded-full bg-purple-50 text-purple-600 mb-4">
                    <GraduationCap size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Target Path</h3>
                <p className="text-gray-500">Select your SHS Strand or Target Course field.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {strands.map((strand) => (
                    <button
                        key={strand}
                        onClick={() => { updateData('strand', strand); onNext(); }}
                        className={clsx(
                            "p-3 rounded-xl border text-sm font-bold transition-all",
                            data.strand === strand
                                ? "bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-200"
                                : "bg-white border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600"
                        )}
                    >
                        {strand}
                    </button>
                ))}
            </div>

            <button onClick={onBack} className="text-gray-400 font-medium text-sm hover:text-gray-600">Back</button>
        </div>
    );
}

// --- Step 4: Financials ---
export function StepFinancials({ data, updateData, onNext, onBack }: StepProps) {
    const incomes = [
        { id: 'low', label: 'Below ₱250,000', desc: 'Annual Household Income' },
        { id: 'mid', label: '₱250,000 - ₱500,000', desc: 'Annual Household Income' },
        { id: 'high', label: 'Above ₱500,000', desc: 'Annual Household Income' },
    ];

    return (
        <div className="flex flex-col gap-6 pb-12">
            <div className="text-center mb-2">
                <div className="inline-flex items-center justify-center size-16 rounded-full bg-orange-50 text-orange-500 mb-4">
                    <Banknote size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Financial Status</h3>
                <p className="text-gray-500">This helps us match need-based scholarships.</p>
            </div>

            <div className="space-y-3">
                {incomes.map((inc) => (
                    <button
                        key={inc.id}
                        onClick={() => { updateData('income', inc.id); onNext(); }}
                        className={clsx(
                            "w-full p-4 rounded-xl border-2 text-left transition-all hover:shadow-md flex items-center justify-between",
                            data.income === inc.id
                                ? "border-orange-500 bg-orange-50/50"
                                : "border-gray-100 bg-white hover:border-orange-200"
                        )}
                    >
                        <div>
                            <h4 className="font-bold text-gray-900">{inc.label}</h4>
                            <p className="text-xs text-gray-500">{inc.desc}</p>
                        </div>
                        <div className={clsx("size-5 rounded-full border-2 flex items-center justify-center", data.income === inc.id ? "border-orange-500" : "border-gray-300")}>
                            {data.income === inc.id && <div className="size-2.5 rounded-full bg-orange-500" />}
                        </div>
                    </button>
                ))}
            </div>

            <button onClick={onBack} className="text-gray-400 font-medium text-sm hover:text-gray-600">Back</button>
        </div>
    );
}

// --- Step 5: Location ---
export function StepLocation({ data, updateData, onNext, onBack }: StepProps) {
    // Simplified list for demo
    const regions = ["Metro Manila", "Cebu", "Davao", "Iloilo", "Baguio", "Others"];

    return (
        <div className="flex flex-col gap-6 pb-12">
            <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center size-16 rounded-full bg-red-50 text-red-500 mb-4">
                    <MapPin size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Location</h3>
                <p className="text-gray-500">Find scholarships available in your area.</p>
            </div>

            <div className="space-y-4">
                <div className="relative">
                    <select
                        className="w-full p-4 rounded-xl bg-slate-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all font-medium text-slate-900 appearance-none cursor-pointer hover:bg-slate-100"
                        value={data.location || ''}
                        onChange={(e) => updateData('location', e.target.value)}
                    >
                        <option value="" disabled className="text-slate-400">Select your region</option>
                        {regions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    {/* Select Arrow Icon Overlay could go here, but appearance-none removes default, so we might want to add custom arrow or just rely on browser default if we remove appearance-none. The prompt asked for custom bg. Let's keep simple for now or add pointer-events-none icon. */}
                </div>
                <p className="text-xs text-center text-slate-500">Selecting &apos;Others&apos; will show nationwide grants.</p>
            </div>

            <div className="mt-4 space-y-3">
                <button
                    onClick={onNext}
                    disabled={!data.location}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-900 transition-colors shadow-lg shadow-primary/20"
                >
                    See Matches
                </button>
                <button onClick={onBack} className="w-full py-3 text-gray-400 font-medium text-sm hover:text-gray-600">Back</button>
            </div>
        </div>
    );
}
