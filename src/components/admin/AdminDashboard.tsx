import React from 'react';
import {
  ShieldAlert,
  Users,
  MessageSquare,
  Brain,
  Zap,
  TrendingUp,
  Sliders,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminCharts } from './AdminCharts';
import { NotificationComposer } from './NotificationComposer';
import { AdminLogs } from './AdminLogs';

export const AdminDashboard: React.FC = () => {
  const { currentUser, toggleRole } = useApp();

  return (
    <div className="min-h-[calc(100vh-4rem)] overflow-y-auto bg-[#0B0F19] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Admin Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-rose-500/20 bg-gradient-to-r from-rose-950/30 via-slate-900 to-indigo-950/20 p-6 sm:p-8 shadow-xl backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-400">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Console Administrateur</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Gestion & Modération Sur la 2 🛡️
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Surveillez la santé de la communauté, diffusez des annonces push aux membres, analysez les métriques d'engagement et consultez les journaux d'audit.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleRole}
              className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-2.5 text-xs font-bold text-slate-200 hover:border-slate-600 transition-all"
            >
              <Sliders className="h-4 w-4 text-slate-400" />
              <span>
                {currentUser.role === 'admin'
                  ? 'Passer en mode Membre'
                  : 'Repasser en mode Admin'}
              </span>
            </button>
          </div>
        </div>

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-3xl border border-slate-800 bg-[#0B0F19]/90 p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Membres Actifs</span>
              <Users className="h-4 w-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-black text-white">78</p>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>+12% cette semaine</span>
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#0B0F19]/90 p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Messages échangés</span>
              <MessageSquare className="h-4 w-4 text-violet-400" />
            </div>
            <p className="text-2xl font-black text-white">1,368</p>
            <p className="text-[11px] text-violet-400 mt-1 flex items-center gap-1">
              <Zap className="h-3 w-3" />
              <span>Salons très animés</span>
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#0B0F19]/90 p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Quizz Complétés</span>
              <Brain className="h-4 w-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white">314</p>
            <p className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
              <span>Moyenne 74% de réussite</span>
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#0B0F19]/90 p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Taux d'Engagement</span>
              <Zap className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white">94.2%</p>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <span>Excellent rétention</span>
            </p>
          </div>
        </div>

        {/* Charts & Broadcast Composer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminCharts />
          <NotificationComposer />
        </div>

        {/* Audit Logs */}
        <AdminLogs />
      </div>
    </div>
  );
};
