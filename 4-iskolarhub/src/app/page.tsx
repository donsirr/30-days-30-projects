import HeroCard from "@/components/HeroCard";
import UrgentDeadlinesCard from "@/components/UrgentDeadlinesCard";
import DocumentVaultCard from "@/components/DocumentVaultCard";
import MatchFeed from "@/components/MatchFeed";

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min pb-20">
      {/* 
        Bento Grid Layout:
        - Hero Card: Top left, spans 2x2 on desktop
        - Urgent deadlines: Top right
        - Document Vault: Middle right
        - Match Feed: Bottom, spans full width
      */}
      <HeroCard />
      <UrgentDeadlinesCard />
      <DocumentVaultCard />
      <MatchFeed />
    </div>
  );
}
