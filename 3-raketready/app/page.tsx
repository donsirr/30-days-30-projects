import { Header } from "@/components/Header";
import { TaxCalculator } from "@/components/TaxCalculator";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent/20">
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <Header />
        <main>
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Freelance Tax Calculator</h2>
            <p className="text-foreground/60 max-w-2xl">
              Simplify your tax compliance journey. Compare rates, generate your registration roadmap, and get 2026-ready with the latest Bureau of Internal Revenue (BIR) guidelines.
            </p>
          </div>
          <TaxCalculator />
        </main>

        <footer className="mt-20 pt-8 border-t border-border text-center text-sm text-foreground/40">
          <p>&copy; 2026 Raket-Ready. Not official legal or tax advice. Consult a CPA for specific cases.</p>
        </footer>
      </div>
    </div>
  );
}
