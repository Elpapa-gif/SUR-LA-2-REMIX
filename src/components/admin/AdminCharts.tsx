import React from 'react';
import { BarChart3, TrendingUp, Users, MessageSquare } from 'lucide-react';

export const AdminCharts: React.FC = () => {
  // Weekly simulated activity distribution
  const days = [
    { label: 'Lun', messages: 142, quizzes: 24, heightMsg: '65%', heightQuiz: '30%' },
    { label: 'Mar', messages: 189, quizzes: 38, heightMsg: '82%', heightQuiz: '45%' },
    { label: 'Mer', messages: 210, quizzes: 45, heightMsg: '92%', heightQuiz: '55%' },
    { label: 'Jeu', messages: 175, quizzes: 32, heightMsg: '76%', heightQuiz: '40%' },
    { label: 'Ven', messages: 245, quizzes: 62, heightMsg: '100%', heightQuiz: '75%' },
    { label: 'Sam', messages: 220, quizzes: 70, heightMsg: '95%', heightQuiz: '85%' },
    { label: 'Dim', messages: 198, quizzes: 58, heightMsg: '85%', heightQuiz: '70%' },
  ];

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0B0F19]/90 p-5 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600/20 text-violet-400 ring-1 ring-violet-500/30">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Activité des Salons & Quizz
            </h3>
            <p className="text-xs text-slate-400">
              Volume des messages et participations aux quizz sur 7 jours
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-violet-500 shadow-[0_0_6px_rgba(139,92,246,0.6)]" />
            <span className="text-slate-300">Messages envoyés</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.6)]" />
            <span className="text-slate-300">Quizz joués</span>
          </div>
        </div>
      </div>

      {/* Visual Bar Chart */}
      <div className="h-56 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2">
        {days.map((item) => (
          <div key={item.label} className="flex-1 flex flex-col items-center h-full justify-end group">
            <div className="w-full max-w-[42px] flex items-end justify-center gap-1.5 h-full">
              {/* Message Bar */}
              <div
                className="w-1/2 rounded-t-lg bg-gradient-to-t from-violet-700 to-violet-500 transition-all duration-300 group-hover:brightness-125 relative"
                style={{ height: item.heightMsg }}
              >
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 text-[10px] font-bold text-white px-1.5 py-0.5 rounded shadow z-10 pointer-events-none">
                  {item.messages}
                </span>
              </div>

              {/* Quiz Bar */}
              <div
                className="w-1/2 rounded-t-lg bg-gradient-to-t from-cyan-600 to-cyan-400 transition-all duration-300 group-hover:brightness-125 relative"
                style={{ height: item.heightQuiz }}
              >
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 text-[10px] font-bold text-cyan-300 px-1.5 py-0.5 rounded shadow z-10 pointer-events-none">
                  {item.quizzes}
                </span>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-slate-400 mt-2.5">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
