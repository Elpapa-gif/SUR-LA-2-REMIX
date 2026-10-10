import React from 'react';
import { ShieldAlert, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminLogs: React.FC = () => {
  const { auditLogs } = useApp();

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0B0F19]/90 p-5 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/30">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Journaux Système & Sécurité (Audit Logs)
            </h3>
            <p className="text-xs text-slate-400">
              Traçabilité des actions communautaires et modérations
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-400">
          {auditLogs.length} événements
        </span>
      </div>

      <div className="space-y-2">
        {auditLogs.map((log) => {
          const icon =
            log.severity === 'success' ? (
              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : log.severity === 'warning' ? (
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
            ) : (
              <Info className="h-4 w-4 text-cyan-400 shrink-0" />
            );

          return (
            <div
              key={log.id}
              className="flex items-start gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-3 hover:border-slate-700/80 transition-colors"
            >
              <div className="mt-0.5">{icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">
                    {log.action}
                  </span>
                  <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {log.details}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
                  <span>Effectué par : {log.actorName}</span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{log.actorRole}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
