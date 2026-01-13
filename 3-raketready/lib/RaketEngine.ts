/**
 * RaketEngine - Philippine Freelancer Tax Logic Engine
 * Based on 2026 EOPT (Ease of Paying Taxes) Act Standards
 */

// --- Types ---

export interface TaxInputs {
    grossIncome: number;
    isLicensed: boolean;
    hasTradeName: boolean;
    isMixedIncome: boolean;
}

export interface RoadmapStep {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'active' | 'completed';
    order: number;
}

export interface TaxProfile {
    // Tax Calculations
    tax8Percent: number;
    taxGraduated: number;
    recommendedRegime: '8%' | 'graduated';
    taxDueEstimate: number;
    savings: number;

    // Compliance
    isEligibleFor8Percent: boolean;
    isVatLiable: boolean;
    birForm: '1701' | '1701A';
    eoptAlert: string;

    // Registration
    stepList: RoadmapStep[];
    documentChecklist: string[];
}

// --- Constants ---

const VAT_THRESHOLD = 3_000_000;
const EXEMPTION_AMOUNT = 250_000;

// 2026 Graduated Tax Table (TRAIN Law as amended)
const GRADUATED_TAX_TABLE = [
    { min: 0, max: 250_000, rate: 0, base: 0 },
    { min: 250_000, max: 400_000, rate: 0.15, base: 0 },
    { min: 400_000, max: 800_000, rate: 0.20, base: 22_500 },
    { min: 800_000, max: 2_000_000, rate: 0.25, base: 102_500 },
    { min: 2_000_000, max: 8_000_000, rate: 0.30, base: 402_500 },
    { min: 8_000_000, max: Infinity, rate: 0.35, base: 2_202_500 },
];

// --- Engine Class ---

export class RaketEngine {
    private inputs: TaxInputs;

    constructor(inputs: TaxInputs) {
        this.inputs = inputs;
    }

    /**
     * Main computation method - returns the full TaxProfile
     */
    compute(): TaxProfile {
        const { grossIncome, isLicensed, hasTradeName, isMixedIncome } = this.inputs;

        // --- Tax Calculations ---
        const isVatLiable = grossIncome > VAT_THRESHOLD;
        const isEligibleFor8Percent = !isVatLiable;

        // 8% Flat Rate Calculation
        const tax8Percent = this.calculate8PercentTax(grossIncome, isMixedIncome, isEligibleFor8Percent);

        // Graduated Rates Calculation (using OSD - 40% of Gross as deduction)
        const taxGraduated = this.calculateGraduatedTax(grossIncome);

        // Recommendation Logic
        const recommendedRegime = this.determineRecommendedRegime(tax8Percent, taxGraduated, isEligibleFor8Percent);
        const taxDueEstimate = recommendedRegime === '8%' ? tax8Percent : taxGraduated;
        const savings = Math.abs(tax8Percent - taxGraduated);

        // --- Compliance ---
        const birForm = isMixedIncome ? '1701' : '1701A';
        const eoptAlert = "No BIR Form 0605 / Annual Registration Fee required starting 2026 under the EOPT Act.";

        // --- Registration Steps ---
        const stepList = this.generateStepList(hasTradeName, isLicensed);
        const documentChecklist = this.generateChecklist(hasTradeName, isLicensed);

        return {
            tax8Percent,
            taxGraduated,
            recommendedRegime,
            taxDueEstimate,
            savings,
            isEligibleFor8Percent,
            isVatLiable,
            birForm,
            eoptAlert,
            stepList,
            documentChecklist,
        };
    }

    /**
     * 8% Flat Rate Tax
     * - Purely Freelance: 8% of (Gross - 250k)
     * - Mixed Income: 8% of full Gross (exemption used in compensation)
     */
    private calculate8PercentTax(gross: number, isMixed: boolean, isEligible: boolean): number {
        if (!isEligible) return 0; // Not applicable if over VAT threshold

        if (isMixed) {
            return gross * 0.08;
        } else {
            const taxableBase = Math.max(0, gross - EXEMPTION_AMOUNT);
            return taxableBase * 0.08;
        }
    }

