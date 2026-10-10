import React, { useState } from 'react';
import { Smile, Sparkles, Clock, Check } from 'lucide-react';
import { useApp, MOOD_DEFINITIONS } from '../../context/AppContext';
import { MoodType } from '../../types';
import { Avatar } from '../chat/Avatar';

export const FriendMoodSection: React.FC = () => {
  const { currentUser, updateMood, friends } = useApp();
  const [customStatusInput, setCustomStatusInput] = useState<string>(
    currentUser.mood.customStatus || ''
  );
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const handleSelectMood = (type: MoodType) => {
    updateMood(type, customStatusInput);
    setIsUpdating(false);
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    updateMood(currentUser.mood.type, customStatusInput);
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0B0F19]/90 p-5 sm:p-6 shadow-xl">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/30">
            <Smile className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Météo des Humeurs (FriendMood)
            </h3>
            <p className="text-xs text-slate-400">
              Partagez votre vibe du jour avec l'équipe Sur la 2
            </p>
          </div>
        </div>

        {/* Current User Mood Badge */}
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-1.5 border text-xs font-semibold"
          style={{
            borderColor: `${currentUser.mood.color}40`,
            backgroundColor: `${currentUser.mood.color}15`,
            color: currentUser.mood.color,
          }}
        >
          <span className="text-base">{currentUser.mood.emoji}</span>
          <span>{currentUser.mood.label}</span>
        </div>
      </div>

      {/* Mood Selector Wheel */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
          Quelle est votre humeur actuelle ?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {(Object.entries(MOOD_DEFINITIONS) as [MoodType, { label: string; emoji: string; color: string }][]).map(
            ([type, def]) => {
              const isSelected = currentUser.mood.type === type;
              return (
                <button
                  key={type}
                  onClick={() => handleSelectMood(type)}
                  className={`flex flex-col items-center justify-center rounded-2xl border p-3 transition-all hover:scale-102 ${
                    isSelected
                      ? 'border-violet-500 bg-violet-600/20 text-white shadow-[0_0_15px_rgba(139,92,246,0.25)] ring-1 ring-violet-500'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="text-2xl mb-1">{def.emoji}</span>
                  <span className="text-[11px] font-semibold text-center leading-tight">
                    {def.label}
                  </span>
                </button>
              );
            }
          )}
        </div>

        {/* Custom Status Note */}
        <form onSubmit={handleSaveStatus} className="mt-3 flex gap-2">
          <input
            type="text"
            value={customStatusInput}
            onChange={(e) => setCustomStatusInput(e.target.value)}
            placeholder="Un petit mot sur votre journée (ex: Révise les partiels, en pause café...)"
            className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Mettre à jour
          </button>
        </form>
      </div>

      {/* Friends' Live Mood Feed */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Humeurs des membres en direct
          </h4>
          <span className="text-[11px] text-slate-400">
            {friends.length} amis connectés
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3 hover:border-slate-700/80 transition-colors"
            >
              <Avatar
                src={friend.avatar}
                name={friend.displayName}
                size="md"
                moodEmoji={friend.mood.emoji}
                statusOnline={true}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-semibold text-white truncate">
                    {friend.displayName}
                  </span>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {friend.mood.updatedAt}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: friend.mood.color }}
                  />
                  <span className="text-[11px] font-medium text-slate-300 truncate">
                    {friend.mood.label}
                  </span>
                </div>

                {friend.mood.customStatus && (
                  <p className="text-[10px] text-slate-400 truncate mt-0.5 italic">
                    "{friend.mood.customStatus}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
