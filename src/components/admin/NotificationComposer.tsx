import React, { useState } from 'react';
import { Send, Bell, Check, AlertTriangle, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminBroadcastNotification } from '../../types';

export const NotificationComposer: React.FC = () => {
  const { sendAdminBroadcast, broadcasts } = useApp();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [type, setType] = useState<AdminBroadcastNotification['type']>('announcement');
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    sendAdminBroadcast(title.trim(), content.trim(), type);
    setTitle('');
    setContent('');
    setSentSuccess(true);

    setTimeout(() => {
      setSentSuccess(false);
    }, 3000);
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0B0F19]/90 p-5 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/30">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Diffuseur de Notifications Push
            </h3>
            <p className="text-xs text-slate-400">
              Envoyez une annonce ou alerte instantanée à tous les membres
            </p>
          </div>
        </div>
      </div>

      {sentSuccess && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-300 animate-in fade-in">
          <Check className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>Notification globale diffusée avec succès à tous les membres !</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Titre de la notification
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Tournoi Quiz spécial ce soir à 20h"
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Type d'annonce
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-rose-500 focus:outline-none"
            >
              <option value="announcement">📢 Annonce</option>
              <option value="reward">🎁 Récompense</option>
              <option value="alert">⚠️ Alerte</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Message
          </label>
          <textarea
            required
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Détails de l'annonce, instructions pour les participants..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-rose-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Diffuser la notification</span>
          </button>
        </div>
      </form>

      {/* Recent broadcasts list */}
      <div className="mt-6 border-t border-slate-800/80 pt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Dernières annonces diffusées ({broadcasts.length})
        </h4>

        <div className="space-y-2">
          {broadcasts.map((b) => (
            <div
              key={b.id}
              className="flex items-start justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{b.title}</span>
                  <span className="text-[10px] text-slate-400">· {b.sentAt}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {b.content}
                </p>
              </div>

              <span className="text-[10px] text-slate-500 shrink-0 ml-2">
                Par {b.sentBy}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