    /**
     * Graduated Tax Rates (2026 Schedule)
     * Assumes Optional Standard Deduction (OSD) = 40% of Gross
     * Net Taxable Income = Gross * 60%
     */
    private calculateGraduatedTax(gross: number): number {
        // Apply OSD (40% deduction)
        const netTaxableIncome = gross * 0.60;

        // Find applicable bracket
        for (const bracket of GRADUATED_TAX_TABLE) {
            if (netTaxableIncome > bracket.min && netTaxableIncome <= bracket.max) {
                const excessAmount = netTaxableIncome - bracket.min;
                return bracket.base + excessAmount * bracket.rate;
            }
        }

        // If above 8M (last bracket)
        const lastBracket = GRADUATED_TAX_TABLE[GRADUATED_TAX_TABLE.length - 1];
        if (netTaxableIncome > lastBracket.min) {
            const excessAmount = netTaxableIncome - lastBracket.min;
            return lastBracket.base + excessAmount * lastBracket.rate;
        }

        return 0;
    }

    /**
     * Determine the recommended tax regime
     */
    private determineRecommendedRegime(
        tax8: number,
        taxGrad: number,
        isEligible: boolean
    ): '8%' | 'graduated' {
        if (!isEligible) return 'graduated'; // 8% not available
        return tax8 <= taxGrad ? '8%' : 'graduated';
    }

    /**
     * Generate the registration roadmap steps
     */
    private generateStepList(hasTradeName: boolean, isLicensed: boolean): RoadmapStep[] {
        const steps: RoadmapStep[] = [];
        let order = 1;

        // Step 1: DTI (if Trade Name)
        if (hasTradeName) {
            steps.push({
                id: 'dti',
                title: 'DTI Registration',
                description: 'Register your Business Name at the Department of Trade and Industry (DTI).',
                status: 'active',
                order: order++,
            });
        }

        // Step 2: LGU / PTR
        if (isLicensed) {
            steps.push({
                id: 'ptr',
                title: 'Professional Tax Receipt (PTR)',
                description: 'Pay your PTR at the City/Municipal Hall where you practice.',
                status: hasTradeName ? 'pending' : 'active',
                order: order++,
            });
        } else {
            steps.push({
                id: 'lgu',
                title: "Mayor's Permit / OTR",
                description: 'Secure a business permit or Occupational Tax Receipt (OTR) from your LGU.',
                status: hasTradeName ? 'pending' : 'active',
                order: order++,
            });
        }

        // Step 3: BIR Registration
        steps.push({
            id: 'bir',
            title: 'BIR Registration (Form 1901)',
            description: 'File BIR Form 1901 at your Revenue District Office (RDO).',
            status: 'pending',
            order: order++,
        });

        // Step 4: Invoicing & Books
        steps.push({
            id: 'invoicing',
            title: 'Invoicing & Books of Accounts',
            description: 'Print Official Receipts (ORs) / Invoices and register your Books of Accounts.',
            status: 'pending',
            order: order++,
        });

        return steps;
    }

    /**
     * Generate the document checklist based on profile
     */
    private generateChecklist(hasTradeName: boolean, isLicensed: boolean): string[] {
        const checklist: string[] = [
            'BIR Form 1901 (2 copies)',
            'Valid Government-Issued ID (with 3 photocopies)',
            'Proof of Address (Utility Bill or Barangay Certificate)',
        ];

        if (hasTradeName) {
            checklist.push('DTI Certificate of Business Name Registration');
        }

        if (isLicensed) {
            checklist.push('PRC ID (Photocopy)');
            checklist.push('Professional Tax Receipt (PTR) for current year');
        } else {
            checklist.push("Mayor's Permit or Occupational Tax Receipt (OTR)");
        }

        checklist.push(
            'Contract of Lease (if renting office) or Proof of Residence (if home-based)',
            'Sample layout of Official Receipt / Invoice',
            'Books of Accounts (Journal and Ledger)',
        );

        return checklist;
    }
}

// --- Utility Function (Optional Export) ---

export function computeTaxProfile(inputs: TaxInputs): TaxProfile {
    const engine = new RaketEngine(inputs);
    return engine.compute();
}
