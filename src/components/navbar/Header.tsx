import React from 'react';
import {
  MessageSquare,
  LayoutDashboard,
  Brain,
  ShieldAlert,
  Flame,
  Coins,
  Volume2,
  VolumeX,
  Settings,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type ActiveTab = 'chat' | 'dashboard' | 'quizzes' | 'admin' | 'settings';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenNewQuiz: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenNewQuiz }) => {
  const {
    currentUser,
    isSoundMuted,
    toggleSound,
    toggleRole,
    incrementStreak,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0B0F19]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('chat')}
            className="group flex items-center gap-2.5 text-left transition-opacity hover:opacity-90"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 shadow-[0_0_15px_rgba(139,92,246,0.35)] transition-transform duration-200 group-hover:scale-105">
              <Zap className="h-5 w-5 text-white" />
              <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950 ring-2 ring-[#0B0F19]">
                2
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-white">
                  Sur la 2
                </span>
                <span className="text-[10px] font-semibold text-cyan-400">
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Chat & Communauté
              </p>
            </div>
          </button>

          {/* Navigation Tabs */}
          <nav className="hidden items-center gap-1 md:flex">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="h-4 w-4 text-violet-400" />
              <span>Salons & Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="h-4 w-4 text-cyan-400" />
              <span>Tableau de Bord</span>
            </button>

            <button
              onClick={() => setActiveTab('quizzes')}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'quizzes'
                  ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <Brain className="h-4 w-4 text-amber-400" />
              <span>Arène Quizz</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'admin'
                  ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="h-4 w-4 text-rose-400" />
              <span>Console Admin</span>
              {currentUser.role === 'admin' && (
                <span className="text-[10px] text-rose-400 font-semibold">★</span>
              )}
            </button>
          </nav>
        </div>

        {/* Right side controls: Streaks, Coins, Audio, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick AI Quiz Launcher */}
          <button
            onClick={onOpenNewQuiz}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_0_12px_rgba(139,92,246,0.3)] transition-all hover:brightness-110 active:scale-95"
            title="Créer ou générer un quiz IA pour le salon"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Nouveau Quiz</span>
          </button>

          {/* Streaks counter */}
          <button
            onClick={incrementStreak}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900/90 border border-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-400 hover:border-amber-500/40 transition-colors"
            title="Cliquez pour valider votre streak d'activité du jour !"
          >
            <Flame className="h-4 w-4 fill-amber-400 text-amber-400 animate-pulse" />
            <span>{currentUser.streakDays}j</span>
          </button>

          {/* Coins balance */}
          <div className="hidden xs:flex items-center gap-1.5 rounded-lg bg-slate-900/90 border border-cyan-500/20 px-2.5 py-1 text-xs font-semibold text-cyan-400">
            <Coins className="h-3.5 w-3.5" />
            <span>{currentUser.coins}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-colors"
            title={isSoundMuted ? 'Activer le son' : 'Couper le son'}
            aria-label="Toggle sound"
          >
            {isSoundMuted ? (
              <VolumeX className="h-4 w-4 text-slate-500" />
            ) : (
              <Volume2 className="h-4 w-4 text-emerald-400" />
            )}
          </button>

          {/* Role Switcher (Admin / Membre testing) */}
          <button
            onClick={toggleRole}
            className={`hidden sm:inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium transition-colors ${
              currentUser.role === 'admin'
                ? 'border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
            }`}
            title="Basculez entre le mode Membre et Admin pour tester les fonctionnalités"
          >
            <span>{currentUser.role === 'admin' ? 'Admin' : 'Membre'}</span>
          </button>

          {/* Profile & Settings button */}
          <button
            onClick={() => setActiveTab('settings')}
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 p-1 pr-2.5 text-left transition-colors hover:border-slate-700"
          >
            <div className="relative h-7 w-7 rounded-lg overflow-hidden ring-1 ring-violet-500/40">
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                className="h-full w-full object-cover"
              />
              <span
                className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-slate-900"
                style={{ backgroundColor: currentUser.mood.color }}
              />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-slate-200 leading-none">
                {currentUser.displayName}
              </p>
              <p className="text-[10px] text-slate-500 leading-none mt-1">
                Niv. {currentUser.level} · {currentUser.mood.emoji}
              </p>
            </div>
            <Settings className="h-3.5 w-3.5 text-slate-400 ml-0.5" />
          </button>
        </div>
      </div>

      {/* Mobile navigation bar */}
      <div className="flex border-t border-slate-800/80 bg-[#0B0F19] px-2 py-1.5 md:hidden justify-around">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium ${
            activeTab === 'chat' ? 'text-violet-400' : 'text-slate-400'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Chat</span>
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium ${
            activeTab === 'dashboard' ? 'text-cyan-400' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Tableau</span>
        </button>
        <button
          onClick={() => setActiveTab('quizzes')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium ${
            activeTab === 'quizzes' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Brain className="h-4 w-4" />
          <span>Quizz</span>
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium ${
            activeTab === 'admin' ? 'text-rose-400' : 'text-slate-400'
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>Admin</span>
        </button>
      </div>
    </header>
  );
};
