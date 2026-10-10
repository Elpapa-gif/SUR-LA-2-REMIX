import React, { useState } from 'react';
import { Download, Smartphone, X, Check, Share, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallBanner: React.FC = () => {
  const { canInstall, isInstalled, isIOS, installApp } = usePWAInstall();
  const [dismissed, setDismissed] = useState<boolean>(false);
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);

  // If already installed in standalone mode or dismissed by user
  if (isInstalled || dismissed) return null;

  return (
    <>
      {/* Floating Bottom-Right Install Prompt Pill/Card */}
      <div className="fixed bottom-4 right-4 z-40 max-w-sm animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center gap-3 rounded-2xl border border-violet-500/40 bg-[#0B0F19]/95 p-3.5 shadow-[0_0_30px_rgba(139,92,246,0.25)] backdrop-blur-md">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 text-white shadow-md">
            <Smartphone className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0 pr-1">
            <h5 className="text-xs font-bold text-white tracking-tight">
              Installer Sur la 2
            </h5>
            <p className="text-[11px] text-slate-400 truncate">
              Accès instantané & mode plein écran
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {canInstall ? (
              <button
                onClick={installApp}
                className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-md hover:brightness-110 active:scale-95 transition-all"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Installer</span>
              </button>
            ) : isIOS ? (
              <button
                onClick={() => setShowIOSModal(true)}
                className="flex items-center gap-1 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-bold text-violet-300 hover:bg-slate-700 transition-colors"
              >
                <span>Guide iOS</span>
              </button>
            ) : null}

            <button
              onClick={() => setDismissed(true)}
              className="rounded-lg p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors"
              title="Ignorer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Safari Guided Install Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-3xl border border-slate-800 bg-[#0B0F19] p-6 shadow-2xl text-center">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg">
              <Smartphone className="h-6 w-6" />
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              Installer sur iPhone / iPad
            </h3>

            <div className="space-y-3 text-left text-xs text-slate-300 my-4">
              <div className="flex items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <Share className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                <p>
                  1. Appuyez sur le bouton de <strong>Partage</strong> en bas de Safari.
                </p>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <PlusSquare className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
                <p>
                  2. Faites défiler et choisissez <strong>"Sur l'écran d'accueil"</strong>.
                </p>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <Check className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  3. Appuyez sur <strong>Ajouter</strong> en haut à droite !
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full rounded-xl bg-violet-600 py-2.5 text-xs font-bold text-white hover:bg-violet-500"
            >
              Compris !
            </button>
          </div>
        </div>
      )}
    </>
  );
};
