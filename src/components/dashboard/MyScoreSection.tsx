import React from 'react';
import { Flame, Zap, Award, Coins, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MyScoreSection: React.FC = () => {
  const { currentUser, incrementStreak } = useApp();

  const xpCurrentLevel = currentUser.xp % 500;
  const xpRequiredNext = 500;
  const xpPercent = Math.min(100, Math.round((xpCurrentLevel / xpRequiredNext) * 100));

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0B0F19]/90 p-5 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30">
            <Flame className="h-5 w-5 fill-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Mon Score & Progression
            </h3>
            <p className="text-xs text-slate-400">
              Activité quotidienne, flammes et badges de la 2
            </p>
          </div>
        </div>

        <button
          onClick={incrementStreak}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:brightness-110 active:scale-95 transition-all"
        >
          <Flame className="h-4 w-4 fill-slate-950" />
          <span>Valider flamme ({currentUser.streakDays}j)</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {/* Streak */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-2xl font-black text-amber-400">
            <Flame className="h-6 w-6 fill-amber-400" />
            <span>{currentUser.streakDays}</span>
          </div>
          <p className="text-xs font-medium text-slate-300 mt-1">Jours consécutifs</p>
          <p className="text-[10px] text-slate-400">Série de flammes</p>
        </div>

        {/* Level */}
        <div className="rounded-2xl border border-violet-500/20 bg-violet-600/5 p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-2xl font-black text-violet-400">
            <Zap className="h-6 w-6" />
            <span>Niv. {currentUser.level}</span>
          </div>
          <p className="text-xs font-medium text-slate-300 mt-1">Rang actuel</p>
          <p className="text-[10px] text-slate-400">{currentUser.title}</p>
        </div>

        {/* Total XP */}
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-2xl font-black text-cyan-400">
            <TrendingUp className="h-6 w-6" />
            <span>{currentUser.xp}</span>
          </div>
          <p className="text-xs font-medium text-slate-300 mt-1">Points d'XP</p>
          <p className="text-[10px] text-slate-400">Cumulés en jeu & chat</p>
        </div>

        {/* Coins */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-2xl font-black text-emerald-400">
            <Coins className="h-6 w-6" />
            <span>{currentUser.coins}</span>
          </div>
          <p className="text-xs font-medium text-slate-300 mt-1">Pièces</p>
          <p className="text-[10px] text-slate-400">Dépensables en boutique</p>
        </div>
      </div>

      {/* Level Progress Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 mb-5">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-slate-200">
            Niveau {currentUser.level} ➔ Niveau {currentUser.level + 1}
          </span>
          <span className="text-violet-400 font-bold">
            {xpCurrentLevel} / {xpRequiredNext} XP ({xpPercent}%)
          </span>
        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 transition-all duration-500 shadow-[0_0_12px_rgba(139,92,246,0.6)]"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          Gagnez des points d'XP en participant aux salons (+5 XP par message) et en remportant des quizz (+35 XP par bonne réponse) !
        </p>
      </div>

      {/* Unlocked Badges */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
          Badges débloqués ({currentUser.badges.length})
        </h4>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-600/10 px-3 py-1.5 text-xs font-semibold text-violet-300">
            <span>🔮</span>
            <span>Pionnier de la 2</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300">
            <span>🔥</span>
            <span>Flamme 7 Jours</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300">
            <span>🧠</span>
            <span>Quiz Master</span>
          </div>
        </div>
      </div>
    </div>
  );
};
