'use client';

import React, { useState } from 'react';
import HeroCard from "@/components/HeroCard";
import UrgentDeadlinesCard from "@/components/UrgentDeadlinesCard";
import DocumentVaultCard from "@/components/DocumentVaultCard";
import MatchFeed from "@/components/MatchFeed";
import EligibilityQuiz from "@/components/quiz/EligibilityQuiz";

export default function Home() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min pb-20">
        <HeroCard onStart={() => setIsQuizOpen(true)} />
        <UrgentDeadlinesCard />
        <DocumentVaultCard />
        <MatchFeed />
      </div>

      <EligibilityQuiz
        key={isQuizOpen ? 'open' : 'closed'}
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />
    </>
  );
}
