import React, { useState } from 'react';
import {
  User,
  Volume2,
  VolumeX,
  Smartphone,
  Save,
  Check,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../chat/Avatar';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
];

export const SettingsPage: React.FC = () => {
  const { currentUser, updateUserProfile, isSoundMuted, toggleSound } = useApp();

  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser.avatar);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      displayName: displayName.trim(),
      username: username.trim(),
      bio: bio.trim(),
      avatar: selectedAvatar,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] overflow-y-auto bg-[#0B0F19] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="rounded-3xl border border-slate-800 bg-[#0B0F19]/90 p-6 shadow-xl">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Paramètres & Profil Personnel ⚙️
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Personnalisez votre apparence, vos notifications sonores et gérez votre identité Sur la 2.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-semibold text-emerald-300 animate-in fade-in">
            <Check className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>Modifications enregistrées avec succès !</span>
          </div>
        )}

        {/* Profile Card Form */}
        <form onSubmit={handleSave} className="rounded-3xl border border-slate-800 bg-[#0B0F19]/90 p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600/20 text-violet-400 ring-1 ring-violet-500/30">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Identité & Avatar
              </h3>
              <p className="text-xs text-slate-400">
                Visible par l'ensemble des membres dans les salons de chat et sur le tableau de bord
              </p>
            </div>
          </div>

          {/* Avatar Presets Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2.5">
              Choisir un Avatar Néon
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {AVATAR_PRESETS.map((avUrl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedAvatar(avUrl)}
                  className={`rounded-2xl p-1 transition-all hover:scale-105 ${
                    selectedAvatar === avUrl
                      ? 'ring-2 ring-violet-500 bg-violet-500/20 shadow-[0_0_12px_rgba(139,92,246,0.5)]'
                      : 'opacity-70 hover:opacity-100 ring-1 ring-slate-800'
                  }`}
                >
                  <Avatar src={avUrl} name={`Preset ${i}`} size="lg" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nom d'affichage
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-violet-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Identifiant (@username)
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Biographie ou devise
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Un petit mot sur vos centres d'intérêt..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-violet-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              <Save className="h-4 w-4" />
              <span>Enregistrer le profil</span>
            </button>
          </div>
        </form>

        {/* Audio & Effects Settings */}
        <div className="rounded-3xl border border-slate-800 bg-[#0B0F19]/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/30">
                {isSoundMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Effets Sonores & Carillons</h3>
                <p className="text-xs text-slate-400">
                  Sons synthétiques pour les nouveaux messages, bonnes réponses aux quizz et montées de niveau
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleSound}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                !isSoundMuted
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {!isSoundMuted ? 'Activé 🔔' : 'Coupe-son 🔕'}
            </button>
          </div>
        </div>

        {/* PWA & Mobile Install Guide */}
        <div className="rounded-3xl border border-slate-800 bg-[#0B0F19]/90 p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Installation Mobile (PWA)</h3>
              <p className="text-xs text-slate-400">
                Sur la 2 est conçue pour fonctionner comme une application native
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="font-bold text-white mb-1">📱 Sur iOS (Safari)</p>
              <p className="text-slate-400 leading-relaxed">
                Appuyez sur le bouton de partage en bas de l'écran, puis sélectionnez{' '}
                <span className="text-violet-300 font-semibold">"Sur l'écran d'accueil"</span> pour profiter du mode plein écran sans barre d'adresse.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="font-bold text-white mb-1">🤖 Sur Android (Chrome)</p>
              <p className="text-slate-400 leading-relaxed">
                Cliquez sur le menu à trois points en haut à droite, puis sur{' '}
                <span className="text-cyan-300 font-semibold">"Installer l'application"</span> pour recevoir les alertes push directement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
