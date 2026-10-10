import React from 'react';
import { FriendMoodSection } from './FriendMoodSection';
import { MyScoreSection } from './MyScoreSection';
import { LeaderboardSection } from './LeaderboardSection';
import { MarketplaceSection } from './MarketplaceSection';

interface DashboardPageProps {
  onOpenNewQuiz: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onOpenNewQuiz }) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] overflow-y-auto bg-[#0B0F19] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-900/20 via-indigo-900/20 to-cyan-900/10 p-6 shadow-xl backdrop-blur-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Tableau de Bord Communautaire ⚡
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Suivez l'énergie du groupe, validez votre streak de flammes quotidienne, et débloquez des récompenses exclusives !
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNewQuiz}
              className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              Lancer un Défi Quizz 🧠
            </button>
          </div>
        </div>

        {/* 1. Météo des Humeurs (FriendMood) */}
        <FriendMoodSection />

        {/* 2. My Score & Streak */}
        <MyScoreSection />

        {/* 3. Grid for Leaderboard & Marketplace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LeaderboardSection />
          <MarketplaceSection />
        </div>
      </div>
    </div>
  );
};
